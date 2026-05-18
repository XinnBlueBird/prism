/**
 * MiMo V2.5 Pro client — official endpoint.
 * Uses `api-key:` header (NOT Bearer). UI always labels this "MiMo V2.5 Pro".
 */

type ChatMessage = {
  role: "system" | "user" | "assistant";
  content: string;
};

export type ReasoningChunk =
  | { type: "thinking"; text: string }
  | { type: "content"; text: string }
  | { type: "done" }
  | { type: "error"; message: string };

export const MIMO_DISPLAY_NAME = "MiMo V2.5 Pro";

export async function* streamReasoning(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {},
): AsyncGenerator<ReasoningChunk> {
  const apiKey = process.env.MIMO_API_KEY;
  const baseUrl = process.env.MIMO_API_BASE ?? "https://api.xiaomimimo.com/v1";
  const model = process.env.MIMO_MODEL ?? "mimo-v2.5-pro";

  if (!apiKey) {
    yield { type: "error", message: "MIMO_API_KEY is not configured." };
    return;
  }

  let res: Response;
  try {
    res = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        model,
        messages,
        stream: true,
        temperature: opts.temperature ?? 0.6,
        max_tokens: opts.maxTokens ?? 4096,
      }),
    });
  } catch (err) {
    yield {
      type: "error",
      message: `Network error: ${err instanceof Error ? err.message : "unknown"}`,
    };
    return;
  }

  if (!res.ok || !res.body) {
    const text = await res.text().catch(() => "");
    yield {
      type: "error",
      message: `MiMo upstream ${res.status}: ${text.slice(0, 240)}`,
    };
    return;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const raw of lines) {
      const line = raw.trim();
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (data === "[DONE]") {
        yield { type: "done" };
        return;
      }
      try {
        const json = JSON.parse(data);
        const delta = json.choices?.[0]?.delta ?? {};
        if (delta.reasoning_content) {
          yield { type: "thinking", text: delta.reasoning_content };
        }
        if (delta.content) {
          yield { type: "content", text: delta.content };
        }
      } catch {
        // skip malformed chunk
      }
    }
  }
  yield { type: "done" };
}

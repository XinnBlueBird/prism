import { NextRequest } from "next/server";
import { streamReasoning } from "@/lib/mimo";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are Prism Brainstorm — a creative ideation engine. For a given topic, generate fresh ideas across three categories:

1. **Bold** — ambitious, big-swing ideas with high upside
2. **Practical** — realistic, executable ideas you could ship this week
3. **Wildcard** — unexpected, lateral, or contrarian angles

Generate exactly 4 ideas per category (12 total). Each idea must use this exact format:

[CATEGORY: bold|practical|wildcard] [TITLE: short title here]
One or two sentences describing the idea, what it does, and why it might work.

Be specific. No generic platitudes. No "leverage AI to optimize X" vagueness. Every idea must be concrete enough that someone could start building it tomorrow.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response("Invalid body", { status: 400 });
  }

  const { topic } = body as { topic?: string };
  if (!topic?.trim()) {
    return new Response("Missing topic", { status: 400 });
  }

  const messages = [
    { role: "system" as const, content: SYSTEM },
    {
      role: "user" as const,
      content: `Brainstorm topic: ${topic}\n\nGenerate 12 ideas (4 per category) using the exact format from the system prompt.`,
    },
  ];

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (event: string, data: unknown) => {
        controller.enqueue(
          encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`),
        );
      };
      try {
        for await (const chunk of streamReasoning(messages, {
          temperature: 0.85,
          maxTokens: 3072,
        })) {
          if (chunk.type === "thinking") send("thinking", { text: chunk.text });
          else if (chunk.type === "content") send("content", { text: chunk.text });
          else if (chunk.type === "error") send("error", { message: chunk.message });
          else if (chunk.type === "done") send("done", {});
        }
      } catch (err) {
        send("error", {
          message: err instanceof Error ? err.message : "Unknown error",
        });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
}

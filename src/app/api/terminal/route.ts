import { NextRequest } from "next/server";
import { streamReasoning } from "@/lib/mimo";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are Prism Terminal — a direct, fast, no-nonsense AI assistant running inside a terminal interface. Respond concisely. Reason step by step when needed. Use plain markdown. Avoid fluff and excessive apology.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || !Array.isArray(body.messages)) {
    return new Response("Invalid body", { status: 400 });
  }

  const messages = [
    { role: "system" as const, content: SYSTEM },
    ...body.messages.slice(-20),
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
          temperature: 0.7,
          maxTokens: 2048,
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

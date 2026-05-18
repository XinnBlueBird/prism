import { NextRequest } from "next/server";
import { getLens } from "@/lib/lenses";
import { streamReasoning } from "@/lib/mimo";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response("Invalid body", { status: 400 });
  }

  const { lensId, inputs } = body as {
    lensId?: string;
    inputs?: Record<string, string>;
  };

  if (!lensId) return new Response("Missing lensId", { status: 400 });

  const lens = getLens(lensId);
  if (!lens) return new Response("Unknown lens", { status: 404 });
  if (lens.status !== "available") {
    return new Response("Lens not yet available", { status: 409 });
  }

  // Build user message from inputs
  const formatted = lens.inputs
    .map((field) => {
      const value = inputs?.[field.id]?.trim();
      if (!value) return null;
      return `**${field.label}:** ${value}`;
    })
    .filter(Boolean)
    .join("\n\n");

  if (!formatted) {
    return new Response("Provide at least one required input", { status: 400 });
  }

  const messages = [
    { role: "system" as const, content: lens.systemPrompt },
    {
      role: "user" as const,
      content: `${formatted}\n\n---\nRespond using this exact format:\n\n${lens.outputFormat}`,
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
          temperature: 0.6,
          maxTokens: 4096,
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

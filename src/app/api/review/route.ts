import { NextRequest } from "next/server";
import { streamReasoning } from "@/lib/mimo";

export const runtime = "nodejs";
export const maxDuration = 60;

const SYSTEM = `You are Prism Code Review — an expert code reviewer. Analyze the provided code for:
- Bugs and logic errors (critical)
- Security vulnerabilities (critical)
- Performance issues (warning)
- Code style and best practices (info)

For each issue found, use this exact format:
[SEVERITY: critical|warning|info] [LINE: N or general]
Title of the issue
Explanation of the problem.
Suggested fix with code example.

At the end, provide:
## Summary
- Total issues: N
- Critical: N
- Warning: N  
- Info: N

## Overall Assessment
One paragraph summary with a clear verdict: APPROVE, REQUEST CHANGES, or NEEDS WORK.

Be thorough but not nitpicky. Focus on real issues that affect production quality.`;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  if (!body || typeof body !== "object") {
    return new Response("Invalid body", { status: 400 });
  }

  const { code, context } = body as { code?: string; context?: string };
  if (!code?.trim()) {
    return new Response("Missing code", { status: 400 });
  }

  const userMsg = [
    "**Code to review:**",
    "```",
    code,
    "```",
    context ? `\n**Context:** ${context}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const messages = [
    { role: "system" as const, content: SYSTEM },
    { role: "user" as const, content: userMsg },
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
          temperature: 0.5,
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

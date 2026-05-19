"use client";

import { useState, useRef, useEffect } from "react";
import { Loader2, Play, Sparkles, FileCode2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";
import { LENSES } from "@/lib/lenses";

const AVAILABLE = LENSES.filter((l) => l.status === "available");

export default function WorkspacePage() {
  const [input, setInput] = useState("");
  const [lensId, setLensId] = useState(AVAILABLE[0]?.id ?? "spec");
  const [thinking, setThinking] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [history, setHistory] = useState<
    { lens: string; input: string; output: string; ts: number }[]
  >([]);
  const outRef = useRef<HTMLDivElement>(null);

  const lens = AVAILABLE.find((l) => l.id === lensId) ?? AVAILABLE[0];

  useEffect(() => {
    if (outRef.current) {
      outRef.current.scrollTop = outRef.current.scrollHeight;
    }
  }, [output, thinking]);

  async function run() {
    if (!input.trim() || streaming) return;
    setThinking("");
    setOutput("");
    setStreaming(true);

    try {
      const fields: Record<string, string> = {};
      lens.inputs.forEach((f) => {
        fields[f.id] = input;
      });

      const res = await fetch(`/api/lens/${lens.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ inputs: fields }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let finalOut = "";
      let event = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (line.startsWith("event: ")) {
            event = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (event === "thinking") {
              setThinking((t) => t + data.text);
            } else if (event === "content") {
              finalOut += data.text;
              setOutput(finalOut);
            } else if (event === "error") {
              setOutput(`[error] ${data.message}`);
            }
          }
        }
      }

      setHistory((h) =>
        [
          {
            lens: lens.name,
            input: input.slice(0, 80),
            output: finalOut.slice(0, 120),
            ts: Date.now(),
          },
          ...h,
        ].slice(0, 20),
      );
    } catch (err) {
      setOutput(`[error] ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setStreaming(false);
    }
  }

  return (
    <PageShell active="/workspace">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        <header className="mb-6 flex items-end justify-between gap-4 max-md:flex-col max-md:items-start">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              <Sparkles className="h-3 w-3" />
              <span className="font-mono uppercase tracking-[0.18em]">
                Workspace
              </span>
            </div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              AI Workspace
            </h1>
            <p className="mt-2 max-w-xl text-sm text-white/60">
              Pick a lens. Drop input. Watch MiMo reason in real time.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            <FileCode2 className="h-3.5 w-3.5 text-white/50" />
            <select
              value={lensId}
              onChange={(e) => setLensId(e.target.value)}
              className="cursor-pointer appearance-none bg-transparent pr-2 text-sm text-white outline-none"
            >
              {AVAILABLE.map((l) => (
                <option key={l.id} value={l.id} className="bg-[#08080d]">
                  {l.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        <div className="grid gap-4 lg:grid-cols-2">
          {/* Input */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Input
              </span>
              <span className="text-xs text-white/40">{lens.tagline}</span>
            </div>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lens.inputs[0]?.placeholder ?? "Drop your input…"}
              className="h-[420px] w-full resize-none bg-transparent px-4 py-3 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            <div className="flex items-center justify-between border-t border-white/5 px-4 py-2.5">
              <span className="text-xs text-white/40">
                {input.length} chars
              </span>
              <button
                onClick={run}
                disabled={streaming || !input.trim()}
                className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:opacity-30"
              >
                {streaming ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                Run lens
              </button>
            </div>
          </div>

          {/* Output */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Output
              </span>
              {streaming && (
                <span className="flex items-center gap-1.5 text-xs text-emerald-300">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  streaming
                </span>
              )}
            </div>
            <div
              ref={outRef}
              className="h-[420px] overflow-y-auto px-4 py-3 text-sm leading-relaxed text-white/85"
            >
              {!output && !thinking && !streaming && (
                <p className="text-white/30">Output will appear here.</p>
              )}
              {thinking && (
                <details className="mb-3 rounded-md border border-white/10 bg-white/[0.02] p-2 text-xs">
                  <summary className="cursor-pointer text-white/50">
                    Reasoning trace
                  </summary>
                  <pre className="mt-2 whitespace-pre-wrap font-mono text-white/55">
                    {thinking}
                  </pre>
                </details>
              )}
              <pre className="whitespace-pre-wrap font-sans">{output}</pre>
            </div>
          </div>
        </div>

        {/* History */}
        {history.length > 0 && (
          <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/5 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Recent runs
              </span>
            </div>
            <div className="divide-y divide-white/5">
              {history.map((h, i) => (
                <div key={i} className="px-4 py-2.5 text-xs">
                  <div className="flex items-center justify-between text-white/50">
                    <span className="font-medium text-white/70">{h.lens}</span>
                    <span>{new Date(h.ts).toLocaleTimeString()}</span>
                  </div>
                  <p className="mt-1 line-clamp-1 text-white/55">
                    {h.input}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </PageShell>
  );
}

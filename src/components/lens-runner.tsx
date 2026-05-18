"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Sparkles, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import type { Lens } from "@/lib/lenses";
import { PrismLogo } from "@/components/prism-logo";

type RunState = "idle" | "streaming" | "done" | "error";

export function LensRunner({ lens }: { lens: Lens }) {
  const router = useRouter();
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [thinking, setThinking] = useState("");
  const [content, setContent] = useState("");
  const [state, setState] = useState<RunState>("idle");
  const [error, setError] = useState("");

  const setField = (id: string, value: string) =>
    setInputs((prev) => ({ ...prev, [id]: value }));

  const canRun = lens.inputs
    .filter((f) => f.required)
    .every((f) => (inputs[f.id]?.trim().length ?? 0) > 0);

  async function run() {
    if (!canRun || state === "streaming") return;
    setThinking("");
    setContent("");
    setError("");
    setState("streaming");

    try {
      const res = await fetch("/api/reason", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lensId: lens.id, inputs }),
      });

      if (!res.ok || !res.body) {
        const msg = await res.text();
        throw new Error(msg || `HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const events = buffer.split("\n\n");
        buffer = events.pop() ?? "";

        for (const block of events) {
          const eventLine = block.split("\n").find((l) => l.startsWith("event:"));
          const dataLine = block.split("\n").find((l) => l.startsWith("data:"));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice(6).trim();
          const data = JSON.parse(dataLine.slice(5).trim());

          if (event === "thinking") {
            setThinking((prev) => prev + (data.text ?? ""));
          } else if (event === "content") {
            setContent((prev) => prev + (data.text ?? ""));
          } else if (event === "error") {
            throw new Error(data.message ?? "Unknown error");
          } else if (event === "done") {
            setState("done");
          }
        }
      }
      setState((s) => (s === "streaming" ? "done" : s));
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Something broke";
      setError(msg);
      setState("error");
      toast.error(msg);
    }
  }

  const reset = () => {
    setInputs({});
    setThinking("");
    setContent("");
    setError("");
    setState("idle");
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <button
            onClick={() => router.push("/")}
            className="flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            All lenses
          </button>
          <Link href="/" className="flex items-center gap-2">
            <PrismLogo size={22} />
            <span className="text-sm font-semibold">Prism</span>
          </Link>
          <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            MiMo V2.5 Pro
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Lens header */}
        <div className="mb-10 flex items-start gap-5">
          <div className="text-5xl">{lens.emoji}</div>
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{lens.name}</h1>
            <p className="mt-1 italic text-white/50">{lens.tagline}</p>
            <p className="mt-3 max-w-2xl text-white/65">{lens.description}</p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
          {/* Input panel */}
          <div className="space-y-4 rounded-2xl border border-white/8 bg-white/[0.02] p-6">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
              Input
            </h2>

            {lens.inputs.map((field) => (
              <div key={field.id} className="space-y-1.5">
                <label className="text-sm font-medium text-white/80">
                  {field.label}
                  {field.required && <span className="ml-1 text-rose-400">*</span>}
                </label>
                {field.type === "textarea" ? (
                  <textarea
                    rows={4}
                    placeholder={field.placeholder}
                    value={inputs[field.id] ?? ""}
                    onChange={(e) => setField(field.id, e.target.value)}
                    className="w-full resize-y rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                ) : field.type === "select" ? (
                  <select
                    value={inputs[field.id] ?? field.options?.[0]?.value ?? ""}
                    onChange={(e) => setField(field.id, e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white focus:border-white/30 focus:outline-none"
                  >
                    {field.options?.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-neutral-900"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type="text"
                    placeholder={field.placeholder}
                    value={inputs[field.id] ?? ""}
                    onChange={(e) => setField(field.id, e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-white/30 focus:outline-none"
                  />
                )}
              </div>
            ))}

            <button
              onClick={run}
              disabled={!canRun || state === "streaming"}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-2.5 text-sm font-medium text-black transition-all hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {state === "streaming" ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Refracting…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Refract
                </>
              )}
            </button>

            {state === "done" && (
              <button
                onClick={reset}
                className="w-full rounded-xl border border-white/10 py-2 text-sm text-white/60 hover:text-white"
              >
                Run again
              </button>
            )}
          </div>

          {/* Output panel */}
          <div className="space-y-4">
            {/* Thinking trace */}
            <AnimatePresence>
              {(thinking || state === "streaming") && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden rounded-2xl border border-white/8 bg-black/40 p-5"
                >
                  <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-wider text-white/40">
                    <Sparkles className="h-3 w-3" />
                    Reasoning trace
                  </div>
                  <pre className="whitespace-pre-wrap font-mono text-xs leading-relaxed text-white/50">
                    {thinking || (
                      <span className="animate-pulse text-white/30">
                        Thinking…
                      </span>
                    )}
                  </pre>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Output */}
            <div className="min-h-[240px] rounded-2xl border border-white/8 bg-white/[0.02] p-6">
              <div className="mb-3 flex items-center justify-between">
                <h2 className="text-sm font-semibold uppercase tracking-wider text-white/50">
                  Output
                </h2>
                {content && state === "done" && (
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(content);
                      toast.success("Copied to clipboard");
                    }}
                    className="text-xs text-white/50 hover:text-white"
                  >
                    Copy
                  </button>
                )}
              </div>
              {error && state === "error" && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">
                  {error}
                </div>
              )}
              {!content && state === "idle" && (
                <p className="text-sm italic text-white/30">
                  Output will appear here once you refract.
                </p>
              )}
              {content && (
                <article className="prose-prism">
                  <RenderedMarkdown text={content} />
                </article>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Minimal markdown renderer — headers, lists, bold, code. No deps. */
function RenderedMarkdown({ text }: { text: string }) {
  const html = text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/^### (.*)$/gm, "<h3>$1</h3>")
    .replace(/^## (.*)$/gm, "<h2>$1</h2>")
    .replace(/^# (.*)$/gm, "<h1>$1</h1>")
    .replace(/```([\s\S]*?)```/g, "<pre><code>$1</code></pre>")
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/^\s*-\s+(.*)$/gm, "<li>$1</li>")
    .replace(/(<li>.*<\/li>\n?)+/g, (m) => `<ul>${m}</ul>`)
    .replace(/\n{2,}/g, "</p><p>")
    .replace(/^(?!<h|<ul|<pre)(.+)$/gm, "<p>$1</p>")
    .replace(/<p><\/p>/g, "");

  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

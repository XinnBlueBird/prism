"use client";

import { useState } from "react";
import { Loader2, Play, Lightbulb, Check, X, Copy } from "lucide-react";
import { PageShell } from "@/components/page-shell";

type Idea = {
  category: "bold" | "practical" | "wildcard";
  title: string;
  body: string;
};

function parseIdeas(raw: string): Idea[] {
  const ideas: Idea[] = [];
  const re = /\[CATEGORY:\s*(bold|practical|wildcard)\]\s*\[TITLE:\s*([^\]]+)\]\s*\n([^\n[]+)/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    ideas.push({
      category: match[1] as Idea["category"],
      title: match[2].trim(),
      body: match[3].trim(),
    });
  }
  return ideas;
}

const CATEGORY_META = {
  bold: {
    label: "Bold",
    color: "border-purple-400/30 bg-purple-400/5 text-purple-300",
    desc: "ambitious, high-upside swings",
  },
  practical: {
    label: "Practical",
    color: "border-emerald-400/30 bg-emerald-400/5 text-emerald-300",
    desc: "ship-it-this-week ideas",
  },
  wildcard: {
    label: "Wildcard",
    color: "border-amber-400/30 bg-amber-400/5 text-amber-300",
    desc: "unexpected, lateral angles",
  },
};

export default function BrainstormPage() {
  const [topic, setTopic] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [keep, setKeep] = useState<Set<number>>(new Set());

  async function run() {
    if (!topic.trim() || streaming) return;
    setOutput("");
    setKeep(new Set());
    setStreaming(true);
    try {
      const res = await fetch("/api/brainstorm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let event = "";
      let finalOut = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";
        for (const line of lines) {
          if (line.startsWith("event: ")) event = line.slice(7).trim();
          else if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            if (event === "content") {
              finalOut += data.text;
              setOutput(finalOut);
            } else if (event === "error") {
              setOutput(`[error] ${data.message}`);
            }
          }
        }
      }
    } catch (err) {
      setOutput(`[error] ${err instanceof Error ? err.message : "unknown"}`);
    } finally {
      setStreaming(false);
    }
  }

  const ideas = parseIdeas(output);
  const grouped = (Object.keys(CATEGORY_META) as (keyof typeof CATEGORY_META)[]).map(
    (cat) => ({
      cat,
      items: ideas
        .map((idea, idx) => ({ idea, idx }))
        .filter(({ idea }) => idea.category === cat),
    }),
  );

  function toggle(idx: number) {
    setKeep((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  }

  function exportKept() {
    const list = ideas
      .map((idea, i) => ({ idea, i }))
      .filter(({ i }) => keep.has(i))
      .map(({ idea }) => `- **${idea.title}**: ${idea.body}`)
      .join("\n");
    if (list) {
      navigator.clipboard.writeText(`# Ideas: ${topic}\n\n${list}`);
    }
  }

  return (
    <PageShell active="/tools/brainstorm">
      <section className="mx-auto max-w-6xl px-4 py-6 sm:py-10">
        <header className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            <Lightbulb className="h-3 w-3" />
            <span className="font-mono uppercase tracking-[0.18em]">Tool</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Brainstorm
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Topic in. Twelve concrete ideas out across bold, practical, and
            wildcard categories. Mark the ones you want to keep.
          </p>
        </header>

        <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 focus-within:border-white/30">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="What's the topic? (e.g. 'launch ideas for an indie SaaS')"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            <button
              onClick={run}
              disabled={streaming || !topic.trim()}
              className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:opacity-30"
            >
              {streaming ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : (
                <Play className="h-3 w-3" />
              )}
              Generate
            </button>
          </div>
          {keep.size > 0 && (
            <div className="mt-3 flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-xs text-white/70">
              <span>{keep.size} ideas kept</span>
              <button
                onClick={exportKept}
                className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1 text-white/80 transition hover:border-white/30 hover:text-white"
              >
                <Copy className="h-3 w-3" />
                Copy as markdown
              </button>
            </div>
          )}
        </div>

        {streaming && ideas.length === 0 && (
          <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating ideas…
          </div>
        )}

        <div className="mt-6 grid gap-4 lg:grid-cols-3">
          {grouped.map(({ cat, items }) => {
            const meta = CATEGORY_META[cat];
            return (
              <div key={cat} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                <div className="mb-3">
                  <span
                    className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${meta.color}`}
                  >
                    {meta.label}
                  </span>
                  <p className="mt-1.5 text-xs text-white/40">{meta.desc}</p>
                </div>
                <div className="space-y-2">
                  {items.length === 0 && !streaming && output && (
                    <p className="text-xs text-white/30">No ideas yet.</p>
                  )}
                  {items.map(({ idea, idx }) => (
                    <div
                      key={idx}
                      className={`rounded-lg border px-3 py-2.5 transition ${
                        keep.has(idx)
                          ? "border-emerald-400/30 bg-emerald-400/5"
                          : "border-white/8 bg-white/[0.02] hover:border-white/15"
                      }`}
                    >
                      <h4 className="text-sm font-semibold text-white">
                        {idea.title}
                      </h4>
                      <p className="mt-1 text-xs leading-relaxed text-white/65">
                        {idea.body}
                      </p>
                      <button
                        onClick={() => toggle(idx)}
                        className={`mt-2 flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider transition ${
                          keep.has(idx)
                            ? "border-emerald-400/40 text-emerald-300"
                            : "border-white/15 text-white/50 hover:border-white/30 hover:text-white"
                        }`}
                      >
                        {keep.has(idx) ? (
                          <>
                            <Check className="h-2.5 w-2.5" />
                            Kept
                          </>
                        ) : (
                          <>
                            <X className="h-2.5 w-2.5" />
                            Keep
                          </>
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </PageShell>
  );
}

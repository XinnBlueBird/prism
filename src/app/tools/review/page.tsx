"use client";

import { useState } from "react";
import { Loader2, Play, FileCode2, AlertTriangle, AlertCircle, Info, CheckCircle2 } from "lucide-react";
import { PageShell } from "@/components/page-shell";

type Issue = {
  severity: "critical" | "warning" | "info";
  line: string;
  title: string;
  body: string;
};

function parseIssues(raw: string): { issues: Issue[]; tail: string } {
  const issues: Issue[] = [];
  const re = /\[SEVERITY:\s*(critical|warning|info)\]\s*\[LINE:\s*([^\]]+)\]\s*([^\n]+)\n([\s\S]*?)(?=\n\[SEVERITY:|\n##|$)/g;
  let match;
  while ((match = re.exec(raw)) !== null) {
    issues.push({
      severity: match[1] as Issue["severity"],
      line: match[2].trim(),
      title: match[3].trim(),
      body: match[4].trim(),
    });
  }
  const tailIdx = raw.indexOf("## Summary");
  const tail = tailIdx >= 0 ? raw.slice(tailIdx) : "";
  return { issues, tail };
}

export default function ReviewPage() {
  const [code, setCode] = useState("");
  const [context, setContext] = useState("");
  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);

  async function run() {
    if (!code.trim() || streaming) return;
    setOutput("");
    setStreaming(true);
    try {
      const res = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, context }),
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

  const { issues, tail } = parseIssues(output);
  const counts = {
    critical: issues.filter((i) => i.severity === "critical").length,
    warning: issues.filter((i) => i.severity === "warning").length,
    info: issues.filter((i) => i.severity === "info").length,
  };

  return (
    <PageShell active="/tools/review">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:py-10">
        <header className="mb-6">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
            <FileCode2 className="h-3 w-3" />
            <span className="font-mono uppercase tracking-[0.18em]">Tool</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            AI Code Review
          </h1>
          <p className="mt-2 max-w-xl text-sm text-white/60">
            Paste any code. MiMo flags bugs, security holes, perf issues, and
            style problems with severity-ranked feedback.
          </p>
        </header>

        <div className="grid gap-4 lg:grid-cols-[1fr,1.2fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02]">
            <div className="border-b border-white/5 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Code
              </span>
            </div>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Paste code here…"
              className="h-[280px] w-full resize-none bg-transparent px-4 py-3 font-mono text-xs text-white placeholder:text-white/30 focus:outline-none"
            />
            <div className="border-t border-white/5 px-4 py-2.5">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Context (optional)
              </span>
              <input
                type="text"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                placeholder="What is this code for? Any constraints?"
                className="mt-1.5 w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
              />
            </div>
            <div className="flex items-center justify-end border-t border-white/5 px-4 py-2.5">
              <button
                onClick={run}
                disabled={streaming || !code.trim()}
                className="flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-medium text-black transition hover:bg-white/90 disabled:opacity-30"
              >
                {streaming ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                Review
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                Findings
              </span>
              {issues.length > 0 && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="rounded-full border border-red-400/30 bg-red-400/10 px-2 py-0.5 text-red-300">
                    {counts.critical} critical
                  </span>
                  <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-amber-300">
                    {counts.warning} warning
                  </span>
                  <span className="rounded-full border border-sky-400/30 bg-sky-400/10 px-2 py-0.5 text-sky-300">
                    {counts.info} info
                  </span>
                </div>
              )}
            </div>

            {!output && !streaming && (
              <p className="mt-6 text-sm text-white/30">
                Findings will appear here.
              </p>
            )}
            {streaming && issues.length === 0 && (
              <div className="mt-6 flex items-center gap-2 text-sm text-white/50">
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing…
              </div>
            )}

            <div className="mt-4 space-y-3">
              {issues.map((issue, i) => (
                <IssueCard key={i} issue={issue} />
              ))}
            </div>

            {tail && (
              <pre className="mt-6 whitespace-pre-wrap rounded-lg border border-white/5 bg-black/20 p-3 text-xs text-white/70">
                {tail}
              </pre>
            )}
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function IssueCard({ issue }: { issue: Issue }) {
  const cfg = {
    critical: { Icon: AlertCircle, color: "text-red-300 border-red-400/30 bg-red-400/5" },
    warning: { Icon: AlertTriangle, color: "text-amber-300 border-amber-400/30 bg-amber-400/5" },
    info: { Icon: Info, color: "text-sky-300 border-sky-400/30 bg-sky-400/5" },
  }[issue.severity];
  const Icon = cfg.Icon;
  return (
    <div className={`rounded-lg border p-3 ${cfg.color}`}>
      <div className="flex items-start gap-2">
        <Icon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 text-xs">
            <span className="font-medium uppercase tracking-wider">
              {issue.severity}
            </span>
            <span className="font-mono text-[10px] opacity-60">
              {issue.line}
            </span>
          </div>
          <h3 className="mt-1 text-sm font-semibold text-white">
            {issue.title}
          </h3>
          <pre className="mt-1.5 whitespace-pre-wrap text-xs leading-relaxed text-white/70">
            {issue.body}
          </pre>
        </div>
      </div>
    </div>
  );
}

// keep these so tree-shaker doesn't drop unused imports if needed later
void CheckCircle2;

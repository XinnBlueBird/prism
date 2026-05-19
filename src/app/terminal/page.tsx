"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { Terminal as TerminalIcon, ArrowUp, Loader2, Eye } from "lucide-react";
import { PageShell } from "@/components/page-shell";

type Msg = {
  role: "user" | "assistant";
  content: string;
  thinking?: string;
};

export default function TerminalPage() {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [showThinking, setShowThinking] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  async function send(e?: FormEvent) {
    e?.preventDefault();
    if (!input.trim() || streaming) return;
    const userText = input.trim();
    setHistory((h) => [...h, userText]);
    setHistIdx(-1);
    setInput("");
    const userMsg: Msg = { role: "user", content: userText };
    const aiMsg: Msg = { role: "assistant", content: "", thinking: "" };
    const next = [...messages, userMsg, aiMsg];
    setMessages(next);
    setStreaming(true);

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        let event = "";
        for (const line of lines) {
          if (line.startsWith("event: ")) {
            event = line.slice(7).trim();
          } else if (line.startsWith("data: ")) {
            const data = JSON.parse(line.slice(6));
            setMessages((prev) => {
              const copy = [...prev];
              const last = copy[copy.length - 1];
              if (event === "thinking") {
                last.thinking = (last.thinking ?? "") + data.text;
              } else if (event === "content") {
                last.content += data.text;
              } else if (event === "error") {
                last.content = `[error] ${data.message}`;
              }
              return copy;
            });
          }
        }
      }
    } catch (err) {
      setMessages((prev) => {
        const copy = [...prev];
        copy[copy.length - 1].content = `[error] ${err instanceof Error ? err.message : "unknown"}`;
        return copy;
      });
    } finally {
      setStreaming(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowUp" && !input.trim()) {
      e.preventDefault();
      if (history.length === 0) return;
      const i = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(i);
      setInput(history[i]);
    } else if (e.key === "ArrowDown") {
      if (histIdx === -1) return;
      e.preventDefault();
      const i = histIdx + 1;
      if (i >= history.length) {
        setHistIdx(-1);
        setInput("");
      } else {
        setHistIdx(i);
        setInput(history[i]);
      }
    }
  }

  return (
    <PageShell active="/terminal">
      <section className="mx-auto flex h-[calc(100vh-4rem)] max-w-5xl flex-col px-4 py-6 md:h-screen md:py-10">
        <header className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5">
              <TerminalIcon className="h-4 w-4 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-sm font-semibold">Terminal</h1>
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/40">
                MiMo V2.5 Pro · Direct chat
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowThinking((v) => !v)}
            className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 transition hover:border-white/20 hover:text-white"
          >
            <Eye className="h-3 w-3" />
            {showThinking ? "Hide reasoning" : "Show reasoning"}
          </button>
        </header>

        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-xl border border-white/10 bg-black/30 p-4 font-mono text-sm leading-relaxed"
        >
          {messages.length === 0 && (
            <div className="text-white/40">
              <p className="text-emerald-300">prism &gt; ready</p>
              <p className="mt-1 text-white/50">
                Ask anything. Use the arrow keys to navigate history.
              </p>
            </div>
          )}
          {messages.map((m, i) => (
            <div key={i} className="mb-5">
              {m.role === "user" ? (
                <p className="text-emerald-300">
                  <span className="text-white/30">you &gt; </span>
                  {m.content}
                </p>
              ) : (
                <div>
                  {showThinking && m.thinking && (
                    <details className="mb-2 rounded-md border border-white/10 bg-white/[0.02] p-2 text-xs">
                      <summary className="cursor-pointer text-white/50">
                        reasoning trace
                      </summary>
                      <pre className="mt-2 whitespace-pre-wrap text-white/60">
                        {m.thinking}
                      </pre>
                    </details>
                  )}
                  <p className="whitespace-pre-wrap text-white/85">
                    <span className="text-white/30">prism &gt; </span>
                    {m.content || (
                      <Loader2 className="inline h-3 w-3 animate-spin text-white/40" />
                    )}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <form
          onSubmit={send}
          className="mt-3 flex items-center gap-2 rounded-xl border border-white/10 bg-black/30 px-3 py-2 focus-within:border-white/30"
        >
          <span className="font-mono text-xs text-emerald-300">&gt;</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            disabled={streaming}
            placeholder={streaming ? "thinking…" : "Ask anything"}
            className="flex-1 bg-transparent font-mono text-sm text-white placeholder:text-white/30 focus:outline-none disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={streaming || !input.trim()}
            className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-black transition hover:bg-white/90 disabled:opacity-30"
          >
            {streaming ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <ArrowUp className="h-3.5 w-3.5" />
            )}
          </button>
        </form>
      </section>
    </PageShell>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Loader2, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PrismLogo } from "@/components/prism-logo";

type Msg = { role: "user" | "assistant"; content: string; thinking?: string };

const BANNER = `┌──────────────────────────────────────────────────────────────┐
│  ▲ PRISM TERMINAL · v0.1.0                                   │
│  Engine: MiMo V2.5 Pro · Streaming reasoning enabled         │
│  Type a query and press Enter. Use ↑/↓ to recall.            │
└──────────────────────────────────────────────────────────────┘`;

export default function TerminalPage() {
  const [history, setHistory] = useState<Msg[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [recall, setRecall] = useState<{ idx: number; saved: string }>({
    idx: -1,
    saved: "",
  });
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history, thinking]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  async function send() {
    const text = draft.trim();
    if (!text || streaming) return;
    const userMsg: Msg = { role: "user", content: text };
    const next = [...history, userMsg];
    setHistory(next);
    setDraft("");
    setThinking("");
    setStreaming(true);

    try {
      const res = await fetch("/api/terminal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: next.map((m) => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok || !res.body) throw new Error(await res.text());

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = "";
      let assistantContent = "";
      let assistantThinking = "";

      // Push placeholder
      setHistory((h) => [...h, { role: "assistant", content: "", thinking: "" }]);

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const events = buf.split("\n\n");
        buf = events.pop() ?? "";
        for (const block of events) {
          const ev = block.split("\n").find((l) => l.startsWith("event:"))?.slice(6).trim();
          const dl = block.split("\n").find((l) => l.startsWith("data:"))?.slice(5).trim();
          if (!ev || !dl) continue;
          const data = JSON.parse(dl);
          if (ev === "thinking") {
            assistantThinking += data.text ?? "";
            setThinking(assistantThinking);
            setHistory((h) => {
              const copy = [...h];
              copy[copy.length - 1] = {
                ...copy[copy.length - 1],
                thinking: assistantThinking,
              };
              return copy;
            });
          } else if (ev === "content") {
            assistantContent += data.text ?? "";
            setHistory((h) => {
              const copy = [...h];
              copy[copy.length - 1] = {
                ...copy[copy.length - 1],
                content: assistantContent,
              };
              return copy;
            });
          } else if (ev === "error") {
            throw new Error(data.message);
          }
        }
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error";
      toast.error(msg);
      setHistory((h) => [
        ...h,
        { role: "assistant", content: `error: ${msg}` },
      ]);
    } finally {
      setStreaming(false);
      setThinking("");
      inputRef.current?.focus();
    }
  }

  function handleKey(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
      return;
    }
    if (e.key === "ArrowUp" && draft.length === 0) {
      const userTurns = history.filter((m) => m.role === "user");
      if (!userTurns.length) return;
      e.preventDefault();
      const nextIdx = Math.min(recall.idx + 1, userTurns.length - 1);
      setRecall({ idx: nextIdx, saved: draft });
      setDraft(userTurns[userTurns.length - 1 - nextIdx].content);
    }
    if (e.key === "ArrowDown" && recall.idx >= 0) {
      e.preventDefault();
      const userTurns = history.filter((m) => m.role === "user");
      const nextIdx = recall.idx - 1;
      if (nextIdx < 0) {
        setDraft(recall.saved);
        setRecall({ idx: -1, saved: "" });
      } else {
        setRecall({ ...recall, idx: nextIdx });
        setDraft(userTurns[userTurns.length - 1 - nextIdx].content);
      }
    }
  }

  function clearHistory() {
    setHistory([]);
    toast.success("Terminal cleared");
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#070710]">
      {/* Top bar */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-sm text-white/60 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Link>
          <Link href="/" className="flex items-center gap-2">
            <PrismLogo size={20} />
            <span className="font-mono text-sm font-semibold tracking-tight">
              prism://terminal
            </span>
          </Link>
          <button
            onClick={clearHistory}
            disabled={!history.length}
            className="flex items-center gap-1.5 rounded-md border border-white/10 px-2.5 py-1 text-xs text-white/60 hover:border-white/20 hover:text-white disabled:opacity-40"
          >
            <Trash2 className="h-3 w-3" /> clear
          </button>
        </div>
      </header>

      {/* Terminal body */}
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-4 py-6">
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto rounded-xl border border-emerald-400/10 bg-black/60 p-5 font-mono text-[13px] leading-relaxed text-emerald-100/85 shadow-[0_0_60px_-20px_rgba(16,185,129,0.25)]"
        >
          <pre className="text-emerald-300/70">{BANNER}</pre>
          <div className="mt-4 space-y-5">
            <AnimatePresence initial={false}>
              {history.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-1.5"
                >
                  {m.role === "user" ? (
                    <div className="flex gap-2">
                      <span className="select-none text-fuchsia-400">❯</span>
                      <span className="whitespace-pre-wrap text-white">
                        {m.content}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pl-4">
                      {m.thinking && (
                        <div className="rounded-md border border-white/5 bg-white/[0.02] px-3 py-2 text-[11px] italic text-white/40">
                          <span className="not-italic text-white/30">
                            ⏚ thinking ·{" "}
                          </span>
                          {m.thinking}
                        </div>
                      )}
                      <div className="whitespace-pre-wrap text-emerald-100/90">
                        {m.content || (
                          <span className="animate-pulse text-emerald-300/50">
                            ▍
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
            {!history.length && (
              <p className="text-emerald-300/40">
                Try: <span className="text-emerald-200/80">explain SSE in two sentences</span>
              </p>
            )}
          </div>
        </div>

        {/* Input */}
        <div className="mt-4">
          <div className="flex items-end gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2 focus-within:border-emerald-400/30">
            <span className="select-none pb-2 font-mono text-emerald-400">❯</span>
            <textarea
              ref={inputRef}
              rows={1}
              value={draft}
              onChange={(e) => {
                setDraft(e.target.value);
                if (recall.idx !== -1) setRecall({ idx: -1, saved: "" });
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
              }}
              onKeyDown={handleKey}
              placeholder={streaming ? "" : "ask anything…"}
              disabled={streaming}
              className="max-h-40 flex-1 resize-none bg-transparent py-2 font-mono text-sm text-white placeholder:text-white/25 focus:outline-none disabled:opacity-60"
            />
            <button
              onClick={send}
              disabled={!draft.trim() || streaming}
              className="mb-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300 transition hover:bg-emerald-500/25 disabled:opacity-40"
            >
              {streaming ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>
          <p className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-white/30">
            ↵ send · shift+↵ newline · ↑/↓ recall · powered by mimo v2.5 pro
          </p>
        </div>
      </div>
    </div>
  );
}

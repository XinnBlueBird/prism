import Link from "next/link";
import {
  Sparkles,
  Terminal as TerminalIcon,
  Layers,
  Eye,
  Zap,
  Lock,
  ArrowRight,
  Music,
} from "lucide-react";
import { PrismLogo } from "@/components/prism-logo";
import { PageShell } from "@/components/page-shell";
import { LENSES } from "@/lib/lenses";

export default function HomePage() {
  const liveCount = LENSES.filter((l) => l.status === "available").length;

  return (
    <PageShell active="/">
      {/* Hero */}
      <section className="relative mx-auto max-w-6xl px-6 pb-24 pt-20 text-center sm:pt-28">
        <div className="mb-9 flex justify-center">
          <PrismLogo size={120} />
        </div>

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
          </span>
          Powered by MiMo V2.5 Pro · {liveCount} lenses live
        </div>

        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Refract any thought
          <br />
          into <span className="spectrum-text">clarity</span>.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-white/65">
          Prism is a reasoning canvas. A terminal. A studio. One engine, many
          surfaces — built so AI doesn&apos;t feel like a chat box.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/lenses"
            className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 hover:bg-white/90"
          >
            Browse lenses
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/terminal"
            className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <TerminalIcon className="h-3.5 w-3.5" />
            Open Terminal
          </Link>
        </div>

        <p className="mt-7 font-mono text-[11px] uppercase tracking-[0.18em] text-white/30">
          No signup · No tracking · Streaming reasoning
        </p>
      </section>

      {/* Trust strip */}
      <section className="border-y border-white/5 bg-white/[0.015]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-6 px-6 py-10 text-center sm:grid-cols-4">
          {[
            { k: "10", v: "Reasoning lenses" },
            { k: "3", v: "Surfaces · Lenses · Terminal · Studio" },
            { k: "1", v: "Engine: MiMo V2.5 Pro" },
            { k: "0", v: "Signup friction" },
          ].map((s) => (
            <div key={s.v}>
              <div className="text-3xl font-semibold tracking-tight">{s.k}</div>
              <div className="mt-1 text-xs uppercase tracking-wider text-white/40">
                {s.v}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Three surfaces */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            Three ways in
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            One engine. <span className="spectrum-text">Three surfaces.</span>
          </h2>
          <p className="mt-3 text-white/60">
            Different shapes of AI for different jobs. Pick the right one.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <SurfaceCard
            href="/lenses"
            icon={Sparkles}
            label="Lenses"
            title="Refract a thought"
            body="Pick a specialized cognitive frame and watch MiMo reason about your input — wallet biographies, recursive task trees, adversarial debates."
            tone="from-fuchsia-500/15 to-purple-500/5"
          />
          <SurfaceCard
            href="/terminal"
            icon={TerminalIcon}
            label="Terminal"
            title="Just ask"
            body="A fast, focused chat console. No lens, no setup, just direct conversation with MiMo V2.5 Pro. Recall history with ↑/↓."
            tone="from-emerald-500/15 to-teal-500/5"
          />
          <SurfaceCard
            href="/studio"
            icon={Music}
            label="Studio"
            title="Play & save media"
            body="Drop a YouTube, Spotify, SoundCloud, or TikTok link. Preview inline, then save audio or video to your device."
            tone="from-cyan-500/15 to-blue-500/5"
          />
        </div>
      </section>

      {/* Why pillars */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            Why Prism
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Most AI tools are chat boxes.
            <br />
            <span className="spectrum-text">Prism isn&apos;t.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Layers,
              title: "Structured thinking",
              body: "Every lens forces multi-step reasoning into a structured output you can copy, paste, ship.",
            },
            {
              icon: Eye,
              title: "Watch it think",
              body: "Streaming reasoning trace shows you how MiMo arrives at the answer. Depth you can see.",
            },
            {
              icon: Zap,
              title: "No setup",
              body: "No accounts, no chat history bloat, no plan tiers. Open the page and start.",
            },
            {
              icon: TerminalIcon,
              title: "Multiple surfaces",
              body: "Lens for structure, Terminal for speed, Studio for media. Same reasoning, different gestures.",
            },
            {
              icon: Sparkles,
              title: "MiMo V2.5 Pro",
              body: "Built on a model tuned for reasoning, not just chat completion — and used the way it's meant to be used.",
            },
            {
              icon: Lock,
              title: "Private by default",
              body: "Inputs aren't stored server-side. No analytics fingerprinting. Your reasoning stays yours.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <f.icon className="h-5 w-5 text-white/70" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/60">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-12 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.12),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.10),transparent_55%)]" />
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop reading. Start <span className="spectrum-text">refracting</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Pick any lens. Try any input. See MiMo V2.5 Pro reason in real time.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/lenses"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Browse lenses
            </Link>
            <Link
              href="/terminal"
              className="flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              Open Terminal
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function SurfaceCard({
  href,
  icon: Icon,
  label,
  title,
  body,
  tone,
}: {
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  title: string;
  body: string;
  tone: string;
}) {
  return (
    <Link
      href={href}
      className={`group relative block overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br ${tone} p-7 transition-transform hover:-translate-y-1`}
    >
      <div className="absolute right-0 top-0 h-40 w-40 -translate-y-10 translate-x-10 rounded-full bg-white/[0.04] blur-3xl transition-opacity group-hover:opacity-100" />
      <div className="relative">
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            {label}
          </span>
          <Icon className="h-4 w-4 text-white/40" />
        </div>
        <h3 className="mt-6 text-2xl font-semibold tracking-tight">{title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-white/60">{body}</p>
        <div className="mt-6 inline-flex items-center gap-1.5 text-sm text-white/70 transition group-hover:gap-2 group-hover:text-white">
          Explore <ArrowRight className="h-3.5 w-3.5" />
        </div>
      </div>
    </Link>
  );
}

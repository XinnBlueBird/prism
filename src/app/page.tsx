import Link from "next/link";
import {
  Sparkles,
  Terminal as TerminalIcon,
  Zap,
  Layers,
  Eye,
  Lock,
  ArrowRight,
} from "lucide-react";
import { LENSES } from "@/lib/lenses";
import { LensCard } from "@/components/lens-card";
import { PrismLogo } from "@/components/prism-logo";

export default function HomePage() {
  const liveCount = LENSES.filter((l) => l.status === "available").length;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/70 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2.5">
            <PrismLogo size={26} />
            <span className="text-base font-semibold tracking-tight">Prism</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            <Link
              href="/terminal"
              className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:flex"
            >
              <TerminalIcon className="h-3.5 w-3.5" />
              Terminal
            </Link>
            <a
              href="#lenses"
              className="hidden rounded-full px-3 py-1.5 text-sm text-white/70 transition hover:bg-white/5 hover:text-white sm:block"
            >
              Lenses
            </a>
            <a
              href="https://github.com/XinnBlueBird/prism"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/70 transition hover:border-white/20 hover:text-white"
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.73.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z" />
              </svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-20 text-center sm:pt-28">
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
          Prism is a reasoning canvas. Drop in a wallet, a paper, a vague idea —
          pick a lens, and watch it refract into structured insight.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a
            href="#lenses"
            className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 hover:bg-white/90"
          >
            Pick a lens
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </a>
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
            { k: "1", v: "Engine: MiMo V2.5 Pro" },
            { k: "0", v: "Hidden cost" },
            { k: "∞", v: "Use cases" },
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

      {/* Feature pillars */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            Why Prism
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Most AI tools are chat boxes.
            <br />
            <span className="spectrum-text">Prism isn&apos;t.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Layers,
              title: "Ten lenses, one engine",
              body: "Each lens is a distinct cognitive frame — wallet biography, adversarial debate, recursive task tree. Same model, different reasoning shape.",
            },
            {
              icon: Eye,
              title: "Reasoning is the demo",
              body: "Streaming reasoning trace shows you how MiMo thinks before it answers. Depth you can actually see, not just final tokens.",
            },
            {
              icon: Zap,
              title: "Built to be used",
              body: "No signup, no chat history bloat. Pick a lens, drop input, get structured output. Then close the tab and ship.",
            },
            {
              icon: TerminalIcon,
              title: "Terminal mode",
              body: "Prefer raw chat? Open Prism Terminal — a fast, focused console for direct questions, no lens required.",
            },
            {
              icon: Sparkles,
              title: "Spectrum thinking",
              body: "One input refracts into multiple perspectives. The same question rendered through four personas. Decisions get sharper.",
            },
            {
              icon: Lock,
              title: "Private by default",
              body: "We don't store your inputs or outputs server-side. No analytics fingerprinting. Your reasoning stays yours.",
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

      {/* Lens grid */}
      <section id="lenses" className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
              The collection
            </p>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Choose your <span className="spectrum-text">lens</span>
            </h2>
            <p className="mt-3 max-w-xl text-white/60">
              Each lens applies a distinct cognitive frame. Same engine, different
              reasoning shape.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            All {liveCount} lenses live
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LENSES.map((lens, i) => (
            <LensCard key={lens.id} lens={lens} index={i} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            How it works
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Three steps. <span className="spectrum-text">Real reasoning.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Pick a lens",
              body: "Each lens is tuned for a domain — wallets, ideas, code, papers, dreams.",
            },
            {
              n: "02",
              title: "Drop your input",
              body: "An address, a URL, a half-formed thought. Prism doesn't care how messy.",
            },
            {
              n: "03",
              title: "Watch it refract",
              body: "MiMo V2.5 Pro reasons in real time. You see the thinking, then structured output.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="relative overflow-hidden rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="absolute -right-8 -top-10 select-none font-mono text-[10rem] font-bold leading-none text-white/[0.025]">
                {step.n}
              </div>
              <div className="relative">
                <div className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
                  Step {step.n}
                </div>
                <h3 className="mt-3 text-xl font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/60">
                  {step.body}
                </p>
              </div>
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
            <a
              href="#lenses"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Browse lenses
            </a>
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

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 text-xs text-white/40 sm:flex-row">
          <div className="flex items-center gap-2">
            <PrismLogo size={18} />
            <span>Prism — a reasoning canvas. Built on MiMo V2.5 Pro.</span>
          </div>
          <div className="flex items-center gap-5">
            <a
              href="https://github.com/XinnBlueBird/prism"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white"
            >
              GitHub
            </a>
            <Link href="/terminal" className="hover:text-white">
              Terminal
            </Link>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

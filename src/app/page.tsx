import Link from "next/link";
import { Sparkles } from "lucide-react";
import { LENSES } from "@/lib/lenses";
import { LensCard } from "@/components/lens-card";
import { PrismLogo } from "@/components/prism-logo";

export default function HomePage() {
  const available = LENSES.filter((l) => l.status === "available").length;

  return (
    <div className="min-h-screen">
      {/* Nav */}
      <header className="border-b border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <PrismLogo size={28} />
            <span className="text-lg font-semibold tracking-tight">Prism</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm text-white/60">
            <a
              href="https://github.com/XinnBlueBird/prism"
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 transition-colors hover:text-white"
            >
              <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56v-2.18c-3.2.7-3.87-1.36-3.87-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.04-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.24 2.75.12 3.04.73.81 1.18 1.84 1.18 3.1 0 4.43-2.7 5.4-5.27 5.69.41.36.78 1.06.78 2.14v3.17c0 .31.21.68.8.56C20.21 21.38 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5Z"/></svg>
              <span className="hidden sm:inline">GitHub</span>
            </a>
            <span className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
              MiMo V2.5 Pro
            </span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <div className="mb-10 flex justify-center">
          <PrismLogo size={120} />
        </div>

        <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70">
          <Sparkles className="h-3 w-3" />
          Powered by MiMo V2.5 Pro reasoning
        </div>

        <h1 className="text-balance text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Refract any thought
          <br />
          into <span className="spectrum-text">clarity</span>.
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-balance text-lg leading-relaxed text-white/65">
          Prism is a reasoning canvas. Drop in a wallet, a paper, a vague idea —
          pick a lens, and watch it refract into structured insight. Ten lenses.
          One engine.
        </p>

        <div className="mt-10 flex items-center justify-center gap-3">
          <a
            href="#lenses"
            className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 hover:bg-white/90"
          >
            Pick a lens
          </a>
          <a
            href="#how"
            className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition-colors hover:border-white/30 hover:text-white"
          >
            How it works
          </a>
        </div>

        <p className="mt-6 text-xs text-white/40">
          {available} lenses live · 6 more coming · No signup required
        </p>
      </section>

      {/* Lens grid */}
      <section id="lenses" className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-10 flex items-end justify-between">
          <div>
            <h2 className="text-3xl font-semibold tracking-tight">
              Choose your lens
            </h2>
            <p className="mt-2 max-w-xl text-white/60">
              Each lens applies a distinct cognitive frame. Same engine, different
              reasoning shape.
            </p>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LENSES.map((lens, i) => (
            <LensCard key={lens.id} lens={lens} index={i} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section id="how" className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-8 md:grid-cols-3">
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
              body: "MiMo V2.5 Pro reasons in real time. You see the thinking, then the structured output.",
            },
          ].map((step) => (
            <div
              key={step.n}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6"
            >
              <div className="font-mono text-xs text-white/40">{step.n}</div>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-white/60">{step.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-6 py-8 text-xs text-white/40 sm:flex-row">
          <span>Prism — a reasoning canvas. Built on MiMo V2.5 Pro.</span>
          <span>© {new Date().getFullYear()} Prism</span>
        </div>
      </footer>
    </div>
  );
}

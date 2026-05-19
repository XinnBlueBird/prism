import Link from "next/link";
import {
  Sparkles,
  Layers,
  Eye,
  Zap,
  Lock,
  ArrowRight,
  Map,
  Hammer,
  Rocket,
  Scale,
} from "lucide-react";
import { PrismLogo } from "@/components/prism-logo";
import { PageShell } from "@/components/page-shell";
import { LENSES, CATEGORIES, getLensesByCategory } from "@/lib/lenses";

const CATEGORY_ICONS = {
  plan: Map,
  build: Hammer,
  ship: Rocket,
  decide: Scale,
} as const;

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
          The AI workspace
          <br />
          for <span className="spectrum-text">builders</span>.
        </h1>

        <p className="mx-auto mt-7 max-w-2xl text-balance text-lg leading-relaxed text-white/65">
          Prism is a reasoning workspace for solo founders, indie hackers, and
          small teams. Plan, build, ship, and decide — with{" "}
          <strong className="text-white/80">15 specialized AI lenses</strong>{" "}
          powered by MiMo V2.5 Pro.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/lenses"
            className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition-transform hover:-translate-y-0.5 hover:bg-white/90"
          >
            Browse 15 lenses
            <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <Link
            href="/lens/spec"
            className="flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Try Spec Lens
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
            { k: "15", v: "Builder lenses" },
            { k: "4", v: "Workflow stages" },
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

      {/* Workflow categories */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            How builders use Prism
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            From idea to ship.
            <br />
            <span className="spectrum-text">One reasoning workspace.</span>
          </h2>
          <p className="mt-3 text-white/60">
            Four workflow stages. Fifteen specialized lenses. Every step backed
            by MiMo&apos;s streaming reasoning.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(CATEGORIES) as Array<keyof typeof CATEGORIES>).map(
            (cat) => {
              const Icon = CATEGORY_ICONS[cat];
              const meta = CATEGORIES[cat];
              const lenses = getLensesByCategory(cat);
              return (
                <Link
                  key={cat}
                  href={`/lenses#${cat}`}
                  className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-white/60" />
                        <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-white/40">
                          {meta.label}
                        </span>
                      </div>
                      <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                        {meta.label}
                      </h3>
                      <p className="mt-1 text-sm text-white/55">
                        {meta.description}
                      </p>
                    </div>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/60">
                      {lenses.length} lenses
                    </span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {lenses.map((l) => (
                      <span
                        key={l.id}
                        className="rounded-full border border-white/10 bg-black/30 px-2 py-0.5 text-[11px] text-white/65"
                      >
                        {l.name.replace(" Lens", "")}
                      </span>
                    ))}
                  </div>
                </Link>
              );
            },
          )}
        </div>
      </section>

      {/* Why Prism */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-12 max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            Why Prism
          </p>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight">
            Most AI tools are chat boxes.
            <br />
            <span className="spectrum-text">Builders need more.</span>
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              icon: Layers,
              title: "Structured outputs, not blobs",
              body: "Every lens returns a ready-to-use artifact — PRD, RFC, OKRs, ticket list — not a wall of text you have to reformat.",
            },
            {
              icon: Eye,
              title: "Watch it think",
              body: "Streaming reasoning trace shows how MiMo arrives at the answer. You can trust what you can see.",
            },
            {
              icon: Zap,
              title: "Zero setup",
              body: "No accounts, no workspaces to create, no plan tiers. Open the page, pick a lens, drop input, ship.",
            },
            {
              icon: Hammer,
              title: "Built by a builder",
              body: "Every prompt is tuned by someone who actually ships product. No generic 'be helpful' system prompts.",
            },
            {
              icon: Sparkles,
              title: "MiMo V2.5 Pro",
              body: "Built on a reasoning-tuned model — not a chat-tuned one. The output shape proves the engine&apos;s depth.",
            },
            {
              icon: Lock,
              title: "Private by default",
              body: "Inputs are never stored server-side. No analytics fingerprinting. Your half-baked ideas stay yours.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="rounded-2xl border border-white/8 bg-white/[0.02] p-6 transition-colors hover:border-white/15 hover:bg-white/[0.04]"
            >
              <f.icon className="h-5 w-5 text-white/70" />
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p
                className="mt-2 text-sm leading-relaxed text-white/60"
                dangerouslySetInnerHTML={{ __html: f.body }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Workflow example */}
      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-8 sm:p-12">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            Example workflow
          </p>
          <h3 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            From idea to launch in <span className="spectrum-text">one afternoon</span>.
          </h3>
          <ol className="mt-8 space-y-4">
            {[
              {
                stage: "PLAN",
                lens: "📐 Spec Lens",
                action: '"AI receipt scanner" → full PRD + architecture + tickets',
              },
              {
                stage: "PLAN",
                lens: "🎯 OKR Lens",
                action: "Quarterly goal → measurable KRs + anti-goals",
              },
              {
                stage: "BUILD",
                lens: "📝 RFC Lens",
                action: "Tech proposal → motivation, alternatives, trade-offs",
              },
              {
                stage: "BUILD",
                lens: "🐛 Bug Lens",
                action: "Stack trace → ranked hypotheses + repro plan",
              },
              {
                stage: "SHIP",
                lens: "📖 Story Lens",
                action: "Feature → INVEST stories + acceptance criteria",
              },
              {
                stage: "SHIP",
                lens: "🚀 Launch Lens",
                action: "Changelog → viral X launch thread",
              },
              {
                stage: "DECIDE",
                lens: "💀 Premortem Lens",
                action: '"What kills this in 6 months?" → mitigations today',
              },
            ].map((step, i) => (
              <li key={i} className="flex items-start gap-4">
                <span className="mt-0.5 font-mono text-xs text-white/30">
                  0{i + 1}
                </span>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-sm">
                    <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/50">
                      {step.stage}
                    </span>
                    <span className="font-medium text-white">{step.lens}</span>
                  </div>
                  <p className="mt-1 text-sm text-white/55">{step.action}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/[0.04] via-white/[0.02] to-transparent p-12 text-center sm:p-16">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.12),transparent_55%),radial-gradient(circle_at_70%_80%,rgba(56,189,248,0.10),transparent_55%)]" />
          <h2 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Stop drafting in chat.
            <br />
            Start <span className="spectrum-text">shipping</span>.
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-white/60">
            Fifteen lenses. One engine. Every output ready to paste into your
            doc, your repo, your sprint.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/lenses"
              className="rounded-full bg-white px-6 py-3 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-white/90"
            >
              Browse all lenses
            </Link>
            <Link
              href="/about"
              className="rounded-full border border-white/15 px-6 py-3 text-sm font-medium text-white/80 transition hover:border-white/30 hover:text-white"
            >
              Read the philosophy
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

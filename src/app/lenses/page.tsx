import { LENSES } from "@/lib/lenses";
import { LensCard } from "@/components/lens-card";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "Lenses · Prism",
  description: "All ten Prism reasoning lenses — pick the right cognitive frame for your input.",
};

export default function LensesPage() {
  const live = LENSES.filter((l) => l.status === "available");

  return (
    <PageShell active="/lenses">
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="mb-12 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
              The collection
            </p>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
              Choose your <span className="spectrum-text">lens</span>
            </h1>
            <p className="mt-3 max-w-xl text-white/60">
              Each lens applies a distinct cognitive frame to whatever you drop
              in. Same engine, different reasoning shape.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            All {live.length} lenses live
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {LENSES.map((lens, i) => (
            <LensCard key={lens.id} lens={lens} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

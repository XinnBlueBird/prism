import { PageShell } from "@/components/page-shell";
import { LensCard } from "@/components/lens-card";
import { LENSES, CATEGORIES, getLensesByCategory } from "@/lib/lenses";
import { Map } from "lucide-react";

export const metadata = {
  title: "Plan · Prism",
  description:
    "Plan lenses — turn vague ideas into actionable specs and roadmaps. Powered by MiMo V2.5 Pro.",
};

export default function PlanPage() {
  const lenses = getLensesByCategory("plan");
  const total = LENSES.length;
  return (
    <PageShell active="/plan">
      <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
        <div className="mb-10 flex items-end justify-between gap-6 max-md:flex-col max-md:items-start">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/60">
              <Map className="h-3 w-3" />
              <span className="font-mono uppercase tracking-[0.18em]">
                Plan stage
              </span>
            </div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              {CATEGORIES.plan.label}
            </h1>
            <p className="mt-3 max-w-xl text-white/60">
              {CATEGORIES.plan.description}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-3 py-1.5 text-xs text-emerald-300/90">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {lenses.length} of {total} lenses
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {lenses.map((lens, i) => (
            <LensCard key={lens.id} lens={lens} index={i} />
          ))}
        </div>
      </section>
    </PageShell>
  );
}

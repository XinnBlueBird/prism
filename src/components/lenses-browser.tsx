"use client";

import { useState, useMemo } from "react";
import { Search, Map, Hammer, Rocket, Scale } from "lucide-react";
import { LENSES, CATEGORIES, type LensCategory } from "@/lib/lenses";
import { LensCard } from "@/components/lens-card";

const CATEGORY_ICONS = {
  plan: Map,
  build: Hammer,
  ship: Rocket,
  decide: Scale,
} as const;

export function LensesBrowser() {
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<LensCategory | "all">("all");

  const filtered = useMemo(() => {
    return LENSES.filter((l) => {
      if (activeCat !== "all" && l.category !== activeCat) return false;
      if (!query) return true;
      const q = query.toLowerCase();
      return (
        l.name.toLowerCase().includes(q) ||
        l.tagline.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q)
      );
    });
  }, [query, activeCat]);

  const grouped =
    activeCat === "all"
      ? (Object.keys(CATEGORIES) as LensCategory[]).map((cat) => ({
          cat,
          items: filtered.filter((l) => l.category === cat),
        }))
      : [{ cat: activeCat, items: filtered }];

  return (
    <>
      {/* Search + filter */}
      <div className="mb-10 space-y-4">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 focus-within:border-white/30">
          <Search className="h-4 w-4 text-white/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search lenses (e.g. 'spec', 'roadmap', 'bug')"
            className="flex-1 bg-transparent py-1 text-sm text-white placeholder:text-white/30 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="text-xs text-white/40 hover:text-white"
            >
              clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <CategoryPill
            active={activeCat === "all"}
            onClick={() => setActiveCat("all")}
            count={LENSES.length}
          >
            All
          </CategoryPill>
          {(Object.keys(CATEGORIES) as LensCategory[]).map((cat) => {
            const Icon = CATEGORY_ICONS[cat];
            const count = LENSES.filter((l) => l.category === cat).length;
            return (
              <CategoryPill
                key={cat}
                active={activeCat === cat}
                onClick={() => setActiveCat(cat)}
                count={count}
                icon={<Icon className="h-3 w-3" />}
              >
                {CATEGORIES[cat].label}
              </CategoryPill>
            );
          })}
        </div>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] py-16 text-center text-sm text-white/50">
          No lenses match &quot;{query}&quot;. Try a different keyword.
        </div>
      )}

      {/* Grouped lens grid */}
      <div className="space-y-12">
        {grouped.map(({ cat, items }) => {
          if (items.length === 0) return null;
          const Icon = CATEGORY_ICONS[cat];
          return (
            <div key={cat} id={cat} className="scroll-mt-24">
              {activeCat === "all" && (
                <div className="mb-5 flex items-center gap-3">
                  <Icon className="h-4 w-4 text-white/60" />
                  <h2 className="text-xl font-semibold tracking-tight">
                    {CATEGORIES[cat].label}
                  </h2>
                  <span className="text-sm text-white/40">
                    · {CATEGORIES[cat].description}
                  </span>
                </div>
              )}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((lens, i) => (
                  <LensCard key={lens.id} lens={lens} index={i} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

function CategoryPill({
  active,
  onClick,
  count,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  count: number;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-white/30 bg-white text-black"
          : "border-white/10 bg-white/[0.02] text-white/60 hover:border-white/20 hover:text-white"
      }`}
    >
      {icon}
      {children}
      <span
        className={`ml-1 rounded-full px-1.5 text-[10px] ${
          active ? "bg-black/15 text-black/70" : "bg-white/10 text-white/50"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

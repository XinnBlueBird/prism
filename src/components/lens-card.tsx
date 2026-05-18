"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, Lock } from "lucide-react";
import type { Lens } from "@/lib/lenses";
import { cn } from "@/lib/utils";

export function LensCard({ lens, index }: { lens: Lens; index: number }) {
  const isAvailable = lens.status === "available";

  const inner = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
      whileHover={isAvailable ? { y: -4 } : undefined}
      className={cn(
        "group relative h-full overflow-hidden rounded-2xl border p-6 transition-colors",
        "border-white/8 bg-white/[0.02] backdrop-blur-sm",
        isAvailable
          ? "hover:border-white/20 hover:bg-white/[0.05] cursor-pointer"
          : "opacity-60 cursor-not-allowed",
      )}
    >
      {/* Accent gradient bar */}
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-px bg-gradient-to-r opacity-60",
          lens.accent,
        )}
      />

      {/* Glow on hover */}
      {isAvailable && (
        <div
          className={cn(
            "absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-30",
            lens.accent,
          )}
        />
      )}

      <div className="flex items-start justify-between">
        <span className="text-3xl">{lens.emoji}</span>
        {isAvailable ? (
          <ArrowUpRight className="h-4 w-4 text-white/30 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        ) : (
          <span className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wider text-white/40">
            <Lock className="h-2.5 w-2.5" />
            Soon
          </span>
        )}
      </div>

      <div className="mt-5">
        <h3 className="text-lg font-semibold text-white">{lens.name}</h3>
        <p className="mt-1 text-sm italic text-white/50">{lens.tagline}</p>
        <p className="mt-3 text-sm leading-relaxed text-white/65">
          {lens.description}
        </p>
      </div>
    </motion.div>
  );

  if (!isAvailable) return inner;

  return (
    <Link href={`/lens/${lens.id}`} className="block h-full">
      {inner}
    </Link>
  );
}

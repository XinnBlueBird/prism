"use client";

import {
  Ruler,
  ListTree,
  Map,
  Target,
  FileText,
  Landmark,
  Bug,
  Eye,
  BookOpen,
  Package,
  Rocket,
  Swords,
  RefreshCw,
  Skull,
  Scale,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  Ruler,
  ListTree,
  Map,
  Target,
  FileText,
  Landmark,
  Bug,
  Eye,
  BookOpen,
  Package,
  Rocket,
  Swords,
  RefreshCw,
  Skull,
  Scale,
};

export function LensIcon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Icon = ICON_MAP[name] ?? Sparkles;
  return <Icon className={className} />;
}

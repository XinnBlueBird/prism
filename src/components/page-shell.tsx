"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Menu,
  X,
  LayoutDashboard,
  Terminal as TerminalIcon,
  Map,
  Hammer,
  Rocket,
  Scale,
  FileCode2,
  Lightbulb,
  Info,
  HelpCircle,
  Layers,
  ExternalLink,
} from "lucide-react";
import { PrismLogo } from "@/components/prism-logo";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string; icon: React.ComponentType<{ className?: string }> };
type NavSection = { title: string; items: NavItem[] };

const SECTIONS: NavSection[] = [
  {
    title: "Workspace",
    items: [
      { href: "/workspace", label: "AI Workspace", icon: LayoutDashboard },
      { href: "/terminal", label: "Terminal", icon: TerminalIcon },
    ],
  },
  {
    title: "Lenses",
    items: [
      { href: "/plan", label: "Plan", icon: Map },
      { href: "/build", label: "Build", icon: Hammer },
      { href: "/ship", label: "Ship", icon: Rocket },
      { href: "/decide", label: "Decide", icon: Scale },
      { href: "/lenses", label: "All lenses", icon: Layers },
    ],
  },
  {
    title: "Tools",
    items: [
      { href: "/tools/review", label: "Code Review", icon: FileCode2 },
      { href: "/tools/brainstorm", label: "Brainstorm", icon: Lightbulb },
    ],
  },
  {
    title: "Info",
    items: [
      { href: "/about", label: "About", icon: Info },
      { href: "/faq", label: "FAQ", icon: HelpCircle },
    ],
  },
];

export function PageShell({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: string;
}) {
  const pathname = usePathname();
  const current = active ?? pathname;
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === "/") return current === "/";
    return current === href || (current?.startsWith(href + "/") ?? false);
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar — desktop */}
      <aside className="sticky top-0 hidden h-screen w-60 shrink-0 flex-col border-r border-white/5 bg-[#08080d]/80 backdrop-blur-md md:flex">
        <Link href="/" className="flex items-center gap-2.5 border-b border-white/5 px-5 py-4">
          <PrismLogo size={26} />
          <span className="text-base font-semibold tracking-tight">Prism</span>
        </Link>

        <nav className="flex-1 overflow-y-auto px-3 py-5">
          {SECTIONS.map((section) => (
            <div key={section.title} className="mb-6">
              <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                {section.title}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const act = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-lg px-2.5 py-1.5 text-sm transition",
                        act
                          ? "bg-white/10 text-white"
                          : "text-white/55 hover:bg-white/5 hover:text-white",
                      )}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <a
          href="https://github.com/XinnBlueBird/prism"
          target="_blank"
          rel="noreferrer"
          className="m-3 flex items-center justify-between rounded-lg border border-white/8 px-3 py-2 text-xs text-white/55 transition hover:border-white/20 hover:text-white"
        >
          <span>GitHub</span>
          <ExternalLink className="h-3 w-3" />
        </a>
      </aside>

      {/* Mobile top bar */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/85 backdrop-blur-md md:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <Link href="/" className="flex items-center gap-2">
              <PrismLogo size={22} />
              <span className="text-sm font-semibold">Prism</span>
            </Link>
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10"
              aria-label="menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>

          {mobileOpen && (
            <div className="border-t border-white/5 px-4 py-4">
              {SECTIONS.map((section) => (
                <div key={section.title} className="mb-5">
                  <p className="pb-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35">
                    {section.title}
                  </p>
                  <div className="space-y-0.5">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const act = isActive(item.href);
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          className={cn(
                            "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition",
                            act
                              ? "bg-white/10 text-white"
                              : "text-white/60 hover:bg-white/5 hover:text-white",
                          )}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </header>

        <main className="flex-1 min-w-0">{children}</main>

        <footer className="border-t border-white/5">
          <div className="flex flex-col items-center justify-between gap-3 px-6 py-6 text-xs text-white/40 sm:flex-row">
            <div className="flex items-center gap-2">
              <PrismLogo size={16} />
              <span>Prism · The AI workspace for builders · Powered by MiMo V2.5 Pro</span>
            </div>
            <span>© {new Date().getFullYear()}</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/page-shell";

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      { q: "What is Prism?", a: "Prism is an AI workspace for builders — solo founders, indie hackers, and small teams. Pick a lens (a specialized cognitive frame), drop your input, and watch MiMo V2.5 Pro turn it into a structured, ship-ready artifact in real time." },
      { q: "Who is Prism for?", a: "Builders who write their own specs and code, run their own sprints, and decide their own architecture. If your bottleneck is structuring thinking, not typing, Prism is for you." },
      { q: "Do I need to sign up?", a: "No accounts, no logins, no waitlists. Open the page and start." },
      { q: "How much does it cost?", a: "Free during the beta. MiMo V2.5 Pro reasoning runs on development credits with fair-use limits per IP." },
    ],
  },
  {
    title: "Lenses & workflow",
    items: [
      { q: "What is a 'lens'?", a: "A lens is a cognitive frame — a tuned system prompt, output schema, and dedicated input UI — purpose-built for one builder artifact. Spec Lens turns an idea into a PRD. RFC Lens drafts engineering proposals. Bug Lens ranks root-cause hypotheses." },
      { q: "How are lenses organized?", a: "Around the four stages of any builder loop: Plan (Spec, Task, Roadmap, OKR), Build (RFC, Legacy, Bug, Review), Ship (Story, Changelog, Launch), Decide (Debate, Pivot, Premortem, Tradeoff)." },
      { q: "How many lenses are there?", a: "Fifteen live lenses today. More coming based on feedback from real builders." },
      { q: "What's the 'reasoning trace'?", a: "MiMo V2.5 Pro streams internal reasoning before producing the final structured output. We expose that thinking so you can see how the model arrives at the answer — not just what it says." },
      { q: "Can I export the output?", a: "Every lens output supports one-click copy to clipboard as markdown. Native Notion / GitHub Issues / PDF export is on the roadmap." },
    ],
  },
  {
    title: "Privacy & data",
    items: [
      { q: "Do you store my inputs?", a: "No. Prism does not store inputs or outputs server-side. Each request is forwarded to MiMo as a single streaming call and forgotten." },
      { q: "Tracking or analytics?", a: "No fingerprinting, no third-party trackers, no cookies beyond what's necessary." },
      { q: "Where is data processed?", a: "Inputs are sent to MiMo's reasoning endpoint via Vercel serverless. Review both providers' policies if your input is sensitive (e.g. unreleased product specs)." },
    ],
  },
  {
    title: "Technical",
    items: [
      { q: "What's the stack?", a: "Next.js 16 App Router, TypeScript, Tailwind CSS v4, Framer Motion, Server-Sent Events. Deployed on Vercel. Reasoning via MiMo V2.5 Pro through the Xiaomi MiMo Open Platform." },
      { q: "Is Prism open source?", a: "Yes — MIT licensed. Code, system prompts, and architecture are public at github.com/XinnBlueBird/prism." },
      { q: "Can I self-host?", a: "Yes. Clone the repo, set MIMO_API_KEY / MIMO_API_BASE / MIMO_MODEL, run npm install && npm run dev. Get a key from platform.xiaomimimo.com." },
      { q: "Is there an API?", a: "Not yet. The current /api/reason endpoint is internal-only. Public API is on the roadmap." },
    ],
  },
];

export default function FAQPage() {
  return (
    <PageShell active="/faq">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">FAQ</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Common <span className="spectrum-text">questions</span>
        </h1>
        <p className="mt-4 text-white/60">Everything we get asked. If yours isn&apos;t here, open an issue on GitHub.</p>

        <div className="mt-12 space-y-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.18em] text-white/40">{group.title}</h2>
              <div className="space-y-2">
                {group.items.map((item, i) => (
                  <FAQItem key={item.q} q={item.q} a={item.a} defaultOpen={i === 0 && group.title === "Getting started"} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">Still curious?</h3>
          <p className="mt-2 text-white/60">Open an issue or start a discussion on GitHub.</p>
          <a
            href="https://github.com/XinnBlueBird/prism/issues"
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30 hover:text-white transition"
          >
            Open an issue ↗
          </a>
        </div>
      </section>
    </PageShell>
  );
}

function FAQItem({ q, a, defaultOpen }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        {open ? <Minus className="h-4 w-4 shrink-0 text-white/40" /> : <Plus className="h-4 w-4 shrink-0 text-white/40" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-5 text-sm leading-relaxed text-white/65">{a}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

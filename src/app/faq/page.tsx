"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/page-shell";

const FAQ_GROUPS: { title: string; items: { q: string; a: string }[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "What is Prism?",
        a: "Prism is a reasoning canvas built on MiMo V2.5 Pro. Pick a lens (a specialized cognitive frame), drop your input, and watch MiMo refract it into structured insight in real time. It also includes a Terminal for direct chat and a Studio for media playback/download.",
      },
      {
        q: "Do I need to sign up?",
        a: "No. Prism has no accounts, no logins, no waitlists. Open the page and start. We believe friction-free access matters more than capturing emails.",
      },
      {
        q: "How much does it cost?",
        a: "Prism is free to use. The MiMo V2.5 Pro reasoning is currently served under our development credits — usage is fair-use and may be rate-limited per IP during heavy load.",
      },
      {
        q: "Which platforms does Studio support?",
        a: "Prism Studio works with YouTube, Spotify, SoundCloud, TikTok, Twitter/X, Instagram Reels, Bilibili, and most major media platforms via the cobalt.tools open-source resolver.",
      },
    ],
  },
  {
    title: "Lenses & reasoning",
    items: [
      {
        q: "What is a 'lens'?",
        a: "A lens is a cognitive frame — a tuned system prompt, an output schema, and a dedicated input UI — purpose-built for one kind of thinking. Chain Lens turns a wallet address into a behavioral biography. Debate Lens turns a claim into four argued perspectives. Same engine, different reasoning shape.",
      },
      {
        q: "How many lenses are there?",
        a: "Ten live lenses today: Chain, Debate, Spec, Task, Alpha, Thread, Legacy, Paper, Pivot, and Dream. More are on the roadmap based on community feedback.",
      },
      {
        q: "What's the 'reasoning trace' I see?",
        a: "MiMo V2.5 Pro streams its internal reasoning before producing the final structured output. The trace panel exposes that thinking so you can see how the model arrives at the answer — not just what it says. It's a deliberate trust-and-transparency feature.",
      },
      {
        q: "Can I export the output?",
        a: "Yes. Every lens output supports one-click copy to clipboard. Markdown / JSON / PDF export is on the roadmap. For now, copy the structured markdown and paste it anywhere.",
      },
      {
        q: "Will Chain Lens read live on-chain data?",
        a: "Currently Chain Lens reasons from address shape and patterns alone, with explicit disclosure when a claim would require live RPC data. Live RPC integration (Etherscan, Solana, etc.) is on the roadmap.",
      },
    ],
  },
  {
    title: "Privacy & data",
    items: [
      {
        q: "Do you store my inputs?",
        a: "No. Prism does not store inputs or outputs server-side. Each request is forwarded to MiMo as a single streaming call and forgotten. There is no chat history database.",
      },
      {
        q: "Do you use analytics or tracking?",
        a: "No invasive fingerprinting, no third-party trackers, no cookies beyond what's strictly necessary for the site to function. We may add anonymous aggregate metrics (lens usage counts, no identifiers) in the future, opt-out by default.",
      },
      {
        q: "Where is data processed?",
        a: "Inputs are sent to MiMo's reasoning endpoint via Vercel's serverless functions. Both providers have their own privacy policies — review them if your input is sensitive.",
      },
    ],
  },
  {
    title: "Studio & media",
    items: [
      {
        q: "Is downloading media legal?",
        a: "It depends on your jurisdiction, the platform's terms of service, and the content's copyright status. Prism does not host or redistribute media — it resolves URLs you already have access to. You are responsible for respecting copyright in your use.",
      },
      {
        q: "Why does a link fail to resolve?",
        a: "Some content is region-locked, age-restricted, or recently uploaded and not yet indexed. Some platforms aggressively block resolvers. Try a different link or wait a few minutes and retry.",
      },
      {
        q: "Can I download high-quality video?",
        a: "Studio currently fetches 720p MP4 for video and 320kbps MP3 for audio. Higher-quality presets are planned.",
      },
    ],
  },
  {
    title: "Technical",
    items: [
      {
        q: "What's the tech stack?",
        a: "Next.js 16 (App Router), TypeScript, Tailwind CSS v4, Framer Motion, and Server-Sent Events for streaming. Deployed on Vercel. Reasoning via MiMo V2.5 Pro through the Xiaomi MiMo Open Platform.",
      },
      {
        q: "Is Prism open source?",
        a: "Yes. MIT licensed. The full code, system prompts, and architecture are public at github.com/XinnBlueBird/prism. Issues and pull requests welcome.",
      },
      {
        q: "Can I self-host Prism?",
        a: "Yes. Clone the repo, set MIMO_API_KEY / MIMO_API_BASE / MIMO_MODEL in your environment, run npm install && npm run dev. Get an API key from platform.xiaomimimo.com.",
      },
      {
        q: "Is there an API?",
        a: "Not yet, but it's on the roadmap. The current /api/reason endpoint is internal-only.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <PageShell active="/faq">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
          FAQ
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          Common <span className="spectrum-text">questions</span>
        </h1>
        <p className="mt-4 text-white/60">
          Everything we get asked. If yours isn&apos;t here, open an issue on
          GitHub.
        </p>

        <div className="mt-12 space-y-12">
          {FAQ_GROUPS.map((group) => (
            <div key={group.title}>
              <h2 className="mb-4 text-sm font-mono uppercase tracking-[0.18em] text-white/40">
                {group.title}
              </h2>
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
          <p className="mt-2 text-white/60">
            Open an issue or start a discussion on GitHub.
          </p>
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

function FAQItem({
  q,
  a,
  defaultOpen,
}: {
  q: string;
  a: string;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen ?? false);
  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-white/[0.02]">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition hover:bg-white/[0.03]"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        {open ? (
          <Minus className="h-4 w-4 shrink-0 text-white/40" />
        ) : (
          <Plus className="h-4 w-4 shrink-0 text-white/40" />
        )}
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
            <div className="px-5 pb-5 text-sm leading-relaxed text-white/65">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

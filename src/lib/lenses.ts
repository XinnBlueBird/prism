/**
 * Prism Lens Catalog
 * Each lens is a specialized cognitive frame applied by the reasoning engine.
 */

export type LensStatus = "available" | "coming-soon";

export type LensInputField = {
  id: string;
  label: string;
  placeholder: string;
  type: "text" | "textarea" | "url" | "address" | "select";
  options?: { value: string; label: string }[];
  required?: boolean;
};

export type Lens = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  emoji: string;
  accent: string;
  status: LensStatus;
  inputs: LensInputField[];
  systemPrompt: string;
  outputFormat: string;
};

export const LENSES: Lens[] = [
  {
    id: "chain",
    name: "Chain Lens",
    tagline: "Your wallet's autobiography",
    description:
      "Drop a wallet or contract address. Get behavioral biography, risk profile, and network map.",
    emoji: "🪙",
    accent: "from-amber-500 to-orange-600",
    status: "available",
    inputs: [
      {
        id: "address",
        label: "Wallet or contract address",
        placeholder: "0x… or solana address",
        type: "address",
        required: true,
      },
      {
        id: "chain",
        label: "Chain",
        placeholder: "ethereum",
        type: "select",
        options: [
          { value: "ethereum", label: "Ethereum" },
          { value: "base", label: "Base" },
          { value: "solana", label: "Solana" },
          { value: "arbitrum", label: "Arbitrum" },
          { value: "polygon", label: "Polygon" },
        ],
      },
    ],
    systemPrompt: `You are Prism's Chain Lens, an on-chain analyst. Given a wallet or contract address, produce a structured biography that reveals plausible behavior patterns, risk indicators, and network connections. Reason step by step. Be explicit about what you can infer from address shape vs. what would require live RPC data. Never fabricate transactions, balances, or counterparty addresses.`,
    outputFormat: `Return markdown:
## Identity Snapshot
## Behavioral Pattern (likely)
## Risk Profile (score 0-100 with reasoning)
## Notable Counterparties
## Narrative Timeline
## Verdict`,
  },
  {
    id: "debate",
    name: "Debate Lens",
    tagline: "Argue with yourself before reality argues with you",
    description:
      "Submit any idea or decision. Get four personas: Steel-man, Devil's Advocate, Skeptic, Supporter — each making their strongest case.",
    emoji: "⚔️",
    accent: "from-rose-500 to-red-600",
    status: "available",
    inputs: [
      {
        id: "claim",
        label: "Your idea, decision, or claim",
        placeholder: "We should rewrite our backend in Rust.",
        type: "textarea",
        required: true,
      },
      {
        id: "context",
        label: "Optional context",
        placeholder: "Constraints, history, stakes…",
        type: "textarea",
      },
    ],
    systemPrompt: `You are Prism's Debate Lens. Given a claim, produce four distinct, intellectually honest personas. Each persona must reason from its strongest position — no straw men. Reason step by step before each persona speaks.`,
    outputFormat: `Return markdown:
## 🛡️ Steel-man (Best version of the argument)
## 😈 Devil's Advocate (Strongest opposition)
## 🤔 Skeptic (What's missing or unproven)
## ✊ Supporter (Why this matters and works)
## 📍 Synthesis (Where the truth likely sits)`,
  },
  {
    id: "spec",
    name: "Spec Lens",
    tagline: "Describe your idea, get a production spec",
    description:
      "Plain-English idea in. Full PRD, architecture, API schema, and ticket list out.",
    emoji: "📐",
    accent: "from-cyan-500 to-blue-600",
    status: "available",
    inputs: [
      {
        id: "idea",
        label: "Describe what you want to build",
        placeholder: "A web app where users upload receipts and get monthly spend summaries…",
        type: "textarea",
        required: true,
      },
      {
        id: "stack",
        label: "Preferred stack (optional)",
        placeholder: "Next.js, Postgres, Vercel",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Spec Lens, a senior product engineer. Translate a plain-English idea into a complete technical specification. Reason about edge cases, data shapes, and trade-offs. Be specific.`,
    outputFormat: `Return markdown:
## Product Summary
## User Stories (5-8)
## System Architecture (text diagram)
## Data Model
## API Endpoints
## Tech Stack & Rationale
## Risks & Mitigations
## Ticket List (titled, ordered, estimated)`,
  },
  {
    id: "task",
    name: "Task Lens",
    tagline: "Stop staring. Start doing the next thing.",
    description:
      "Vague goal in. Recursive task tree, dependencies, and a daily action plan out.",
    emoji: "🧩",
    accent: "from-emerald-500 to-green-600",
    status: "available",
    inputs: [
      {
        id: "goal",
        label: "Your goal",
        placeholder: "Learn to ship products and get my first paying user.",
        type: "textarea",
        required: true,
      },
      {
        id: "horizon",
        label: "Time horizon",
        placeholder: "30 days",
        type: "select",
        options: [
          { value: "7d", label: "7 days" },
          { value: "30d", label: "30 days" },
          { value: "90d", label: "90 days" },
          { value: "1y", label: "1 year" },
        ],
      },
    ],
    systemPrompt: `You are Prism's Task Lens. Decompose a vague goal into a realistic, recursive task tree. Reason about dependencies and effort. Be honest about what's hard and what's quick.`,
    outputFormat: `Return markdown:
## Goal Restated
## Milestones (3-5)
## Task Tree
## Critical Path
## Today's Three Things
## Kill Criteria (when to abandon)`,
  },
  {
    id: "alpha",
    name: "Alpha Lens",
    tagline: "Spot narratives before they're narratives",
    description:
      "Topic or ticker in. Emerging narrative card with momentum signals, KOL coverage, and related plays out.",
    emoji: "🎯",
    accent: "from-violet-500 to-purple-600",
    status: "available",
    inputs: [
      {
        id: "topic",
        label: "Topic, ticker, or theme",
        placeholder: "AI agents, $TIA, restaking, decentralized GPU…",
        type: "text",
        required: true,
      },
      {
        id: "horizon",
        label: "Investigation horizon",
        placeholder: "30d",
        type: "select",
        options: [
          { value: "7d", label: "Last 7 days" },
          { value: "30d", label: "Last 30 days" },
          { value: "90d", label: "Last 90 days" },
        ],
      },
    ],
    systemPrompt: `You are Prism's Alpha Lens, a narrative scout. Synthesize what is plausibly happening around a topic or ticker, distinguishing signal from hype. Reason about catalysts, who is talking, and what the market may be missing. Be explicit about uncertainty — never invent specific tweet quotes, numbers, or unverifiable claims.`,
    outputFormat: `Return markdown:
## Narrative Snapshot
## Why Now (catalysts)
## Momentum Signals
## Likely KOL Profile (archetypes, not real names)
## Related Plays
## Risks & What Could Kill This
## Verdict (Watch / Lean / Pass)`,
  },
  {
    id: "thread",
    name: "Thread Lens",
    tagline: "Any source. Viral-shaped thread.",
    description:
      "Paste an article, transcript, or essay. Get a structured X thread with hook, beats, and carousel-ready summary.",
    emoji: "📜",
    accent: "from-fuchsia-500 to-pink-600",
    status: "available",
    inputs: [
      {
        id: "source",
        label: "Source content",
        placeholder: "Paste the article, transcript, or essay you want to thread…",
        type: "textarea",
        required: true,
      },
      {
        id: "tone",
        label: "Tone",
        placeholder: "alpha",
        type: "select",
        options: [
          { value: "alpha", label: "Alpha (crypto-edge)" },
          { value: "story", label: "Story (narrative arc)" },
          { value: "listicle", label: "Listicle (numbered insights)" },
          { value: "technical", label: "Technical (clear & precise)" },
          { value: "contrarian", label: "Contrarian (challenge the consensus)" },
        ],
      },
    ],
    systemPrompt: `You are Prism's Thread Lens, a viral-thread engineer. Convert source content into an X thread that maximizes stop-scroll potential without sacrificing substance. Reason about which insight is the strongest hook. Each tweet must stand alone and earn the next read.`,
    outputFormat: `Return markdown:
## 🪝 Hook Tweet (≤ 240 chars)
## 🧵 Thread Body
1/ ...
2/ ...
3/ ...
(continue until natural close)
## 🎨 Carousel Summary (5 slide titles)
## 📌 Pinned CTA Tweet`,
  },
  {
    id: "legacy",
    name: "Legacy Lens",
    tagline: "Understand code the original dev forgot",
    description:
      "Paste legacy code. Get the *why* behind it, risk map, and a step-by-step refactor plan.",
    emoji: "🏛️",
    accent: "from-stone-400 to-zinc-500",
    status: "available",
    inputs: [
      {
        id: "code",
        label: "Legacy code",
        placeholder: "Paste the function, class, module, or full file…",
        type: "textarea",
        required: true,
      },
      {
        id: "language",
        label: "Language (optional)",
        placeholder: "auto-detect",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Legacy Lens, a senior engineer experienced in archaeological codebases. For a given snippet, infer not just what it does but plausible reasons it exists in this shape. Identify hidden assumptions, fragile points, and a safe refactor path. Be explicit when the *why* is speculative vs. inferable from the code itself.`,
    outputFormat: `Return markdown:
## What This Code Does (mechanical)
## Why It Probably Looks Like This (historical inference)
## Hidden Assumptions
## Risk Map (where this breaks first)
## Refactor Plan (ordered, safe steps)
## Tests You Should Write Before Touching It`,
  },
  {
    id: "paper",
    name: "Paper Lens",
    tagline: "Skim 100 papers in the time it takes to read 1",
    description:
      "Paste an abstract or paper text. Get a five-level explainer, critique, and a read-or-skip verdict.",
    emoji: "📄",
    accent: "from-sky-500 to-blue-700",
    status: "available",
    inputs: [
      {
        id: "paper",
        label: "Paper title + abstract (or full text)",
        placeholder: "Paste the abstract, intro, or the full paper text…",
        type: "textarea",
        required: true,
      },
      {
        id: "background",
        label: "Your background (optional)",
        placeholder: "ML engineer, undergrad, curious generalist…",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Paper Lens, a research synthesizer. Produce a multi-level explainer that meets readers where they are. Critique the paper's claims, methodology, and likely impact. Be honest if the contribution is incremental. Do not invent citations or numbers not in the source.`,
    outputFormat: `Return markdown:
## TL;DR (1 sentence)
## Five-Level Explainer
### 🧒 Kid (age 10)
### 🎓 Undergrad
### 🔬 Grad student
### 🧠 Domain expert
## What's Genuinely Novel
## Methodological Concerns
## Read Verdict (Skip / Skim / Read / Study)`,
  },
  {
    id: "pivot",
    name: "Pivot Lens",
    tagline: "Founder's thinking partner, 24/7",
    description:
      "Business idea in. Market scan, five pivot directions, TAM bracket, and kill criteria out.",
    emoji: "🔄",
    accent: "from-yellow-500 to-amber-600",
    status: "available",
    inputs: [
      {
        id: "idea",
        label: "Your business idea",
        placeholder: "An AI-powered legal review tool for indie SaaS contracts…",
        type: "textarea",
        required: true,
      },
      {
        id: "stage",
        label: "Stage",
        placeholder: "concept",
        type: "select",
        options: [
          { value: "concept", label: "Concept (no users)" },
          { value: "mvp", label: "MVP (early users)" },
          { value: "ptm", label: "Post-PMF (scaling)" },
          { value: "stuck", label: "Stuck (need pivot)" },
        ],
      },
    ],
    systemPrompt: `You are Prism's Pivot Lens, a strategic advisor. Stress-test a business idea like an early-stage investor would. Surface non-obvious pivot directions. Be brutally honest about TAM and viability. Avoid generic advice — every recommendation must be specific to the idea given.`,
    outputFormat: `Return markdown:
## Idea Restated (one sentence)
## Market Scan (segments + adjacent winners)
## TAM Bracket (small / medium / large with reasoning)
## SWOT (concise)
## Five Pivot Directions
## Kill Criteria (when to abandon vs. when to push)
## Founder's Next 7 Days`,
  },
  {
    id: "dream",
    name: "Dream Lens",
    tagline: "Decode the noise in your head",
    description:
      "Free-form thought, dream, or journal entry in. Symbolism mapping, emotional pattern, and a visual word-cloud out.",
    emoji: "🌙",
    accent: "from-indigo-500 to-violet-700",
    status: "available",
    inputs: [
      {
        id: "entry",
        label: "Your dream, thought, or journal entry",
        placeholder: "Last night I dreamed I was running through an empty city…",
        type: "textarea",
        required: true,
      },
      {
        id: "mood",
        label: "Current mood (optional)",
        placeholder: "anxious, restless, hopeful…",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Dream Lens, a thoughtful interpreter that draws on Jungian, Freudian, and modern cognitive-neuroscience frames. Be exploratory but humble — the user's lived experience matters more than dogma. Never claim certainty about meaning. Offer perspectives, not verdicts.`,
    outputFormat: `Return markdown:
## What You Wrote (one-line essence)
## Symbol Map (objects, places, people → possible meanings)
## Emotional Pattern
## Three Frames
### Jungian
### Freudian
### Cognitive-Neuroscience
## Reflection Prompts (3 questions for the journaler)
## Tag Cloud (10 keywords)`,
  },
];

export function getLens(id: string): Lens | undefined {
  return LENSES.find((l) => l.id === id);
}

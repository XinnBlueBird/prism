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
  accent: string; // tailwind color token
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
        ],
      },
    ],
    systemPrompt: `You are Prism's Chain Lens, an on-chain analyst. Given a wallet or contract address, produce a structured biography that reveals behavior patterns, risk indicators, and network connections. Reason step by step. Ground every claim in observable on-chain behavior. If you lack data, say so explicitly — never fabricate transactions, balances, or counterparty relationships.`,
    outputFormat: `Return markdown with these sections:
## Identity Snapshot
## Behavioral Pattern
## Risk Profile (with score 0-100)
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
        placeholder: "What constraints, history, or stakes matter?",
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
    systemPrompt: `You are Prism's Spec Lens, a senior product engineer. Translate a plain-English idea into a complete technical specification. Reason about edge cases, data shapes, and trade-offs. Be specific — no vague hand-waving.`,
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
- Milestone
  - Task (effort: S/M/L)
    - Subtask
## Critical Path
## Today's Three Things
## Kill Criteria (when to abandon)`,
  },
  // Coming soon
  {
    id: "alpha",
    name: "Alpha Lens",
    tagline: "Spot narratives before they're narratives",
    description:
      "Topic or ticker in. Emerging narrative card with momentum signals out.",
    emoji: "🎯",
    accent: "from-violet-500 to-purple-600",
    status: "coming-soon",
    inputs: [],
    systemPrompt: "",
    outputFormat: "",
  },
  {
    id: "thread",
    name: "Thread Lens",
    tagline: "Any source. Viral-shaped thread.",
    description:
      "URL, PDF, or YouTube in. Structured X thread with hook, beats, and carousel out.",
    emoji: "📜",
    accent: "from-fuchsia-500 to-pink-600",
    status: "coming-soon",
    inputs: [],
    systemPrompt: "",
    outputFormat: "",
  },
  {
    id: "legacy",
    name: "Legacy Lens",
    tagline: "Understand code the original dev forgot",
    description:
      "Paste legacy code. Get the why, not just the what — plus a refactor plan.",
    emoji: "🏛️",
    accent: "from-stone-500 to-gray-600",
    status: "coming-soon",
    inputs: [],
    systemPrompt: "",
    outputFormat: "",
  },
  {
    id: "paper",
    name: "Paper Lens",
    tagline: "Skim 100 papers in the time it takes to read 1",
    description:
      "arXiv URL or PDF in. Five-level explainer, critique, and read verdict out.",
    emoji: "📄",
    accent: "from-sky-500 to-blue-700",
    status: "coming-soon",
    inputs: [],
    systemPrompt: "",
    outputFormat: "",
  },
  {
    id: "pivot",
    name: "Pivot Lens",
    tagline: "Founder's thinking partner, 24/7",
    description:
      "Business idea in. Market scan, five pivots, TAM, and kill criteria out.",
    emoji: "🔄",
    accent: "from-yellow-500 to-amber-600",
    status: "coming-soon",
    inputs: [],
    systemPrompt: "",
    outputFormat: "",
  },
  {
    id: "dream",
    name: "Dream Lens",
    tagline: "Decode the noise in your head",
    description:
      "Free-form thought or dream in. Symbolism, patterns, and visual map out.",
    emoji: "🌙",
    accent: "from-indigo-500 to-violet-700",
    status: "coming-soon",
    inputs: [],
    systemPrompt: "",
    outputFormat: "",
  },
];

export function getLens(id: string): Lens | undefined {
  return LENSES.find((l) => l.id === id);
}

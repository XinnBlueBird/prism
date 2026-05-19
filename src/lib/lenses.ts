/**
 * Prism — Builder/Founder AI Workspace
 *
 * Each lens is a specialized cognitive frame purpose-built for
 * shipping software products: planning, writing specs, debugging,
 * stress-testing decisions, decomposing goals.
 *
 * Powered by MiMo V2.5 Pro reasoning.
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

export type LensCategory = "plan" | "build" | "ship" | "decide";

export type Lens = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  /** @deprecated Never rendered in UI — kept for type compat */
  emoji: string;
  /** Lucide-react icon component name */
  icon: string;
  accent: string;
  category: LensCategory;
  status: LensStatus;
  inputs: LensInputField[];
  systemPrompt: string;
  outputFormat: string;
};

export const CATEGORIES: Record<
  LensCategory,
  { label: string; description: string; icon: string }
> = {
  plan: {
    label: "Plan",
    description: "Turn vague ideas into actionable specs and roadmaps.",
    icon: "Map",
  },
  build: {
    label: "Build",
    description: "Reason through code, architecture, and engineering choices.",
    icon: "Hammer",
  },
  ship: {
    label: "Ship",
    description: "Convert work into stories, tickets, RFCs, and changelogs.",
    icon: "Rocket",
  },
  decide: {
    label: "Decide",
    description: "Stress-test decisions before you commit to them.",
    icon: "Scale",
  },
};

export const LENSES: Lens[] = [
  // ─────────── PLAN ───────────
  {
    id: "spec",
    name: "Spec Lens",
    tagline: "Plain idea → production spec",
    description:
      "Drop a plain-English idea. Get a complete PRD: user stories, architecture, data model, API endpoints, and a ticket list ready to ship.",
    emoji: "",
    icon: "Ruler",
    accent: "from-cyan-500 to-blue-600",
    category: "plan",
    status: "available",
    inputs: [
      {
        id: "idea",
        label: "Describe what you want to build",
        placeholder:
          "A web app where users upload receipts and get monthly spend summaries with category breakdowns…",
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
    systemPrompt: `You are Prism's Spec Lens, a senior product engineer. Translate a plain-English idea into a complete technical specification. Reason explicitly about edge cases, data shapes, and trade-offs. Be specific.`,
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
    tagline: "Vague goal → recursive plan",
    description:
      "Drop a vague goal. Get a recursive task tree, dependency map, today's three things, and kill criteria for when to abandon.",
    emoji: "",
    icon: "ListTree",
    accent: "from-emerald-500 to-green-600",
    category: "plan",
    status: "available",
    inputs: [
      {
        id: "goal",
        label: "Your goal",
        placeholder: "Ship our v1 landing page and get 100 signups in 30 days.",
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
    id: "roadmap",
    name: "Roadmap Lens",
    tagline: "Vision → quarterly roadmap",
    description:
      "From product vision to a Now / Next / Later roadmap with bets, milestones, and success metrics. Built for solo founders and small teams.",
    emoji: "",
    icon: "Map",
    accent: "from-teal-500 to-emerald-600",
    category: "plan",
    status: "available",
    inputs: [
      {
        id: "vision",
        label: "Product vision",
        placeholder:
          "Help indie SaaS founders run customer interviews 10× faster with AI synthesis.",
        type: "textarea",
        required: true,
      },
      {
        id: "constraints",
        label: "Constraints / context",
        placeholder: "Solo founder, 6 months runway, no team yet…",
        type: "textarea",
      },
    ],
    systemPrompt: `You are Prism's Roadmap Lens. Convert vision into a phased Now/Next/Later roadmap. Reason about leading indicators, bets vs. certainties, and what should explicitly be cut to focus.`,
    outputFormat: `Return markdown:
## Vision Restated
## North Star Metric
## Now (this quarter)
## Next (next quarter)
## Later (6+ months)
## Explicit Non-Goals
## Bets vs. Certainties
## Success Criteria (per phase)`,
  },
  {
    id: "okr",
    name: "OKR Lens",
    tagline: "Goal → measurable OKRs",
    description:
      "Turn a fuzzy quarterly goal into objectives + measurable key results, anti-goals, and weekly check-in cadence.",
    emoji: "",
    icon: "Target",
    accent: "from-violet-500 to-purple-600",
    category: "plan",
    status: "available",
    inputs: [
      {
        id: "goal",
        label: "What do you want to achieve?",
        placeholder: "Get to product-market fit in Q3.",
        type: "textarea",
        required: true,
      },
      {
        id: "team",
        label: "Team size / context",
        placeholder: "Solo founder, 2-person team, 5-person seed startup…",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's OKR Lens. Build sharp, measurable Objectives + Key Results. Push back on vague KRs — every KR must be quantitative or have a binary success criterion. Suggest anti-goals to prevent scope creep.`,
    outputFormat: `Return markdown:
## Quarterly Theme
## Objective 1
- KR 1 (measurable)
- KR 2 (measurable)
- KR 3 (measurable)
## Objective 2
…
## Anti-Goals (explicit non-targets)
## Weekly Check-in Questions
## Risk: What Could Make Us Miss These?`,
  },

  // ─────────── BUILD ───────────
  {
    id: "rfc",
    name: "RFC Lens",
    tagline: "Engineering proposal in minutes",
    description:
      "Draft a complete engineering RFC: motivation, design, alternatives considered, trade-offs, migration plan, and open questions.",
    emoji: "",
    icon: "FileText",
    accent: "from-blue-500 to-indigo-600",
    category: "build",
    status: "available",
    inputs: [
      {
        id: "topic",
        label: "Engineering topic / proposal",
        placeholder: "Migrate from REST to gRPC for internal services.",
        type: "textarea",
        required: true,
      },
      {
        id: "context",
        label: "Codebase / org context",
        placeholder: "Mid-size startup, ~30 services in Go and Node…",
        type: "textarea",
      },
    ],
    systemPrompt: `You are Prism's RFC Lens, a staff engineer drafting a high-quality Request for Comments. Reason about trade-offs honestly. Surface alternatives you considered and why they were rejected. Make migration risk explicit.`,
    outputFormat: `Return markdown:
# RFC: <Title>
## Status: Draft
## Author: (you)
## Motivation
## Goals & Non-Goals
## Proposed Design
## Alternatives Considered
## Trade-offs & Risks
## Migration Plan
## Open Questions
## Decision (TBD)`,
  },
  {
    id: "legacy",
    name: "Legacy Lens",
    tagline: "Inherit code → understand the why",
    description:
      "Paste legacy code. Get the why behind it, hidden assumptions, risk map, and a safe step-by-step refactor plan.",
    emoji: "",
    icon: "Landmark",
    accent: "from-stone-400 to-zinc-500",
    category: "build",
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
    systemPrompt: `You are Prism's Legacy Lens, a senior engineer experienced with archaeological codebases. For a snippet, infer not just what it does but plausible reasons it exists this way. Identify hidden assumptions and a safe refactor path.`,
    outputFormat: `Return markdown:
## What This Code Does (mechanical)
## Why It Probably Looks Like This
## Hidden Assumptions
## Risk Map (where it breaks first)
## Refactor Plan (ordered, safe steps)
## Tests You Should Write Before Touching It`,
  },
  {
    id: "bug",
    name: "Bug Lens",
    tagline: "Symptom → root cause",
    description:
      "Drop a bug report, error log, or stack trace. Get hypotheses ranked by likelihood, diagnostic steps, and a minimal repro plan.",
    emoji: "",
    icon: "Bug",
    accent: "from-rose-500 to-pink-600",
    category: "build",
    status: "available",
    inputs: [
      {
        id: "report",
        label: "Bug report or stack trace",
        placeholder:
          "Users intermittently get logged out after 5 minutes on Safari iOS only…",
        type: "textarea",
        required: true,
      },
      {
        id: "context",
        label: "Stack / env (optional)",
        placeholder: "Next.js 14, NextAuth, Vercel Edge, sticky sessions off",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Bug Lens, a calm SRE-minded debugger. Reason from symptom to root cause. Rank hypotheses by likelihood, not by what's easiest to test. Suggest the minimum reproduction that would falsify each hypothesis.`,
    outputFormat: `Return markdown:
## Symptom Summary
## Top Hypotheses (ranked, with reasoning)
1. …
2. …
3. …
## Diagnostic Steps (in order)
## Minimal Reproduction Plan
## Quickest Fix vs. Right Fix`,
  },
  {
    id: "review",
    name: "Review Lens",
    tagline: "Diff → senior code review",
    description:
      "Paste a diff or PR. Get review comments grouped by severity, with concrete suggestions and a final ship/block verdict.",
    emoji: "",
    icon: "Eye",
    accent: "from-amber-500 to-orange-600",
    category: "build",
    status: "available",
    inputs: [
      {
        id: "diff",
        label: "Diff or PR description",
        placeholder: "Paste the diff or describe the change in detail…",
        type: "textarea",
        required: true,
      },
      {
        id: "context",
        label: "What does this PR aim to do?",
        placeholder: "Adds rate limiting to public API endpoints.",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Review Lens, a senior code reviewer. Be specific, kind, and unflinching. Group comments by Blocking / Recommended / Nit. Always close with a clear ship/block verdict and rationale.`,
    outputFormat: `Return markdown:
## Summary of Change (1 sentence)
## Blocking (must fix before merge)
## Recommended (strongly encouraged)
## Nits (style, minor)
## Verdict: SHIP / NEEDS WORK / BLOCK
## Rationale`,
  },

  // ─────────── SHIP ───────────
  {
    id: "story",
    name: "Story Lens",
    tagline: "Feature → user stories + acceptance criteria",
    description:
      "Convert a feature idea into well-formed user stories with explicit acceptance criteria and edge cases ready for sprint planning.",
    emoji: "",
    icon: "BookOpen",
    accent: "from-fuchsia-500 to-pink-600",
    category: "ship",
    status: "available",
    inputs: [
      {
        id: "feature",
        label: "Feature description",
        placeholder: "Let users invite teammates by email with role-based permissions.",
        type: "textarea",
        required: true,
      },
      {
        id: "persona",
        label: "Primary persona (optional)",
        placeholder: "Solo founder, ops manager, end-user…",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Story Lens, a sharp product manager. Convert a feature idea into INVEST-shaped user stories with concrete acceptance criteria. Surface edge cases that engineers will hit but PMs forget.`,
    outputFormat: `Return markdown:
## Feature Summary
## User Stories (Given/When/Then)
1. As a … I want … so that …
   - AC: …
   - AC: …
2. …
## Edge Cases & Failure States
## Out of Scope (explicit)
## Definition of Done`,
  },
  {
    id: "changelog",
    name: "Changelog Lens",
    tagline: "Commits → user-facing changelog",
    description:
      "Paste commit messages or PR titles. Get a polished, user-facing changelog organized by Added / Changed / Fixed.",
    emoji: "",
    icon: "Package",
    accent: "from-green-500 to-emerald-600",
    category: "ship",
    status: "available",
    inputs: [
      {
        id: "commits",
        label: "Commit messages or PR titles",
        placeholder: "Paste git log --oneline output or PR titles, one per line…",
        type: "textarea",
        required: true,
      },
      {
        id: "version",
        label: "Version (optional)",
        placeholder: "v0.4.0",
        type: "text",
      },
    ],
    systemPrompt: `You are Prism's Changelog Lens. Translate technical commit messages into a user-facing changelog. Cluster related items. Drop chore/internal noise. Use the active voice.`,
    outputFormat: `Return markdown:
# vX.Y.Z — <date>
## Added
## Changed
## Fixed
## Internal (collapsed)
## Migration Notes (if any)`,
  },
  {
    id: "thread",
    name: "Launch Lens",
    tagline: "Feature → launch thread + assets",
    description:
      "Convert a launch into a viral-shaped X thread with hook tweet, body beats, carousel summary, and a pinned CTA.",
    emoji: "",
    icon: "Rocket",
    accent: "from-orange-500 to-red-600",
    category: "ship",
    status: "available",
    inputs: [
      {
        id: "source",
        label: "Launch summary / blog post / changelog",
        placeholder:
          "We just shipped real-time collaboration in Prism Workspace…",
        type: "textarea",
        required: true,
      },
      {
        id: "tone",
        label: "Tone",
        placeholder: "story",
        type: "select",
        options: [
          { value: "story", label: "Story (narrative arc)" },
          { value: "alpha", label: "Alpha (insider edge)" },
          { value: "listicle", label: "Listicle (numbered insights)" },
          { value: "technical", label: "Technical (clear & precise)" },
          { value: "contrarian", label: "Contrarian (challenge consensus)" },
        ],
      },
    ],
    systemPrompt: `You are Prism's Launch Lens, a viral-thread engineer for builder launches. Reason about which insight is the strongest hook. Each tweet must stand alone and earn the next read. Avoid hype words.`,
    outputFormat: `Return markdown:
## Hook Tweet (≤ 240 chars)
## Thread Body
1/ ...
2/ ...
3/ ...
## Carousel Summary (5 slide titles)
## Pinned CTA Tweet`,
  },

  // ─────────── DECIDE ───────────
  {
    id: "debate",
    name: "Debate Lens",
    tagline: "Argue with yourself before reality argues with you",
    description:
      "Submit any decision. Get four personas — Steel-man, Devil's Advocate, Skeptic, Supporter — each making their strongest case.",
    emoji: "",
    icon: "Swords",
    accent: "from-rose-500 to-red-600",
    category: "decide",
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
    systemPrompt: `You are Prism's Debate Lens. Given a claim, produce four distinct, intellectually honest personas. Each persona must reason from its strongest position — no straw men.`,
    outputFormat: `Return markdown:
## Steel-man (best version of the argument)
## Devil's Advocate (strongest opposition)
## Skeptic (what's missing or unproven)
## Supporter (why this matters and works)
## Synthesis (where the truth likely sits)`,
  },
  {
    id: "pivot",
    name: "Pivot Lens",
    tagline: "Founder's thinking partner",
    description:
      "Stress-test a business idea. Get market scan, five pivot directions, TAM bracket, and explicit kill criteria.",
    emoji: "",
    icon: "RefreshCw",
    accent: "from-yellow-500 to-amber-600",
    category: "decide",
    status: "available",
    inputs: [
      {
        id: "idea",
        label: "Your business idea",
        placeholder:
          "An AI-powered legal review tool for indie SaaS contracts…",
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
    systemPrompt: `You are Prism's Pivot Lens, a strategic advisor. Stress-test a business idea like a sharp early-stage investor. Surface non-obvious pivot directions. Be brutally honest about TAM and viability.`,
    outputFormat: `Return markdown:
## Idea Restated (one sentence)
## Market Scan (segments + adjacent winners)
## TAM Bracket (with reasoning)
## SWOT (concise)
## Five Pivot Directions
## Kill Criteria
## Founder's Next 7 Days`,
  },
  {
    id: "premortem",
    name: "Premortem Lens",
    tagline: "Imagine it failed → fix it now",
    description:
      "Imagine your project fails in 6 months. Get the most likely failure modes, ranked by probability, with mitigations you can apply today.",
    emoji: "",
    icon: "Skull",
    accent: "from-zinc-500 to-slate-600",
    category: "decide",
    status: "available",
    inputs: [
      {
        id: "project",
        label: "What you're building",
        placeholder:
          "A B2B SaaS that automates SOC 2 compliance for early-stage startups.",
        type: "textarea",
        required: true,
      },
      {
        id: "horizon",
        label: "Time horizon",
        placeholder: "6 months",
        type: "select",
        options: [
          { value: "3m", label: "3 months" },
          { value: "6m", label: "6 months" },
          { value: "1y", label: "1 year" },
          { value: "2y", label: "2 years" },
        ],
      },
    ],
    systemPrompt: `You are Prism's Premortem Lens. Reason from a future where the project has failed. Identify failure modes ranked by probability and severity. For each, suggest a mitigation that costs little to apply now.`,
    outputFormat: `Return markdown:
## The Project (one sentence)
## Failure Modes (ranked by probability)
1. **Mode** — likelihood / severity
   - Why this happens
   - Mitigation you can apply today
2. …
## Top 3 Pre-mortem Bets (do these first)
## Trip-wires (signals that mean "abort")`,
  },
  {
    id: "tradeoff",
    name: "Tradeoff Lens",
    tagline: "A vs B → clear-headed decision matrix",
    description:
      "Compare two options across the dimensions that actually matter. Get a weighted decision matrix and a concrete recommendation.",
    emoji: "",
    icon: "Scale",
    accent: "from-indigo-500 to-violet-700",
    category: "decide",
    status: "available",
    inputs: [
      {
        id: "options",
        label: "The two (or more) options",
        placeholder:
          "Option A: rewrite in Rust. Option B: keep Go and optimize.",
        type: "textarea",
        required: true,
      },
      {
        id: "context",
        label: "What you're optimizing for",
        placeholder: "Latency, team velocity, hiring pool, runway…",
        type: "textarea",
      },
    ],
    systemPrompt: `You are Prism's Tradeoff Lens. Compare the given options across the dimensions that genuinely matter for the user's context — not generic checklist criteria. Surface dimensions the user might have missed. Give a clear recommendation with rationale.`,
    outputFormat: `Return markdown:
## Options Restated
## Dimensions That Actually Matter (with reasoning)
## Decision Matrix
| Dimension | Option A | Option B | Weight |
…
## Hidden Costs / Risks per Option
## Recommendation (with confidence level)
## Reversal Cost (how hard is it to undo?)`,
  },
];

export function getLens(id: string): Lens | undefined {
  return LENSES.find((l) => l.id === id);
}

export function getLensesByCategory(cat: LensCategory): Lens[] {
  return LENSES.filter((l) => l.category === cat);
}

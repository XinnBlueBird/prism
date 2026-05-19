<div align="center">

<img src="public/og.svg" alt="Prism" width="120" />

# Prism

### *The AI workspace for builders.*

A reasoning workspace for solo founders, indie hackers, and small teams.
Plan, build, ship, and decide — with **15 specialized AI lenses** powered by **MiMo V2.5 Pro**.

[![Built with Next.js](https://img.shields.io/badge/Built%20with-Next.js%2016-black?style=flat-square)](https://nextjs.org)
[![Powered by MiMo](https://img.shields.io/badge/Powered%20by-MiMo%20V2.5%20Pro-a78bfa?style=flat-square)](https://platform.xiaomimimo.com)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000?style=flat-square)](https://vercel.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green?style=flat-square)](LICENSE)

</div>

---

## What is Prism?

Most AI tools are chat boxes. Prism is a **reasoning workspace**.

Pick a lens, drop your input, and watch MiMo V2.5 Pro produce a structured, ready-to-use artifact — a PRD, an RFC, a task tree, a launch thread, a premortem analysis. Not a wall of text. A deliverable.

Every output streams a visible **reasoning trace** so you can see *how* the model thinks, not just *what* it says.

> **15 lenses. One engine. Four workflow stages. Every output ready to ship.**

## Features

### Lenses — 15 specialized AI tools

Organized into four workflow stages:

**Plan** — Turn vague ideas into actionable specs.
| Lens | What it does |
|------|-------------|
| Spec | Plain-English idea into PRD, architecture, API schema, and tickets |
| Task | Vague goal into recursive task tree, dependencies, and daily plan |
| Roadmap | Features into quarter-by-quarter roadmap with milestones |
| OKR | Objectives into measurable KRs and anti-goals |

**Build** — Reason through code and engineering choices.
| Lens | What it does |
|------|-------------|
| RFC | Tech proposal into motivation, alternatives, and trade-offs |
| Legacy | Legacy code into why it exists and a safe refactor plan |
| Bug | Stack trace into ranked hypotheses and repro plan |
| Review | Code into bugs, security issues, and performance analysis |

**Ship** — Convert work into shippable artifacts.
| Lens | What it does |
|------|-------------|
| Story | Feature into INVEST user stories with acceptance criteria |
| Changelog | Git diff into human-readable release notes |
| Launch | Changelog into viral X launch thread |

**Decide** — Stress-test decisions before committing.
| Lens | What it does |
|------|-------------|
| Debate | Any claim into Steel-man, Devil's Advocate, Skeptic, and Supporter |
| Pivot | Business idea into market scan, pivots, and kill criteria |
| Premortem | Project into failure modes and preemptive mitigations |
| Tradeoff | Decision into weighted option comparison with second-order effects |

### Tools

- **AI Terminal** — Direct MiMo chat with reasoning trace, history navigation (arrow keys), and streaming output.
- **AI Workspace** — Split-pane interface: pick any lens, drop input, watch streaming output with reasoning trace. Run history on the bottom.
- **AI Code Review** — Paste code, get severity-ranked findings (critical / warning / info) with suggested fixes.
- **AI Brainstorm** — Enter a topic, get 12 concrete ideas across bold, practical, and wildcard categories. Mark the ones to keep, export as markdown.

### Navigation

Pages are split by workflow stage:
- `/plan`, `/build`, `/ship`, `/decide` — Category pages with filtered lens grids
- `/lenses` — Browse all 15 lenses with search and category filter
- `/terminal` — Direct AI chat
- `/workspace` — Multi-lens runner
- `/tools/review` — Code review tool
- `/tools/brainstorm` — Brainstorming board

## Why MiMo V2.5 Pro?

Prism is built to showcase **structured reasoning**, not chat completion. Every lens forces multi-step reasoning across a different domain — system design, adversarial debate, recursive decomposition, strategic analysis.

That breadth and depth is where MiMo V2.5 Pro shines. It streams a visible reasoning trace before producing structured output, making the model's thinking process transparent.

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router) + TypeScript
- **Styling:** Tailwind CSS v4 + custom spectrum theming
- **Animation:** Framer Motion
- **Icons:** Lucide React
- **Toasts:** Sonner
- **Reasoning:** MiMo V2.5 Pro via Xiaomi MiMo Open Platform
- **Deployment:** Vercel (Edge-friendly Server-Sent Events streaming)

## Getting Started

### Prerequisites
- Node.js 20+
- A MiMo Open Platform API key — get one at [platform.xiaomimimo.com](https://platform.xiaomimimo.com)

### 1. Clone and install

```bash
git clone https://github.com/XinnBlueBird/prism.git
cd prism
npm install
```

### 2. Configure environment

```bash
cp .env.example .env.local
```

Then edit `.env.local`:

```env
MIMO_API_KEY=your-mimo-api-key-here
MIMO_API_BASE=https://token-plan-sgp.xiaomimimo.com/v1
MIMO_MODEL=mimo-v2.5-pro
```

> `.env.local` is gitignored. Never commit real keys.

### 3. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — pick a lens, drop input, watch it reason.

### 4. Deploy

```bash
vercel deploy
```

Add `MIMO_API_KEY`, `MIMO_API_BASE`, `MIMO_MODEL` as Environment Variables in your Vercel project settings.

## Architecture

```
┌──────────────────────────────────────────────────────────┐
│                    Prism Frontend                         │
│              (Next.js App Router + Vercel)                │
│                                                          │
│  Landing  │  Lens Pages  │  Terminal  │  Workspace       │
│  /plan    │  /build      │  /ship     │  /decide         │
│  /tools/review  │  /tools/brainstorm                    │
└────────────────────────┬─────────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────────┐
│                    API Routes (SSE)                       │
│                                                          │
│  /api/lens/[id]    Lens runner — prompt assembly,        │
│                    input routing, streaming output        │
│  /api/terminal     Direct chat — system prompt,          │
│                    last-20-turns context window           │
│  /api/review       Code review — severity-ranked         │
│                    structured findings                    │
│  /api/brainstorm   Idea generation — 12 ideas across     │
│                    3 categories (bold/practical/wildcard) │
└────────────────────────┬─────────────────────────────────┘
                         │
               ┌─────────▼──────────┐
               │   MiMo V2.5 Pro    │
               │   (api-key auth)   │
               │   streaming SSE    │
               └────────────────────┘
```

### Project structure

```
src/
├── app/
│   ├── api/
│   │   ├── lens/[id]/route.ts    # Lens-specific SSE endpoint
│   │   ├── terminal/route.ts     # Direct chat SSE endpoint
│   │   ├── review/route.ts       # Code review SSE endpoint
│   │   └── brainstorm/route.ts   # Brainstorm SSE endpoint
│   ├── lens/[id]/page.tsx        # Dynamic lens runner page
│   ├── plan/page.tsx             # Plan category
│   ├── build/page.tsx            # Build category
│   ├── ship/page.tsx             # Ship category
│   ├── decide/page.tsx           # Decide category
│   ├── lenses/page.tsx           # Browse all lenses
│   ├── terminal/page.tsx         # AI terminal chat
│   ├── workspace/page.tsx        # Multi-lens workspace
│   ├── tools/
│   │   ├── review/page.tsx       # Code review tool
│   │   └── brainstorm/page.tsx   # Brainstorm board
│   ├── about/page.tsx
│   ├── faq/page.tsx
│   ├── page.tsx                  # Landing
│   └── layout.tsx                # Root + fonts + toaster
├── components/
│   ├── prism-logo.tsx            # Animated SVG prism
│   ├── lens-card.tsx             # Lens grid card
│   ├── lens-runner.tsx           # Two-panel input/output runner
│   ├── lens-icon.tsx             # Lucide icon resolver for lenses
│   ├── lenses-browser.tsx        # Search + filter + grouped grid
│   └── page-shell.tsx            # Layout shell with sidebar nav
└── lib/
    ├── lenses.ts                 # Lens catalog + system prompts
    ├── mimo.ts                   # MiMo streaming client (api-key auth)
    └── utils.ts                  # cn() helper
```

## Design Philosophy

- **Dark, calm, professional** — built for builders, not consumers
- **Spectrum accent** — single visual motif carried across logo, headings, lens accents
- **Reasoning is the demo** — streaming thinking panel makes model depth tangible
- **No signup friction** — open any page, pick a lens, drop input, ship
- **No emojis in UI** — clean iconography via Lucide React
- **Structured outputs, not blobs** — every lens returns a ready-to-use artifact

## Contributing

This is currently a focused project. Feedback and bug reports are welcome via [Issues](https://github.com/XinnBlueBird/prism/issues).

## License

MIT — see [LICENSE](LICENSE).

## Acknowledgements

- [MiMo Open Platform](https://platform.xiaomimimo.com) for the reasoning engine
- [shadcn](https://ui.shadcn.com) for design inspiration
- The open-source maintainers behind Next.js, Tailwind, Framer Motion, Lucide, and Sonner

---

<div align="center">

**Built for builders. Ship everything.**

</div>

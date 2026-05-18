import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "About · Prism",
  description:
    "Prism is a reasoning canvas built on MiMo V2.5 Pro — the philosophy, the architecture, and what's coming next.",
};

export default function AboutPage() {
  return (
    <PageShell active="/about">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
          About Prism
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          A reasoning canvas, not a chat box.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/65">
          Most AI products today look the same — a text input, a reply bubble,
          a stop button. Powerful models reduced to chat. Prism is a deliberate
          attempt to design AI surfaces around <em>how</em> we actually think:
          structured, multi-step, with different shapes for different jobs.
        </p>

        <div className="mt-12 space-y-12">
          <Section
            kicker="Philosophy"
            title="Reasoning has shape"
          >
            <p>
              An on-chain investigation looks nothing like a refactor plan. A
              recursive task tree looks nothing like a paper review. Yet most AI
              tools collapse all of these into the same chat shape — leaving the
              user to do the structural work themselves.
            </p>
            <p>
              Prism gives reasoning the surface it deserves. Each <strong>lens</strong> is
              a cognitive frame — a system prompt + output schema + dedicated UI
              — purpose-built for one kind of thinking. The same MiMo V2.5 Pro
              engine produces ten different shapes of insight, depending on which
              lens you pick.
            </p>
          </Section>

          <Section kicker="Surfaces" title="Three ways in">
            <p>
              <strong>Lenses</strong> are for structure: drop input, pick a
              frame, get a structured output you can copy and ship.{" "}
              <strong>Terminal</strong> is for speed: a focused console for
              direct conversation when a lens would be overkill.{" "}
              <strong>Studio</strong> is for media: paste a YouTube, Spotify,
              SoundCloud, or TikTok link — preview inline, save audio or video.
            </p>
            <p>
              Three surfaces, one engine, zero context switches. They all live
              under the same roof because the same model powers them, even
              though the gestures are different.
            </p>
          </Section>

          <Section kicker="Engine" title="Why MiMo V2.5 Pro">
            <p>
              Prism is intentionally built on a model tuned for reasoning rather
              than chat. MiMo V2.5 Pro streams a visible{" "}
              <strong>reasoning trace</strong> before its final answer, which we
              expose in the lens UI as a separate panel. Watching a model think
              isn&apos;t just a demo flourish — it changes what users notice and
              trust about the output.
            </p>
            <p>
              This also means Prism functions as a stress-test of breadth: ten
              very different domains (on-chain analysis, debate synthesis,
              system design, recursive decomposition, dream interpretation)
              passing through one engine.
            </p>
          </Section>

          <Section kicker="Design" title="Calm. Cinematic. Focused.">
            <p>
              The visual language is dark with a thin spectrum accent — the
              prism motif refracting one signal into many. We avoided the tropes
              of generic AI chat UI (gradient blobs, anime mascots, exclamation
              points). Prism is meant to feel like a tool for thinkers, not a
              toy.
            </p>
            <p>
              Typography uses Inter for UI and JetBrains Mono for technical
              surfaces (terminal, code, output). Animations are subtle — no
              motion that doesn&apos;t serve a function.
            </p>
          </Section>

          <Section kicker="Privacy" title="Yours stays yours">
            <p>
              Inputs and outputs are not stored server-side. Prism makes a single
              streaming request to MiMo per submission and forgets it. There is
              no signup, no analytics fingerprinting, no chat history database.
              Local history (when you opt in) lives in your browser only.
            </p>
          </Section>

          <Section kicker="Open" title="Open source">
            <p>
              Prism is open source under the MIT license. The full code, system
              prompts, and architecture are public on{" "}
              <a
                className="underline hover:text-white"
                href="https://github.com/XinnBlueBird/prism"
                target="_blank"
                rel="noreferrer"
              >
                GitHub
              </a>
              . Issues, ideas, and pull requests are welcome.
            </p>
          </Section>

          <Section kicker="Roadmap" title="What's next">
            <ul className="list-disc space-y-2 pl-5">
              <li>Compare mode: run the same input through two lenses side by side.</li>
              <li>Lens chaining: pipe one lens&apos;s output into another.</li>
              <li>Persistent (opt-in) history with vector search.</li>
              <li>Export to Notion, Markdown, JSON, PDF.</li>
              <li>Live RPC integration for Chain Lens (real on-chain grounding).</li>
              <li>API access for embedding Prism reasoning in other apps.</li>
            </ul>
          </Section>
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">
            Ready to try?
          </h3>
          <p className="mt-2 text-white/60">
            Pick a lens, drop input, watch it refract.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href="/lenses"
              className="group flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:-translate-y-0.5"
            >
              Browse lenses
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              href="/faq"
              className="rounded-full border border-white/15 px-5 py-2.5 text-sm text-white/80 hover:border-white/30 hover:text-white transition"
            >
              Read the FAQ
            </Link>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function Section({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-white/40">
        {kicker}
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">{title}</h2>
      <div className="mt-4 space-y-4 text-white/70">{children}</div>
    </div>
  );
}

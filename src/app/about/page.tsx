import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageShell } from "@/components/page-shell";

export const metadata = {
  title: "About · Prism",
  description:
    "Prism is the AI workspace for builders. Philosophy, architecture, and what's coming next.",
};

export default function AboutPage() {
  return (
    <PageShell active="/about">
      <section className="mx-auto max-w-3xl px-6 py-16">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
          About Prism
        </p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
          The AI workspace for builders.
        </h1>
        <p className="mt-6 text-lg leading-relaxed text-white/65">
          Most AI tools are chat boxes. Open input, blob output, you do the
          structural work. Prism is built for a different reality —{" "}
          <strong className="text-white/85">builders ship structured artifacts</strong>:
          PRDs, RFCs, OKRs, ticket lists, decision matrices. Prism gives those
          artifacts a first-class home, with MiMo V2.5 Pro reasoning behind
          every output.
        </p>

        <div className="mt-12 space-y-12">
          <Section kicker="Who it's for" title="Solo founders. Indie hackers. Small teams.">
            <p>
              Prism is built for the people closest to the metal — the ones
              writing the spec and the code, running their own sprint planning,
              deciding their own architecture. Not for enterprises with a PM
              org. Not for chatters who just want a smarter ChatGPT.
            </p>
            <p>
              If you ship product and the bottleneck isn&apos;t typing speed but{" "}
              <em>structuring your thinking fast enough</em>, Prism is for you.
            </p>
          </Section>

          <Section kicker="Philosophy" title="Reasoning has shape">
            <p>
              A spec looks nothing like a debug session. An OKR sheet looks
              nothing like a launch thread. Yet most AI tools collapse all of
              these into the same chat shape, leaving you to format, structure,
              and re-prompt until you get what you actually need.
            </p>
            <p>
              Prism gives every common builder artifact its own{" "}
              <strong>lens</strong> — a tuned system prompt, an output schema,
              and a dedicated input UI. The same MiMo V2.5 Pro engine produces
              fifteen different shapes of structured output, depending on which
              lens you pick.
            </p>
          </Section>

          <Section kicker="Workflow stages" title="Plan · Build · Ship · Decide">
            <p>
              Lenses are organized around the four stages of any builder loop:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Plan</strong> — Spec, Task, Roadmap, OKR. Turn vague
                ideas into actionable artifacts.
              </li>
              <li>
                <strong>Build</strong> — RFC, Legacy, Bug, Review. Reason
                through code and architecture.
              </li>
              <li>
                <strong>Ship</strong> — Story, Changelog, Launch. Convert work
                into stories, releases, and launch threads.
              </li>
              <li>
                <strong>Decide</strong> — Debate, Pivot, Premortem, Tradeoff.
                Stress-test decisions before you commit.
              </li>
            </ul>
          </Section>

          <Section kicker="Engine" title="Why MiMo V2.5 Pro">
            <p>
              Prism is intentionally built on a model tuned for reasoning rather
              than chat. MiMo V2.5 Pro streams a visible{" "}
              <strong>reasoning trace</strong> before its final answer — we
              expose this trace in the lens UI as a separate panel.
            </p>
            <p>
              For builders, this matters. Watching the model reason about
              trade-offs before producing the spec is the difference between
              trusting the output and re-doing the work.
            </p>
          </Section>

          <Section kicker="Design" title="Calm. Cinematic. Focused.">
            <p>
              Dark interface, thin spectrum accent, restrained motion. The
              prism motif refracts one signal into many — it&apos;s the visual
              language of what the product does.
            </p>
            <p>
              Inter for UI, JetBrains Mono for technical surfaces. No mascots,
              no exclamation points, no &quot;Hey there!&quot; greetings. A tool
              for thinkers, not a toy.
            </p>
          </Section>

          <Section kicker="Privacy" title="Yours stays yours">
            <p>
              Inputs and outputs are not stored server-side. Prism makes a
              single streaming request to MiMo per submission and forgets it.
              No signup, no analytics fingerprinting, no chat history database.
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
              . Issues and pull requests welcome.
            </p>
          </Section>

          <Section kicker="Roadmap" title="What's coming">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <strong>Lens chaining</strong> — pipe Spec Lens output directly
                into Story Lens, then into Launch Lens.
              </li>
              <li>
                <strong>Workspaces</strong> — opt-in persistent project context
                across lens runs.
              </li>
              <li>
                <strong>Compare mode</strong> — same input through two lenses,
                side by side.
              </li>
              <li>
                <strong>Export</strong> — Notion, Markdown, JSON, GitHub Issues
                bulk import.
              </li>
              <li>
                <strong>API access</strong> — embed Prism reasoning in your own
                product.
              </li>
              <li>
                <strong>Team mode</strong> — share lens runs with your
                co-builder.
              </li>
            </ul>
          </Section>
        </div>

        <div className="mt-16 rounded-3xl border border-white/10 bg-white/[0.02] p-8 text-center">
          <h3 className="text-2xl font-semibold tracking-tight">
            Ready to ship faster?
          </h3>
          <p className="mt-2 text-white/60">
            Pick a lens, drop input, paste the output into your repo.
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

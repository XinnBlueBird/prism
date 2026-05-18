"use client";

import { useState } from "react";
import {
  Music,
  Video,
  AlertTriangle,
  Link as LinkIcon,
  ExternalLink,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PageShell } from "@/components/page-shell";

type Platform = "youtube" | "spotify" | "soundcloud" | "twitter" | null;

export default function StudioPage() {
  const [url, setUrl] = useState("");

  const youtubeId = (() => {
    if (!url) return null;
    const m = url.match(/(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/);
    return m?.[1] ?? null;
  })();

  const spotifyEmbed = (() => {
    if (!url) return null;
    const m = url.match(
      /open\.spotify\.com\/(track|album|playlist|episode|show)\/([A-Za-z0-9]+)/,
    );
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
  })();

  const soundcloudEmbed = (() => {
    if (!url || !/soundcloud\.com\//.test(url)) return null;
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23a78bfa&auto_play=false`;
  })();

  const platform: Platform = youtubeId
    ? "youtube"
    : spotifyEmbed
      ? "spotify"
      : soundcloudEmbed
        ? "soundcloud"
        : url && /twitter\.com|x\.com/.test(url)
          ? "twitter"
          : null;

  const downloadHelpers: Record<string, { label: string; href: string }> = {
    youtube: {
      label: "Save with yt-dlp / yt1s.com",
      href: `https://yt1s.com/en/youtube-to-mp3?q=${encodeURIComponent(url)}`,
    },
    spotify: {
      label: "Open on Spotify",
      href: url,
    },
    soundcloud: {
      label: "Save via Klickaud",
      href: `https://klickaud.net/?url=${encodeURIComponent(url)}`,
    },
    twitter: {
      label: "Open on X",
      href: url,
    },
  };

  return (
    <PageShell active="/studio">
      <section className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            Prism Studio
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Stream <span className="spectrum-text">media</span>
          </h1>
          <p className="mt-3 max-w-xl text-white/60">
            Drop a YouTube, Spotify, SoundCloud, or X link. Preview it inline
            with the official player. Use the download helper below to save it
            from the source platform.
          </p>
        </div>

        {/* URL input */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 focus-within:border-white/30">
            <LinkIcon className="h-4 w-4 text-white/40" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://youtube.com/watch?v=… or open.spotify.com/track/…"
              className="flex-1 bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
            {url && (
              <button
                onClick={() => setUrl("")}
                className="text-xs text-white/40 hover:text-white"
              >
                clear
              </button>
            )}
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <PlatformBadge active={platform === "youtube"} icon={Video}>
              YouTube
            </PlatformBadge>
            <PlatformBadge active={platform === "spotify"} icon={Music}>
              Spotify
            </PlatformBadge>
            <PlatformBadge active={platform === "soundcloud"} icon={Music}>
              SoundCloud
            </PlatformBadge>
            <PlatformBadge active={platform === "twitter"} icon={Video}>
              X / Twitter
            </PlatformBadge>
          </div>
        </div>

        {/* Inline player */}
        <AnimatePresence>
          {platform && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-black/40"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
                  Inline player
                </span>
              </div>
              {platform === "youtube" && youtubeId && (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeId}`}
                    title="YouTube"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}
              {platform === "spotify" && spotifyEmbed && (
                <iframe
                  src={spotifyEmbed}
                  width="100%"
                  height="232"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="block"
                  title="Spotify"
                />
              )}
              {platform === "soundcloud" && soundcloudEmbed && (
                <iframe
                  src={soundcloudEmbed}
                  width="100%"
                  height="166"
                  allow="autoplay"
                  className="block"
                  title="SoundCloud"
                />
              )}
              {platform === "twitter" && (
                <div className="p-6 text-center text-sm text-white/60">
                  X embed isn&apos;t available inline.{" "}
                  <a
                    href={url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-white underline"
                  >
                    Open on X →
                  </a>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Download helper */}
        <AnimatePresence>
          {platform && downloadHelpers[platform] && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5"
            >
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Want to save it locally?
                </h3>
                <p className="mt-1 text-xs text-white/50">
                  We don&apos;t host or redistribute media. The button below
                  opens a third-party download helper for this platform.
                </p>
              </div>
              <a
                href={downloadHelpers[platform].href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:-translate-y-0.5 hover:bg-white/90 transition"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {downloadHelpers[platform].label}
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state hint */}
        {!url && (
          <div className="mt-8 rounded-2xl border border-white/5 bg-white/[0.015] p-8 text-center text-sm text-white/40">
            <Music className="mx-auto h-6 w-6 text-white/30" />
            <p className="mt-3">
              Paste a link above to start. Try YouTube, Spotify, or SoundCloud.
            </p>
          </div>
        )}
        {url && !platform && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-medium">Unrecognized link</div>
              <div className="mt-1 text-amber-100/70">
                Paste a YouTube, Spotify, SoundCloud, or X link.
              </div>
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <div className="mt-12 rounded-2xl border border-white/5 bg-white/[0.015] p-5 text-xs leading-relaxed text-white/45">
          <strong className="text-white/70">Heads up.</strong> Prism Studio
          does not host, cache, or redistribute media. We embed each
          platform&apos;s official player and link to third-party download
          helpers. You are responsible for respecting copyright and the
          platform&apos;s terms of service in your jurisdiction.
        </div>
      </section>
    </PageShell>
  );
}

function PlatformBadge({
  active,
  icon: Icon,
  children,
}: {
  active: boolean;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <span
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] transition ${
        active
          ? "border-emerald-400/40 bg-emerald-400/10 text-emerald-200"
          : "border-white/10 bg-white/[0.02] text-white/40"
      }`}
    >
      <Icon className="h-3 w-3" />
      {children}
    </span>
  );
}

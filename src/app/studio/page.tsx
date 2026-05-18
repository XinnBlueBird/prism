"use client";

import { useState } from "react";
import {
  Music,
  Video,
  Loader2,
  Download,
  Play,
  AlertTriangle,
  Link as LinkIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { PageShell } from "@/components/page-shell";

type Resolved = {
  mediaUrl: string;
  filename: string | null;
  mode: "audio" | "video";
};

export default function StudioPage() {
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"audio" | "video">("audio");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Resolved | null>(null);

  const youtubeEmbedId = (() => {
    if (!url) return null;
    const m = url.match(
      /(?:youtu\.be\/|v=|\/embed\/|\/shorts\/)([\w-]{11})/,
    );
    return m?.[1] ?? null;
  })();

  const spotifyEmbed = (() => {
    if (!url) return null;
    const m = url.match(
      /open\.spotify\.com\/(track|album|playlist|episode)\/([A-Za-z0-9]+)/,
    );
    return m ? `https://open.spotify.com/embed/${m[1]}/${m[2]}` : null;
  })();

  const soundcloudEmbed = (() => {
    if (!url) return null;
    if (!/soundcloud\.com\//.test(url)) return null;
    return `https://w.soundcloud.com/player/?url=${encodeURIComponent(url)}&color=%23a78bfa&auto_play=false`;
  })();

  async function resolve() {
    if (!url.trim() || busy) return;
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const r = await fetch("/api/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim(), mode }),
      });
      const data = await r.json();
      if (!r.ok || data.error) {
        throw new Error(data.error || `HTTP ${r.status}`);
      }
      if (data.status === "ok") {
        setResult({
          mediaUrl: data.mediaUrl,
          filename: data.filename,
          mode,
        });
        toast.success("Ready to stream / download");
      } else if (data.status === "picker") {
        // Pick the first item for simplicity
        const first = data.items?.[0];
        if (first) {
          setResult({ mediaUrl: first.url, filename: null, mode });
          toast.success("Picked first available item");
        } else {
          throw new Error("No items returned");
        }
      } else {
        throw new Error("Unexpected response");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setError(msg);
      toast.error(msg);
    } finally {
      setBusy(false);
    }
  }

  return (
    <PageShell active="/studio">
      <div className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-10">
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-white/40">
            Prism Studio
          </p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Stream & download <span className="spectrum-text">media</span>
          </h1>
          <p className="mt-3 max-w-xl text-white/60">
            Drop a YouTube, Spotify, SoundCloud, TikTok, or Twitter link. Preview
            it inline, then save audio (MP3) or video (MP4) to your device.
          </p>
        </div>

        {/* URL form */}
        <div className="rounded-2xl border border-white/8 bg-white/[0.02] p-5 backdrop-blur">
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/30 px-3 py-2 focus-within:border-white/30">
            <LinkIcon className="h-4 w-4 text-white/40" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") resolve();
              }}
              placeholder="https://youtube.com/watch?v=… or open.spotify.com/track/…"
              className="flex-1 bg-transparent py-1.5 text-sm text-white placeholder:text-white/30 focus:outline-none"
            />
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-1 rounded-full border border-white/10 bg-white/5 p-1">
              <button
                onClick={() => setMode("audio")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === "audio"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Music className="h-3 w-3" />
                Audio (MP3)
              </button>
              <button
                onClick={() => setMode("video")}
                className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  mode === "video"
                    ? "bg-white text-black"
                    : "text-white/60 hover:text-white"
                }`}
              >
                <Video className="h-3 w-3" />
                Video (MP4)
              </button>
            </div>

            <button
              onClick={resolve}
              disabled={!url.trim() || busy}
              className="flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-medium text-black transition hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {busy ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Resolving…
                </>
              ) : (
                <>
                  <Play className="h-3.5 w-3.5" />
                  Resolve
                </>
              )}
            </button>
          </div>
        </div>

        {/* Inline preview (no resolve needed) */}
        <AnimatePresence>
          {(youtubeEmbedId || spotifyEmbed || soundcloudEmbed) && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mt-6 overflow-hidden rounded-2xl border border-white/8 bg-black/40"
            >
              <div className="flex items-center justify-between border-b border-white/5 px-4 py-2.5">
                <span className="font-mono text-[11px] uppercase tracking-wider text-white/40">
                  Inline preview
                </span>
              </div>
              {youtubeEmbedId && (
                <div className="aspect-video">
                  <iframe
                    src={`https://www.youtube.com/embed/${youtubeEmbedId}`}
                    title="YouTube preview"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="h-full w-full"
                  />
                </div>
              )}
              {spotifyEmbed && (
                <iframe
                  src={spotifyEmbed}
                  width="100%"
                  height="232"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  className="block"
                  title="Spotify preview"
                />
              )}
              {soundcloudEmbed && (
                <iframe
                  src={soundcloudEmbed}
                  width="100%"
                  height="166"
                  allow="autoplay"
                  className="block"
                  title="SoundCloud preview"
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        {error && (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            <div>
              <div className="font-medium">Direct download unavailable</div>
              <div className="mt-1 text-amber-100/80">{error}</div>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block rounded-full border border-amber-300/30 px-3 py-1 text-xs text-amber-100 hover:border-amber-300/60"
              >
                Open original link ↗
              </a>
            </div>
          </div>
        )}

        {/* Resolved download / play */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.04] p-5"
            >
              <div className="flex items-center gap-2 text-sm text-emerald-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                Ready · {result.mode === "audio" ? "MP3" : "MP4"}
              </div>

              {result.mode === "audio" ? (
                <audio
                  src={result.mediaUrl}
                  controls
                  className="mt-4 w-full"
                />
              ) : (
                <video
                  src={result.mediaUrl}
                  controls
                  className="mt-4 max-h-[60vh] w-full rounded-lg"
                />
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <a
                  href={result.mediaUrl}
                  download={result.filename ?? undefined}
                  className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-black hover:-translate-y-0.5 hover:bg-white/90 transition"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download {result.mode === "audio" ? "MP3" : "MP4"}
                </a>
                <a
                  href={result.mediaUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/70 hover:border-white/30 hover:text-white transition"
                >
                  Open raw URL
                </a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <div className="mt-10 rounded-2xl border border-white/5 bg-white/[0.015] p-5 text-xs leading-relaxed text-white/45">
          <p>
            <strong className="text-white/70">Heads up.</strong> Prism Studio
            uses <a className="underline hover:text-white" href="https://github.com/imputnet/cobalt" target="_blank" rel="noreferrer">cobalt.tools</a>,
            an open-source media resolver, to fetch streams. Prism does not host
            or redistribute media. You are responsible for respecting the
            copyright and terms of service that apply to your use in your
            jurisdiction.
          </p>
        </div>
      </div>
    </PageShell>
  );
}

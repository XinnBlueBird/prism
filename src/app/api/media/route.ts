import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Media resolver via cobalt.tools public API.
 * Resolves YouTube / Spotify / SoundCloud / TikTok / Twitter / etc. URLs
 * into a streamable + downloadable media URL.
 *
 * cobalt.tools is open-source (github.com/imputnet/cobalt) and respects
 * platform ToS — it only resolves what users already have access to.
 *
 * Users are responsible for respecting copyright in their jurisdiction.
 */

type CobaltResponse =
  | { status: "tunnel" | "redirect"; url: string; filename?: string }
  | { status: "picker"; picker: Array<{ url: string; type: string }> }
  | { status: "error"; error: { code: string; context?: unknown } };

const ENDPOINTS = [
  "https://api.cobalt.tools",
  "https://co.eepy.today",
  "https://cobalt-api.kwiatekmiki.com",
];

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => null);
  const url = body?.url;
  const mode = (body?.mode as "audio" | "video") ?? "audio";

  if (!url || typeof url !== "string") {
    return Response.json({ error: "Missing url" }, { status: 400 });
  }
  if (!/^https?:\/\//.test(url)) {
    return Response.json({ error: "Invalid URL" }, { status: 400 });
  }

  const payload = {
    url,
    downloadMode: mode === "audio" ? "audio" : "auto",
    audioFormat: "mp3",
    videoQuality: "720",
    filenameStyle: "basic",
  };

  let lastError = "All resolver endpoints failed";

  for (const base of ENDPOINTS) {
    try {
      const r = await fetch(`${base}/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Prism/0.1 (https://github.com/XinnBlueBird/prism)",
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(15_000),
      });
      const data = (await r.json().catch(() => null)) as CobaltResponse | null;
      if (!data) {
        lastError = `${base}: invalid JSON`;
        continue;
      }
      if (data.status === "error") {
        lastError = `${base}: ${data.error?.code ?? "unknown"}`;
        continue;
      }
      if (data.status === "tunnel" || data.status === "redirect") {
        return Response.json({
          status: "ok",
          mediaUrl: data.url,
          filename: data.filename ?? null,
          mode,
          source: base,
        });
      }
      if (data.status === "picker") {
        return Response.json({
          status: "picker",
          items: data.picker,
          mode,
          source: base,
        });
      }
      lastError = `${base}: unexpected status`;
    } catch (err) {
      lastError = `${base}: ${err instanceof Error ? err.message : "fetch failed"}`;
      continue;
    }
  }

  return Response.json({ error: lastError }, { status: 502 });
}

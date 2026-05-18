import { NextRequest } from "next/server";

export const runtime = "nodejs";
export const maxDuration = 30;

/**
 * Media resolver — tries multiple public cobalt-compatible endpoints
 * with both legacy and v10 payload shapes. Returns helpful error if
 * all fail so the UI can fall back to inline-embed-only mode.
 */

type CobaltOk =
  | { status: "tunnel" | "redirect"; url: string; filename?: string }
  | { status: "stream"; url: string; filename?: string }
  | { status: "picker"; picker: Array<{ url: string; type: string }> };

type CobaltErr = { status: "error"; error?: { code?: string } };

const ENDPOINTS = [
  { base: "https://dl01.yt-dl.click/api/json", shape: "legacy" as const },
  { base: "https://co.wuk.sh/api/json", shape: "legacy" as const },
  { base: "https://api.cobalt.tools/", shape: "v10" as const },
];

function buildPayload(
  url: string,
  mode: "audio" | "video",
  shape: "legacy" | "v10",
) {
  if (shape === "legacy") {
    return {
      url,
      isAudioOnly: mode === "audio",
      aFormat: "mp3",
      vQuality: "720",
      filenamePattern: "basic",
    };
  }
  return {
    url,
    downloadMode: mode === "audio" ? "audio" : "auto",
    audioFormat: "mp3",
    videoQuality: "720",
    filenameStyle: "basic",
  };
}

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

  const attempts: string[] = [];

  for (const { base, shape } of ENDPOINTS) {
    try {
      const r = await fetch(base, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "User-Agent": "Prism/0.1 (https://github.com/XinnBlueBird/prism)",
        },
        body: JSON.stringify(buildPayload(url, mode, shape)),
        signal: AbortSignal.timeout(15_000),
      });
      const data = (await r.json().catch(() => null)) as
        | CobaltOk
        | CobaltErr
        | null;
      if (!data || (data as CobaltErr).status === "error") {
        const code = (data as CobaltErr)?.error?.code ?? `http_${r.status}`;
        attempts.push(`${base}: ${code}`);
        continue;
      }
      const ok = data as CobaltOk;
      if (ok.status === "tunnel" || ok.status === "redirect" || ok.status === "stream") {
        return Response.json({
          status: "ok",
          mediaUrl: ok.url,
          filename: ok.filename ?? null,
          mode,
        });
      }
      if (ok.status === "picker") {
        const first = ok.picker?.[0];
        if (first?.url) {
          return Response.json({
            status: "ok",
            mediaUrl: first.url,
            filename: null,
            mode,
          });
        }
      }
      attempts.push(`${base}: empty`);
    } catch (err) {
      attempts.push(
        `${base}: ${err instanceof Error ? err.message.slice(0, 60) : "fetch failed"}`,
      );
    }
  }

  return Response.json(
    {
      error:
        "All public media resolvers are currently unavailable. Use the inline preview player above, or open the original link to download from the source platform.",
      attempts,
    },
    { status: 503 },
  );
}

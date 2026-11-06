/**
 * First-party, cookieless event endpoint for tool usage statistics.
 * Stores nothing itself: each valid event is written as one JSON log line
 * (`{"type":"tool_event",…}`) to the server log – no IP address, no user agent.
 * Optionally forwards the event server-side to Plausible (EU, cookieless) when
 * PLAUSIBLE_DOMAIN is set; the visitor's IP is not passed on.
 */
import { LIVE_TOOLS } from "@/lib/tools";

const EVENTS = new Set(["upload", "download", "error"]);
const PATHS = new Set(["/", ...LIVE_TOOLS.map((t) => t.path)]);
const FORMATS = new Set(["jpeg", "png", "webp", "gif", "zip"]);
const KINDS = new Set(["single", "zip", "clipboard"]);
const CODES = /^[a-z_]{1,32}$/;

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    const text = await req.text();
    if (text.length > 512) return new Response(null, { status: 413 });
    data = JSON.parse(text);
  } catch {
    return new Response(null, { status: 400 });
  }

  const event = String(data.e ?? "");
  const path = String(data.p ?? "");
  if (!EVENTS.has(event) || !PATHS.has(path)) return new Response(null, { status: 400 });

  const props: Record<string, string | number> = {};
  const count = Number(data.count);
  if (Number.isInteger(count) && count > 0 && count <= 500) props.count = count;
  if (typeof data.format === "string" && FORMATS.has(data.format)) props.format = data.format;
  if (typeof data.kind === "string" && KINDS.has(data.kind)) props.kind = data.kind;
  if (typeof data.code === "string" && CODES.test(data.code)) props.code = data.code;

  console.log(JSON.stringify({ type: "tool_event", ts: new Date().toISOString(), event, path, ...props }));

  const domain = process.env.PLAUSIBLE_DOMAIN;
  if (domain) {
    const base = (process.env.PLAUSIBLE_HOST ?? "https://plausible.io").replace(/\/$/, "");
    fetch(`${base}/api/event`, {
      method: "POST",
      headers: { "content-type": "application/json", "user-agent": "FotoWerkzeuge-Events/1.0" },
      body: JSON.stringify({ name: `tool_${event}`, url: `https://${domain}${path}`, domain, props }),
    }).catch(() => {});
  }

  return new Response(null, { status: 204, headers: { "cache-control": "no-store" } });
}

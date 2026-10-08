// Server only: never import this from a "use client" module.

export type AvaRequest = {
  message: string;
  chatId: string;
  uid: string;
  messageId: string;
};

export type AvaResult =
  | { ok: true; reply: string; name?: string }
  | { ok: false; code: string };

// Keep in sync with lib/chat-actions.ts and firestore.rules
export const REPLY_FAILED = "Failed to get a response. Please try again.";

const DEADLINE_MS = 55_000; // must stay below the route's maxDuration
const MAX_ATTEMPTS = 3;
const RETRYABLE_STATUS = new Set([429, 502, 503, 504]);
const BREAKER_THRESHOLD = 5;
const BREAKER_COOLDOWN_MS = 30_000;

// Best effort: state lives per server instance
let consecutiveFailures = 0;
let breakerOpenUntil = 0;

/**
 * Accepts { reply }, { message } or a plain-text body, optionally wrapped in an array.
 * Only called for 2xx responses, so n8n error bodies never become replies.
 */
function parseReply(text: string): { reply: string; name?: string } | null {
  let data: unknown = text;
  try {
    data = JSON.parse(text);
  } catch {
    // plain-text body
  }

  const payload = (Array.isArray(data) ? data[0] : data) as
    | { reply?: unknown; message?: unknown; name?: unknown }
    | string
    | null;

  const reply =
    typeof payload === "string"
      ? payload
      : typeof payload?.reply === "string"
        ? payload.reply
        : typeof payload?.message === "string"
          ? payload.message
          : "";

  if (!reply.trim()) return null;

  const rawName = typeof payload === "object" ? payload?.name : undefined;
  const name =
    typeof rawName === "string" && rawName.trim() && rawName.length <= 80
      ? rawName.trim()
      : undefined;

  return { reply, name };
}

function fail(code: string): AvaResult {
  consecutiveFailures++;
  if (consecutiveFailures >= BREAKER_THRESHOLD) {
    breakerOpenUntil = Date.now() + BREAKER_COOLDOWN_MS;
    consecutiveFailures = 0;
  }
  return { ok: false, code };
}

export async function callAva(body: AvaRequest): Promise<AvaResult> {
  const url = process.env.N8N_WEBHOOK_URL;
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (!url || !secret) return { ok: false, code: "misconfigured" };

  if (Date.now() < breakerOpenUntil) return { ok: false, code: "circuit_open" };

  const start = Date.now();

  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    const remaining = DEADLINE_MS - (Date.now() - start);
    if (remaining < 2_000) break;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-ava-secret": secret,
          "idempotency-key": body.messageId,
        },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(remaining),
      });

      if (res.ok) {
        const parsed = parseReply(await res.text());
        if (!parsed) return fail("bad_schema"); // a malformed 200 won't fix itself on retry

        consecutiveFailures = 0;
        return { ok: true, ...parsed };
      }

      if (!RETRYABLE_STATUS.has(res.status)) return fail(`http_${res.status}`);
    } catch (err) {
      // A timeout already used the whole budget; retrying an LLM call would double cost and latency
      if ((err as Error)?.name === "TimeoutError") return fail("timeout");
      // network error: retry
    }

    if (attempt < MAX_ATTEMPTS - 1) {
      const backoff = 2 ** attempt * 400 + Math.random() * 200; // ~400ms, ~800ms
      await new Promise((r) => setTimeout(r, backoff));
    }
  }

  return fail("upstream_unavailable");
}

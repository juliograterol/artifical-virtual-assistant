import { timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { parseReply, type AvaResult } from "@/lib/n8n";
import { storeReply } from "@/lib/store-reply";

export const runtime = "nodejs";

// Firestore auto-IDs; also blocks path tricks like "a/b"
const ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

function hasValidSecret(req: NextRequest) {
  const expected = process.env.N8N_WEBHOOK_SECRET;
  const given = req.headers.get("x-ava-secret") ?? "";
  if (!expected) return false;

  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/**
 * Called by the n8n AVA workflow when a reply is ready, including replies that
 * finish after /api/chat/send stopped waiting (e.g. multi-minute lead scrapes).
 * Body: { chatId, messageId, reply, name? } or { chatId, messageId, error }.
 */
export async function POST(req: NextRequest) {
  if (!hasValidSecret(req)) {
    return NextResponse.json({ error: { code: "unauthorized" } }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const { chatId, messageId, error } = body ?? {};

  if (
    typeof chatId !== "string" ||
    typeof messageId !== "string" ||
    !ID_PATTERN.test(chatId) ||
    !ID_PATTERN.test(messageId)
  ) {
    return NextResponse.json({ error: { code: "bad_request" } }, { status: 400 });
  }

  const parsed = error ? null : parseReply(JSON.stringify(body));
  const result: AvaResult = parsed
    ? { ok: true, ...parsed }
    : { ok: false, code: String(error || "bad_schema").slice(0, 64) };

  const outcome = await storeReply(chatId, messageId, result);

  if (outcome === "not_found") {
    return NextResponse.json({ error: { code: "not_found" } }, { status: 404 });
  }

  return NextResponse.json({ ok: true, outcome });
}

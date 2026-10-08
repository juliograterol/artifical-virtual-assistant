import { NextRequest, NextResponse, after } from "next/server";
import { FieldValue } from "firebase-admin/firestore";

import { adminAuth, adminDb } from "@/lib/firebase-admin";
import { callAva, REPLY_FAILED } from "@/lib/n8n";

export const runtime = "nodejs";
export const maxDuration = 60;

const MAX_MESSAGE_LENGTH = 32_000;
const PREVIEW_LENGTH = 140;

export async function POST(req: NextRequest) {
  // 🔐 Verify Firebase ID token
  const token = req.headers.get("authorization")?.replace(/^Bearer /, "");
  const decoded = token
    ? await adminAuth.verifyIdToken(token).catch(() => null)
    : null;

  if (!decoded) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const uid = decoded.uid;

  const body = await req.json().catch(() => null);
  const { chatId, messageId, message, retry } = body ?? {};

  if (
    typeof chatId !== "string" ||
    typeof messageId !== "string" ||
    typeof message !== "string" ||
    !message.trim() ||
    message.length > MAX_MESSAGE_LENGTH
  ) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const chatRef = adminDb.doc(`chats/${chatId}`);
  const messageRef = chatRef.collection("messages").doc(messageId);

  // 🔒 Claim the placeholder so duplicate requests never call n8n twice
  const claim = await adminDb.runTransaction(async (tx) => {
    const [chat, pending] = await tx.getAll(chatRef, messageRef);

    if (!chat.exists || chat.get("ownerId") !== uid) return 403;
    if (!pending.exists || pending.get("role") !== "agent") return 404;

    const status = pending.get("status");
    const claimable =
      (status === "loading" && !pending.get("claimed")) ||
      (retry === true && status === "error");

    if (!claimable) return 409;

    tx.update(messageRef, { status: "loading", content: "", claimed: true });
    return 202;
  });

  if (claim !== 202) {
    return NextResponse.json({ error: "Not allowed" }, { status: claim });
  }

  // 🔥 Keep working after the response is sent
  after(async () => {
    const result = await callAva({ message, chatId, uid, messageId });

    try {
      await adminDb.runTransaction(async (tx) => {
        const chat = await tx.get(chatRef);

        if (!result.ok) {
          tx.update(messageRef, {
            content: REPLY_FAILED,
            status: "error",
            errorCode: result.code,
          });
          return;
        }

        tx.update(messageRef, {
          content: result.reply,
          status: "sent",
          completedAt: FieldValue.serverTimestamp(),
        });

        tx.update(chatRef, {
          updatedAt: FieldValue.serverTimestamp(),
          lastMessage: {
            role: "agent",
            preview: result.reply.slice(0, PREVIEW_LENGTH),
          },
          // ✅ only auto-name chats the user hasn't named yet
          ...(result.name && chat.get("name") === "New Chat"
            ? { name: result.name }
            : {}),
        });
      });
    } catch (err) {
      console.error("Failed to store AVA reply:", err);

      await messageRef
        .update({ content: REPLY_FAILED, status: "error", errorCode: "store_failed" })
        .catch(() => {});
    }
  });

  return NextResponse.json({ ok: true }, { status: 202 });
}

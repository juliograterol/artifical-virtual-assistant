// Server only: writes AVA's result into the placeholder message.
// Shared by POST /api/chat/send (normal replies) and POST /api/chat/deliver (late replies).

import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "./firebase-admin";
import { REPLY_FAILED, REPLY_STILL_WORKING, type AvaResult } from "./n8n";

const PREVIEW_LENGTH = 140;

export type StoreOutcome = "stored" | "kept_existing" | "not_found";

export async function storeReply(
  chatId: string,
  messageId: string,
  result: AvaResult,
): Promise<StoreOutcome> {
  const chatRef = adminDb.doc(`chats/${chatId}`);
  const messageRef = chatRef.collection("messages").doc(messageId);

  return adminDb.runTransaction(async (tx) => {
    const [chat, message] = await tx.getAll(chatRef, messageRef);

    if (!chat.exists || !message.exists || message.get("role") !== "agent") {
      return "not_found";
    }

    if (!result.ok) {
      // Never replace a reply that already arrived with an error
      if (message.get("status") === "sent") return "kept_existing";

      tx.update(messageRef, {
        content: result.code === "timeout" ? REPLY_STILL_WORKING : REPLY_FAILED,
        status: "error",
        errorCode: result.code,
      });
      return "stored";
    }

    tx.update(messageRef, {
      content: result.reply,
      status: "sent",
      completedAt: FieldValue.serverTimestamp(),
      errorCode: FieldValue.delete(),
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
    return "stored";
  });
}

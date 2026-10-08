"use client";

import { auth, db } from "@/lib/firebase";
import {
  collection,
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch,
  type DocumentReference,
  type WriteBatch,
} from "firebase/firestore";
import type { User } from "firebase/auth";

export type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  status: "loading" | "sent" | "error";
};

// Keep in sync with lib/n8n.ts and firestore.rules
const REPLY_FAILED = "Failed to get a response. Please try again.";
const PREVIEW_LENGTH = 140;

/**
 * Queue the user message + agent placeholder in one batch.
 * Both share the same serverTimestamp, so clientTs breaks the tie.
 */
function queueMessages(
  batch: WriteBatch,
  chatRef: DocumentReference,
  message: string,
) {
  const messages = collection(chatRef, "messages");
  const userRef = doc(messages);
  const pendingRef = doc(messages);
  const now = Date.now();

  batch.set(userRef, {
    role: "user",
    content: message,
    status: "sent",
    sentAt: serverTimestamp(),
    clientTs: now,
  });

  batch.set(pendingRef, {
    role: "agent",
    content: "",
    status: "loading",
    sentAt: serverTimestamp(),
    clientTs: now + 1,
  });

  return pendingRef.id;
}

/**
 * 🔥 Ask the server to fetch AVA's reply (the n8n call runs server-side)
 */
async function requestReply(
  user: User,
  chatId: string,
  messageId: string,
  message: string,
  retry = false,
) {
  try {
    const res = await fetch("/api/chat/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${await user.getIdToken()}`,
      },
      body: JSON.stringify({ chatId, messageId, message, retry }),
    });

    // 409 = already claimed by another request, the reply is on its way
    if (!res.ok && res.status !== 409) throw new Error(`HTTP ${res.status}`);
  } catch (err) {
    console.error("Error requesting response:", err);

    // The server never took the job: don't leave the placeholder loading forever
    await updateDoc(doc(db, `chats/${chatId}/messages/${messageId}`), {
      content: REPLY_FAILED,
      status: "error",
    }).catch(() => {});
  }
}

/**
 * 🚀 Start new chat
 * Returns the id right away so the caller can navigate before the commit;
 * Firestore shows the local writes instantly. `done` settles after the commit.
 */
export function startNewChat(message: string) {
  const user = auth.currentUser;
  if (!user || !message.trim()) return null;

  const chatRef = doc(collection(db, "chats"));
  const batch = writeBatch(db);

  batch.set(chatRef, {
    ownerId: user.uid,
    name: "New Chat",
    type: "private",
    deleted: false,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    lastMessage: { role: "user", preview: message.slice(0, PREVIEW_LENGTH) },
  });

  const pendingId = queueMessages(batch, chatRef, message);

  const done = batch
    .commit()
    .then(() => requestReply(user, chatRef.id, pendingId, message));

  return { chatId: chatRef.id, done };
}

/**
 * 💬 Send message
 */
export async function sendMessageToChat(chatId: string, message: string) {
  const user = auth.currentUser;
  if (!user || !message.trim()) return null;

  const chatRef = doc(db, "chats", chatId);
  const batch = writeBatch(db);

  const pendingId = queueMessages(batch, chatRef, message);

  batch.update(chatRef, {
    updatedAt: serverTimestamp(),
    lastMessage: { role: "user", preview: message.slice(0, PREVIEW_LENGTH) },
  });

  // The server reads the placeholder, so it must be committed first
  await batch.commit();
  await requestReply(user, chatId, pendingId, message);

  return true;
}

/**
 * 🔁 Retry failed message
 */
export async function retryMessage(
  chatId: string,
  messageId: string,
  originalMessage: string,
) {
  const user = auth.currentUser;
  if (!user) return;

  await requestReply(user, chatId, messageId, originalMessage, true);
}

/**
 * 🗑 Delete chat (soft delete)
 */
export async function deleteChat(chatId: string) {
  await updateDoc(doc(db, "chats", chatId), {
    deleted: true,
  });
}

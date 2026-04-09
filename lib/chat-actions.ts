"use client";

import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  addDoc,
  updateDoc,
  serverTimestamp,
  setDoc,
  getDoc,
} from "firebase/firestore";

export type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  status: "loading" | "sent" | "error";
};

const WEBHOOK_URL = "https://n8n.interactiveworkers.com/webhook/AVA";

/**
 * 🔥 Fetch + update message status
 */
async function fetchResponse(
  chatId: string,
  message: string,
  messageRef: ReturnType<typeof doc>,
) {
  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chatId }),
    });

    const text = await res.text();

    let data = null;
    try {
      data = text ? JSON.parse(text) : null;
    } catch {
      console.error("Invalid JSON:", text);
    }

    const payload = Array.isArray(data) ? data[0] : data;

    const reply =
      payload?.reply ||
      payload?.message ||
      (typeof payload === "string" ? payload : "No response received.");

    await updateDoc(messageRef, {
      content: reply,
      status: "sent",
    });

    // ✅ optional: update chat name
    if (payload?.name) {
      const chatRef = doc(db, "chats", chatId);
      const chatSnap = await getDoc(chatRef);

      if (chatSnap.exists()) {
        const currentName = chatSnap.data()?.name;

        if (currentName === "New Chat") {
          await updateDoc(chatRef, {
            name: payload.name,
          });
        }
      }
    }
  } catch (err) {
    console.error("Error fetching response:", err);

    await updateDoc(messageRef, {
      content: "Failed. Tap to retry.",
      status: "error",
    });
  }
}

/**
 * 🚀 Start new chat
 */
export async function startNewChat(message: string) {
  if (!message.trim()) return null;

  // 1. Create chat
  const chatRef = await addDoc(collection(db, "chats"), {
    name: "New Chat",
    createdAt: serverTimestamp(),
    type: "private",
  });

  const chatId = chatRef.id;

  // 2. Add user message
  await addDoc(collection(db, `chats/${chatId}/messages`), {
    role: "user",
    content: message,
    status: "sent",
    sentAt: serverTimestamp(),
  });

  // 3. Create loading agent message
  const pendingRef = doc(collection(db, `chats/${chatId}/messages`));

  await setDoc(pendingRef, {
    role: "agent",
    content: "...",
    status: "loading",
    sentAt: serverTimestamp(),
  });

  // 4. Fetch response
  fetchResponse(chatId, message, pendingRef);

  return chatId;
}

/**
 * 💬 Send message
 */
export async function sendMessageToChat(chatId: string, message: string) {
  if (!message.trim()) return null;

  // 1. User message
  await addDoc(collection(db, `chats/${chatId}/messages`), {
    role: "user",
    content: message,
    status: "sent",
    sentAt: serverTimestamp(),
  });

  // 2. Create loading agent message
  const pendingRef = doc(collection(db, `chats/${chatId}/messages`));

  await setDoc(pendingRef, {
    role: "agent",
    content: "...",
    status: "loading",
    sentAt: serverTimestamp(),
  });

  // 3. Fetch response
  fetchResponse(chatId, message, pendingRef);

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
  const messageRef = doc(db, `chats/${chatId}/messages/${messageId}`);

  await updateDoc(messageRef, {
    content: "...",
    status: "loading",
  });

  fetchResponse(chatId, originalMessage, messageRef);
}

/**
 * 🗑 Delete chat (soft delete)
 */
export async function deleteChat(chatId: string) {
  await updateDoc(doc(db, "chats", chatId), {
    deleted: true,
  });
}

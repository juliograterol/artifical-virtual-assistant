import { getChats, saveChats, addMessage } from "@/lib/chat-storage";

export type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  pending?: boolean;
};

const WEBHOOK_URL = "https://n8n.interactiveworkers.com/webhook/AVA";

/**
 * 🔥 Fetch + replace pending message
 */
async function fetchResponse(
  chatId: string,
  message: string,
  pendingId: string,
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

    const chats = getChats();
    if (!chats[chatId]) return;

    chats[chatId].messages = chats[chatId].messages.map((msg: Message) =>
      msg.id === pendingId
        ? {
            id: pendingId,
            role: "agent",
            content: reply,
          }
        : msg,
    );

    if (payload?.name) {
      chats[chatId].name = payload.name;
    }

    saveChats(chats);
    window.dispatchEvent(new Event("chat-updated"));
  } catch (err) {
    console.error("Error fetching response:", err);

    const chats = getChats();
    if (!chats[chatId]) return;

    chats[chatId].messages = chats[chatId].messages.map((msg: Message) =>
      msg.id === pendingId
        ? {
            id: pendingId,
            role: "agent",
            content: "Something went wrong. Please try again.",
          }
        : msg,
    );

    saveChats(chats);
    window.dispatchEvent(new Event("chat-updated"));
  }
}

/**
 * 🚀 Start new chat
 */
export async function startNewChat(message: string) {
  if (!message.trim()) return null;

  const chats = getChats();
  const chatId = crypto.randomUUID();
  const pendingId = crypto.randomUUID();

  chats[chatId] = {
    id: chatId,
    name: message.slice(0, 40) || "New Chat",
    createdAt: Date.now(),
    // archived: false,
    messages: [
      {
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      },
      {
        id: pendingId,
        role: "agent",
        content: "",
        pending: true,
      },
    ],
  };

  saveChats(chats);
  fetchResponse(chatId, message, pendingId);

  return chatId;
}

/**
 * 💬 Send message
 */
export async function sendMessageToChat(chatId: string, message: string) {
  if (!message.trim()) return null;

  const pendingId = crypto.randomUUID();

  addMessage(chatId, {
    id: crypto.randomUUID(),
    role: "user",
    content: message,
  });

  addMessage(chatId, {
    id: pendingId,
    role: "agent",
    content: "",
    pending: true,
  });

  fetchResponse(chatId, message, pendingId);

  return true;
}

/**
 * 🗑 Delete chat
 */
export function deleteChat(chatId: string) {
  const chats = getChats();
  delete chats[chatId];
  saveChats(chats);
  window.location.reload();
}

import { getChats, saveChats, addMessage } from "@/lib/chat-storage";

export type Message = {
  role: "user" | "agent";
  content: string;
};

const WEBHOOK_URL = "https://n8n.interactiveworkers.com/webhook/AVA";

/**
 * Start a new chat
 */
export async function startNewChat(message: string) {
  if (!message.trim()) return null;

  const chats = getChats();
  const id = crypto.randomUUID();

  const newChat = {
    id,
    name: message.slice(0, 40) || "New Chat",
    createdAt: Date.now(),
    archived: false,
    messages: [
      {
        role: "user" as const,
        content: message,
      },
    ],
  };

  chats[id] = newChat;
  saveChats(chats);

  try {
    const res = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chatId: id }),
    });

    const text = await res.text();

    let data = null;

    try {
      data = text ? JSON.parse(text) : null;
    } catch (e) {
      console.error("Invalid JSON:", text);
    }

    const payload = Array.isArray(data) ? data[0] : data;

    // ✅ Update name if AVA provides one
    const updatedChats = getChats();

    if (updatedChats[id]) {
      if (payload?.name) {
        updatedChats[id].name = payload.name;
      }

      updatedChats[id].messages = [
        ...(updatedChats[id].messages || []),
        {
          role: "agent",
          content: payload?.reply || "No response received.",
        },
      ];

      saveChats(updatedChats);
    }

    // ✅ Save agent response
    chats[id].messages.push({
      role: "agent",
      content: payload?.reply || "No response received.",
    });

    saveChats(chats);
  } catch (err) {
    console.error("Error starting chat:", err);
  }

  return id; // 👈 let caller handle routing
}

/**
 * Send message in existing chat
 */
export async function sendMessageToChat(chatId: string, message: string) {
  if (!message.trim()) return null;

  const userMessage: Message = {
    role: "user",
    content: message,
  };

  // ✅ always write immediately
  addMessage(chatId, userMessage);

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

    const agentMessage: Message = {
      role: "agent",
      content: reply,
    };

    // ✅ ALWAYS re-fetch before modifying
    const chats = getChats();

    if (chats[chatId]) {
      chats[chatId].messages = [
        ...(chats[chatId].messages || []),
        agentMessage,
      ];

      // ✅ update name HERE too
      if (payload?.name) {
        chats[chatId].name = payload.name;
      }

      saveChats(chats);
    }

    return agentMessage;
  } catch (err) {
    console.error("Error sending message:", err);

    const errorMessage: Message = {
      role: "agent",
      content: "Something went wrong. Please try again.",
    };

    addMessage(chatId, errorMessage);

    return errorMessage;
  }
}
/**
 * Delete chat
 */
export function deleteChat(chatId: string) {
  const chats = getChats();

  delete chats[chatId];

  saveChats(chats);
  window.location.reload();
}

/**
 * Archive chat
 */
// export function archiveChat(chatId: string) {
//   const chats = getChats();

//   if (chats[chatId]) {
//     chats[chatId].archived = true;
//     saveChats(chats);
//   }
// }

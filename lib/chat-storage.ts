export type Role = "user" | "agent";

export type Message = {
  id: string;
  role: Role;
  content: string;
  pending?: boolean;
};

export type ChatSession = {
  id: string;
  name: string;
  createdAt: number;
  messages: Message[];
};

const STORAGE_KEY = "ava_chats";

export function getChats(): Record<string, ChatSession> {
  if (typeof window === "undefined") return {};
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : {};
}

export function saveChats(chats: Record<string, ChatSession>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
}

export function getChat(id: string): ChatSession | null {
  const chats = getChats();
  return chats[id] ?? null;
}

export function addMessage(chatId: string, message: Message) {
  const chats = getChats();
  if (!chats[chatId]) return;

  chats[chatId].messages = [...chats[chatId].messages, message];

  saveChats(chats);
  window.dispatchEvent(new Event("chat-updated"));
}

import { db } from "./firebase";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

export type Role = "user" | "agent";

export type Message = {
  id: string;
  role: Role;
  content: string;
  status: "loading" | "sent" | "error";
};

export type ChatSession = {
  id: string;
  createdAt: number;
  messages: Message[];
};

// ✅ Get all chats
export async function getChats() {
  const snap = await getDocs(collection(db, "chats"));

  return snap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
}

// ✅ Get single chat + messages
export async function getChat(chatId: string): Promise<ChatSession | null> {
  const chatRef = doc(db, "chats", chatId);
  const chatSnap = await getDoc(chatRef);

  if (!chatSnap.exists()) return null;

  const messagesQuery = query(
    collection(db, `chats/${chatId}/messages`),
    orderBy("sentAt", "asc"),
  );

  const messagesSnap = await getDocs(messagesQuery);

  const messages: Message[] = messagesSnap.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as any),
  }));

  return {
    id: chatId,
    createdAt: chatSnap.data().createdAt?.toMillis?.() ?? Date.now(),
    messages,
  };
}

// ✅ Add message (generic helper)
export async function addMessage(chatId: string, message: Omit<Message, "id">) {
  const messagesRef = collection(db, `chats/${chatId}/messages`);

  await addDoc(messagesRef, {
    ...message,
    sentAt: serverTimestamp(),
  });
}

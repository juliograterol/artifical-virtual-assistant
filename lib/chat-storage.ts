import { db } from "./firebase";
import { doc, getDoc, updateDoc, Timestamp } from "firebase/firestore";

export type Role = "user" | "agent";

export type Message = {
  id: string;
  role: Role;
  content: string;
  status: "loading" | "sent" | "error";
  sentAt?: Timestamp;
};

// ✅ Get chat metadata only (no messages)
export async function getChat(chatId: string) {
  const chatSnap = await getDoc(doc(db, "chats", chatId));

  if (!chatSnap.exists()) return null;

  return {
    id: chatId,
    name: (chatSnap.data().name as string) ?? "",
  };
}

export async function changeName({
  chatId,
  name,
}: {
  chatId: string;
  name: string;
}) {
  const chatRef = doc(db, "chats", chatId);

  await updateDoc(chatRef, {
    name,
  });
}

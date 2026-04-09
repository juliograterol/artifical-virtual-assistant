"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Chat from "@/component/chat/modal";
import ChatInput from "@/component/chat/chat-input";
import { sendMessageToChat } from "@/lib/chat-actions";
import GlassElement from "@/component/glass-elemet/glass-element";

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";

export type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  status: "loading" | "sent" | "error";
  sentAt?: any;
};

export default function ChatPage() {
  const { id } = useParams();
  const chatId = id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [name, setName] = useState("Chat");

  // 🔥 REAL-TIME MESSAGES (FIXED)
  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("sentAt", "asc"),
    );

    const unsub = onSnapshot(q, (snapshot) => {
      const msgs: Message[] = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          role: data.role === "user" ? "user" : "agent",
          content: data.content ?? "",
          status:
            data.status === "loading" ||
            data.status === "sent" ||
            data.status === "error"
              ? data.status
              : "sent",
          sentAt: data.sentAt ?? null,
        };
      });

      // ✅ force new reference + stable sort fallback
      setMessages([...msgs]);
    });

    return () => unsub();
  }, [chatId]);

  // 🔥 REAL-TIME CHAT NAME (FIXED)
  useEffect(() => {
    if (!chatId) return;

    const unsub = onSnapshot(doc(db, "chats", chatId), (snap) => {
      if (snap.exists()) {
        const chatName = snap.data()?.name || "Chat";

        setName(chatName);
        document.title = `${chatName} | Ava`;
      }
    });

    return () => unsub();
  }, [chatId]);

  // ⚠️ debounce recommended, but keeping simple
  const changeChatName = async (n: string) => {
    setName(n);

    await updateDoc(doc(db, "chats", chatId), {
      name: n,
    });
  };

  const sendMessage = async (message: string) => {
    await sendMessageToChat(chatId, message);
  };

  return (
    <section className="w-full h-screen flex flex-col justify-end items-center pb-4 px-4">
      <GlassElement className="mt-4 absolute top-0 max-md:right-4 z-10 w-full md:max-w-3xl max-w-9/12">
        <h1 className="text-white font-medium w-full flex justify-center">
          <input
            placeholder="Chat Name"
            value={name}
            onChange={(e) => changeChatName(e.target.value)}
            className="px-2 w-full text-center outline-0"
          />
        </h1>
      </GlassElement>

      <Chat.Modal messages={messages} />
      <ChatInput onSend={sendMessage} />
    </section>
  );
}

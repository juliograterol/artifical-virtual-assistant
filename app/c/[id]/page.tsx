"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Chat from "@/component/chat/modal";
import ChatInput from "@/component/chat/chat-input";
import { Message, getChat, getChats, saveChats } from "@/lib/chat-storage";
import { sendMessageToChat } from "@/lib/chat-actions";

export default function ChatPage() {
  const { id } = useParams();
  const chatId = id as string;

  const [messages, setMessages] = useState<Message[]>([]);

  // ✅ Fix old messages without ID (runs once)
  useEffect(() => {
    const chats = getChats();
    let updated = false;

    Object.values(chats).forEach((chat) => {
      chat.messages = chat.messages.map((msg: any) => {
        if (!msg.id) {
          updated = true;
          return { id: crypto.randomUUID(), ...msg };
        }
        return msg;
      });
    });

    if (updated) saveChats(chats);
  }, []);

  // ✅ Set title
  useEffect(() => {
    const chats = getChats();
    const chat = chats[chatId];

    if (chat?.name) {
      document.title = `${chat.name} | Ava`;
    }
  }, [chatId]);

  // ✅ Initial load
  useEffect(() => {
    const chat = getChat(chatId);
    if (chat) {
      setMessages([...chat.messages]);
    }
  }, [chatId]);

  // 🔥 REAL-TIME updates (THIS was missing)
  useEffect(() => {
    const update = () => {
      const chat = getChat(chatId);
      if (chat) {
        setMessages([...chat.messages]);
      }
    };

    window.addEventListener("chat-updated", update);

    return () => {
      window.removeEventListener("chat-updated", update);
    };
  }, [chatId]);

  const sendMessage = async (message: string) => {
    await sendMessageToChat(chatId, message);
  };

  return (
    <section className="w-full h-screen flex flex-col justify-end items-center pb-4 px-4">
      <Chat.Modal messages={messages} />
      <ChatInput onSend={sendMessage} />
    </section>
  );
}

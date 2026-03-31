"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Chat from "@/component/chat/modal";
import ChatInput from "@/component/chat/chat-input";
import {
  Message,
  getChat,
  getChats,
  saveChats,
  updateChatName,
} from "@/lib/chat-storage";
import { sendMessageToChat } from "@/lib/chat-actions";
import GlassElement from "@/component/glass-elemet/glass-element";

export default function ChatPage() {
  const { id } = useParams();
  const chatId = id as string;
  const [name, setName] = useState("chat");

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

  // ✅ Initial load
  useEffect(() => {
    const chat = getChat(chatId);
    if (chat) {
      setMessages([...chat.messages]);

      // set initial title
      if (chat.name) {
        document.title = `${chat.name} | Ava`;
        setName(chat.name);
      }
    }
  }, [chatId]);

  // 🔥 Real-time updates (messages + title)
  useEffect(() => {
    const update = () => {
      const chat = getChat(chatId);
      if (chat) {
        setMessages([...chat.messages]);

        // ✅ keep title in sync with chat name
        if (chat.name) {
          document.title = `${chat.name} | Ava`;
        }
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

  const changeChatName = (n: string) => {
    setName(n);
    updateChatName(chatId, n);
  };

  return (
    <section className="w-full h-screen flex flex-col justify-end items-center pb-4 px-4">
      <GlassElement className="mt-4 absolute top-0 max-md:right-4 z-10 w-full md:max-w-3xl max-w-9/12">
        <h1 className=" text-white font-medium w-full flex justify-center">
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

"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Chat from "@/component/chat/modal";
import ChatInput from "@/component/chat/chat-input";
import { Message, getChat, addMessage } from "@/lib/chat-storage";
import Modal from "@/component/chat/modal";

export default function ChatPage() {
  const { id } = useParams();
  const chatId = id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const chat = getChat(chatId);

    if (chat) {
      setMessages(chat.messages);
    }
  }, [chatId]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    addMessage(chatId, userMessage);

    try {
      setLoading(true);

      const res = await fetch(
        "https://n8n.interactiveworkers.com/webhook/AVA",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            chatId,
            messages,
          }),
        },
      );

      const data = await res.json();

      const reply =
        typeof data === "string"
          ? data
          : data.reply || data.message || "No response received.";

      const agentMessage: Message = {
        role: "agent",
        content: reply,
      };

      setMessages((prev) => [...prev, agentMessage]);
      addMessage(chatId, agentMessage);
    } catch (err) {
      console.error(err);

      const errorMessage: Message = {
        role: "agent",
        content: "Something went wrong. Please try again.",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full h-screen flex flex-col justify-end items-center pb-4 px-4">
      <Chat.Modal messages={messages} />
      <ChatInput onSend={sendMessage} />
    </section>
  );
}

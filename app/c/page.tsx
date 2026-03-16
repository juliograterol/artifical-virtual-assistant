"use client";

import { useState } from "react";
import Chat from "@/component/chat/chat";
import ChatInput from "@/component/chat/chat-input";

type Message = {
  role: "user" | "agent";
  content: string;
};

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = async (message: string, chatId: string) => {
    if (!message.trim()) return;

    setMessages((prev) => [...prev, { role: "user", content: message }]);

    const res = await fetch("https://n8n.interactiveworkers.com/webhook/AVA", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message, chatId }),
    });

    const data = await res.json();

    setMessages((prev) => [...prev, { role: "agent", content: data.reply }]);
  };

  return (
    <section className="w-full h-screen flex flex-col justify-end items-center pb-4 px-4">
      <div className="pb-10 flex flex-col w-full max-w-5xl overflow-y-auto chat-container">
        {messages.map((msg, i) =>
          msg.role === "user" ? (
            <Chat.UserMessage key={i} message={msg.content} />
          ) : (
            <Chat.AgentMessage key={i} message={msg.content} />
          ),
        )}
      </div>

      <ChatInput onSend={sendMessage} />
    </section>
  );
}

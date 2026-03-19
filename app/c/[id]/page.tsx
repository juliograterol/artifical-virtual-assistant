"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Chat from "@/component/chat/modal";
import ChatInput from "@/component/chat/chat-input";
import { Message, getChat, addMessage } from "@/lib/chat-storage";
import { getChats } from "@/lib/chat-storage";
import { sendMessageToChat } from "@/lib/chat-actions";

export default function ChatPage() {
  const { id } = useParams();

  const chatId = id as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const chats = getChats();
    const chat = chats[id as string];

    if (chat?.name) {
      document.title = `${chat.name} | Ava`;
    }
  }, [id]);

  useEffect(() => {
    const chat = getChat(chatId);

    if (chat) {
      setMessages(chat.messages);
    }
  }, [chatId]);

  const sendMessage = async (message: string) => {
    const agentMessage = await sendMessageToChat(chatId, message);

    if (agentMessage) {
      setMessages(getChat(chatId)?.messages || []);
    }
  };

  return (
    <section className="w-full h-screen flex flex-col justify-end items-center pb-4 px-4">
      <Chat.Modal messages={messages} />
      <ChatInput onSend={sendMessage} />
    </section>
  );
}

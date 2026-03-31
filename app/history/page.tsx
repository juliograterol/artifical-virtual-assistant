"use client";

import Link from "next/link";
import GlassElement from "@/component/glass-elemet/glass-element";
import Options from "@/component/options";
import { Chat } from "@/component/sidebar/history";
import { getChat, getChats } from "@/lib/chat-storage";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const storedChats = getChats();

    const list = Object.values(storedChats) as Chat[];

    // Optional: sort newest first
    list.sort((a, b) => b.createdAt - a.createdAt);
    setChats(list);
  }, []);

  return (
    <div className="w-full flex items-center justify-center">
      <section className="w-full md:max-w-8/12 md:p-10 px-4 flex flex-col min-h-screen items-center">
        <header className="w-full">
          <h2 className="text-4xl text-white text-center font-medium mb-4">
            History
          </h2>
        </header>
        <ul className="flex flex-col gap-2 w-full">
          {chats.map((chat) => {
            const conversation = getChat(chat.id);

            return (
              <HistoryItem
                key={chat.id}
                chat={chat}
                conversation={conversation}
              />
            );
          })}
        </ul>
      </section>
    </div>
  );
}

const HistoryItem = ({
  chat,
  conversation,
}: {
  chat: Chat;
  conversation: ReturnType<typeof getChat>;
}) => {
  const { id, name, createdAt } = chat;

  const formatDate = (dateString: number | string) => {
    const d = new Date(dateString);
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    const yy = String(d.getFullYear()).slice(-2);
    const hh = String(d.getHours()).padStart(2, "0");
    const min = String(d.getMinutes()).padStart(2, "0");
    const date = `${mm}/${dd}/${yy}`;
    const hour = `${hh}:${min}`;

    return date + " " + hour;
  };

  return (
    <li className="text-white group/item hover:bg-[#606060]/50 rounded-3xl">
      <GlassElement className="flex h-full">
        <Link href={`c/${chat.id}`} className="cursor-pointer w-full">
          <div className="flex justify-between pb-2 mb-2 border-b border-[#404040] overflow-auto">
            <label>{name}</label>
            <p className="text-[#606060] max-md:text-xs">
              {formatDate(createdAt)}
            </p>
          </div>
          {conversation?.messages?.slice(-2).map((msg, i) => {
            const content = {
              role: msg.role,
              message: msg.content,
              ...(msg.pending !== undefined && { pending: msg.pending }),
            };
            return (
              <p
                key={i}
                className="text-sm text-white opacity-50 line-clamp-1 ml-4 select-none"
              >
                <strong className="font-medium">{content.role}: </strong>
                {content.role === "user"
                  ? content.message
                  : JSON.stringify(content.message)}
              </p>
            );
          })}
        </Link>{" "}
        <Options id={id} />
      </GlassElement>
    </li>
  );
};

"use client";

import Link from "next/link";
import GlassElement from "@/component/glass-elemet/glass-element";
import Options from "@/component/options";
import { Chat } from "@/component/sidebar/history";
import { ChatSession, getChat } from "@/lib/chat-storage";
import { useEffect, useState } from "react";
import { useUserChats } from "@/lib/useUser";
import { useFormatDate } from "@/lib/useFormatDate";

export default function HistoryPage() {
  const { data } = useUserChats();

  const chats = data as Chat[];

  return (
    <div className="w-full flex items-center justify-center">
      <section className="w-full md:p-10 px-4 flex flex-col min-h-screen items-center">
        <header className="w-full">
          <h2 className="text-4xl text-white text-center font-medium mb-4">
            History
          </h2>
        </header>
        <ul className="flex flex-col gap-2 w-full">
          {chats.map((chat) => {
            return <HistoryItem key={chat.id} chat={chat} />;
          })}
        </ul>
      </section>
    </div>
  );
}

const HistoryItem = ({ chat }: { chat: Chat }) => {
  const { id, name, createdAt } = chat;
  const [conversation, setConversation] = useState<ChatSession>();

  useEffect(() => {
    const fetchConversation = async () => {
      try {
        const c = await getChat(chat.id);
        console.log(c);
        if (c) setConversation(c);
      } catch (e) {
        console.log("Error fetching conversation");
      }
    };
    fetchConversation();
  }, []);

  const ItemWrapper = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return (
      <div className="group/item cursor-pointer md:max-w-8/12 w-full text-white hover:bg-[#606060]/50 rounded-xl relative">
        <GlassElement>
          <Link href={href}>{children}</Link>
        </GlassElement>
        <Options id={id} />
      </div>
    );
  };

  return (
    <li className="relative flex w-full justify-center">
      <ItemWrapper href={`c/${chat.id}`}>
        <div className="text-white flex justify-between pb-2 mb-2 border-b border-[#404040] overflow-auto">
          <label className={name ?? "opacity-50"}>
            {name ?? "Untitled Chat"}
          </label>
          <p className="text-[#606060] max-md:text-xs">
            {useFormatDate(createdAt)}
          </p>
        </div>
        {conversation?.messages?.slice(-2).map((msg, i) => {
          const content = {
            role: msg.role,
            message: msg.content,
            ...(msg.status !== undefined && { status: msg.status }),
          };
          return (
            <p
              key={i}
              className="text-sm text-white opacity-50 line-clamp-1 ml-4 select-none"
            >
              <strong className="font-medium">{content.role}: </strong>
              {typeof content.message === "string"
                ? content.message
                : ((content.message as any)?.reply ?? "")}
            </p>
          );
        })}
      </ItemWrapper>
    </li>
  );
};

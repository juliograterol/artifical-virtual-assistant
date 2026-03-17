"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getChats } from "@/lib/chat-storage";
import AVA from "./AVA";
import Options from "./options";

type Chat = {
  id: string;
  name: string;
  createdAt: number;
};

export default function Sidebar() {
  return (
    <aside className="bg-[#282828] w-full h-full max-w-xs shadow-2xl">
      <Link href={"/"} className="w-full flex justify-center py-2">
        <svg
          viewBox="0 -12 316 140"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="px-4 mx-4 border-b border-[#404040] max-w-1/2"
        >
          <path
            d="M87.8583 22.4753L78.4737 3.11199L76.9731 0V22.4679H59.503C38.9644 22.4679 22.3155 39.2455 22.3155 59.9243V71.0342H111.383L87.8583 22.4679V22.4753ZM75.9353 93.5171H22.3155V116H0V59.9318C0 45.7626 4.88267 32.7358 13.0578 22.4753C15.7978 19.0401 18.9036 15.9132 22.3229 13.147C32.5138 4.91601 45.4522 0 59.5104 0H101.797L112.697 22.4679L136.222 71.0342L147.107 93.5021L158 115.985H133.161L122.268 93.5021H75.9428L75.9353 93.5171Z"
            fill="white"
          />

          <path
            d="M204.609 71.0296H293.677V59.9204C293.677 39.2429 277.036 22.4663 256.49 22.4663H239.02V0L237.519 3.11169L228.134 22.4739L204.609 71.0371V71.0296ZM239.02 93.5035H193.732L182.839 115.985H158L168.893 93.5035L179.778 71.0371L203.303 22.4739L214.203 0.00743195H256.49C270.548 0.00743195 283.479 4.92322 293.677 13.1536C297.089 15.9121 300.195 19.0389 302.942 22.4814C311.117 32.7412 316 45.7671 316 59.9355V116H293.685V93.5185H240.065H239.027L239.02 93.5035Z"
            fill="white"
          />
        </svg>
      </Link>
      <History />
    </aside>
  );
}

function History() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    const storedChats = getChats();

    const list = Object.values(storedChats) as Chat[];

    // Optional: sort newest first
    list.sort((a, b) => b.createdAt - a.createdAt);
    console.log(list);
    setChats(list);
  }, []);

  return (
    <ul className="flex flex-col">
      {chats.map((chat) => (
        <li key={chat.id} className="relative hover:bg-[#404040] rounded group">
          <Link className="block w-full px-4 py-2" href={`/c/${chat.id}`}>
            {chat.name || "New Chat"}
          </Link>
          <Options id={chat.id} />
        </li>
      ))}
    </ul>
  );
}

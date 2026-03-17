"use client";

import { useRouter } from "next/navigation";
import ChatInput from "@/component/chat/chat-input";
import Hello from "@/component/hello";
import { startNewChat } from "@/lib/chat-actions";
import { getChats, saveChats } from "@/lib/chat-storage";
import Discover from "@/component/discovery/discover-section";

export default function Home() {
  const router = useRouter();

  const startChat = async (message: string) => {
    const id = await startNewChat(message);

    if (id) {
      router.push(`/c/${id}`);
    }
  };

  return (
    <>
      <main className="h-screen flex flex-col justify-center items-center w-full gap-4">
        <Hello />
        <ChatInput onSend={() => {}} />
      </main>
      <div className="w-full absolute top-9/12">
        <Discover />
      </div>
    </>
  );
}

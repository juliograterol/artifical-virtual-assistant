"use client";

import { useRouter } from "next/navigation";
import ChatInput from "@/component/chat/chat-input";
import Hello from "@/component/hello";
import { startNewChat } from "@/lib/chat-actions";
import { getChats, saveChats } from "@/lib/chat-storage";

export default function Home() {
  const router = useRouter();

  const startChat = async (message: string) => {
    const id = await startNewChat(message);

    if (id) {
      router.push(`/c/${id}`);
    }
  };

  return (
    <div className="flex max-h-screen w-full items-center justify-center font-sans">
      <main className="h-full w-full max-w-3xl flex-col items-center justify-between py-32 px-16">
        <section className="h-full w-full flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-6 py-6 text-center">
            <Hello />
          </div>

          <ChatInput onSend={startChat} />
        </section>
      </main>
    </div>
  );
}

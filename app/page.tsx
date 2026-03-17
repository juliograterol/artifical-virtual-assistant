"use client";

import { useRouter } from "next/navigation";
import ChatInput from "@/component/chat/chat-input";
import Hello from "@/component/hello";
import { getChats, saveChats } from "@/lib/chat-storage";

export default function Home() {
  const router = useRouter();

  const startChat = async (message: string) => {
    if (!message.trim()) return;

    const chats = getChats();
    const id = crypto.randomUUID();

    // 1. Create chat with user message
    const newChat = {
      id,
      name: message.slice(0, 40) || "New Chat",
      createdAt: Date.now(),
      messages: [
        {
          role: "user" as const,
          content: message,
        },
      ],
    };

    chats[id] = newChat;
    saveChats(chats);

    try {
      // 2. Send to n8n
      const res = await fetch(
        "https://n8n.interactiveworkers.com/webhook/AVA",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message,
            chatId: id,
          }),
        },
      );

      const data = await res.json();

      // 3. Save AVA response
      chats[id].messages.push({
        role: "agent",
        content: data.reply,
      });

      saveChats(chats);
    } catch (err) {
      console.error("Error sending to AVA:", err);
    }

    // 4. Redirect AFTER everything is saved
    router.push(`/c/${id}`);
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

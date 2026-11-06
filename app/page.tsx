"use client";

import { useEffect, useRef, useState } from "react";
import Hello from "@/components/hello";
import { useRouter } from "next/navigation";
import { startNewChat } from "@/lib/chat-actions";
import ChatInput from "@/components/chat/chat-input";
import Discover from "@/components/discovery/discover-section";
import { useIsMobile } from "@/lib/useMobile";
import { showError } from "@/lib/show-alert";
import { requireUser } from "@/lib/require-user";
import Footer from "@/components/footer";

export default function Home({ discover = true }: { discover?: boolean }) {
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const isMobile = useIsMobile();

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  const startChat = async (message: string) => {
    // ✅ waits for the restored session; only asks to log in if truly signed out
    const user = await requireUser();
    if (!user) throw new Error("Login cancelled"); // ChatInput keeps the text

    const chat = startNewChat(message);
    if (!chat) return;

    // ✅ navigate before the commit; the chat page renders the local writes
    router.push(`/c/${chat.chatId}`);

    try {
      await chat.done;
    } catch (err) {
      showError("Couldn't start the chat", err);
      throw err;
    }
  };
  return (
    <>
      <main
        className={`h-full max-h-10/12 ${!discover && "min-h-screen"} flex flex-col justify-center items-center w-full gap-4 text-white`}
      >
        <Hello />
        <ChatInput onSend={startChat} />
      </main>

      {discover && (
        <div
          className="w-full flex justify-center items-center text-white"
          style={{
            marginTop: !isMobile ? `-${headerHeight}px` : "0px",
          }}
        >
          <Discover headerRef={headerRef} />
        </div>
      )}
      <Footer />
    </>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Hello from "@/components/hello";
import { useRouter } from "next/navigation";
import { startNewChat } from "@/lib/chat-actions";
import ChatInput from "@/components/chat/chat-input";
import Discover from "@/components/discovery/discover-section";
import { useIsMobile } from "@/lib/useMobile";
import { showAlert } from "@/lib/show-alert";
import Login from "@/components/forms/login";
import { useUser } from "@/lib/useUser";
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

  // 🔥 Fetch user
  const { data } = useUser();

  const newChat = async (m: string) => {
    const chat = startNewChat(m);
    if (!chat) return;

    // ✅ navigate before the commit; the chat page renders the local writes
    router.push(`/c/${chat.chatId}`);
    await chat.done;
  };

  const startChat = async (message: string) => {
    if (!data) {
      await showAlert({
        form: <Login onLogin={async () => await newChat(message)} />,
      });
    } else {
      await newChat(message);
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

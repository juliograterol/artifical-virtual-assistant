"use client";

import { use, useEffect, useRef, useState } from "react";
import Hello from "@/component/hello";
import { useRouter } from "next/navigation";
import { startNewChat } from "@/lib/chat-actions";
import ChatInput from "@/component/chat/chat-input";
import Discover from "@/component/discovery/discover-section";
import { useIsMobile } from "@/lib/useMobile";
import { showAlert } from "@/lib/show-alert";
import Login from "@/component/login";
import { useUser } from "@/lib/useUser";

export default function Home() {
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
    const id = await startNewChat(m);
    if (id) {
      router.push(`/c/${id}`);
    }
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
      <main className="h-full max-h-10/12 flex flex-col justify-center items-center w-full gap-4 text-white">
        <Hello />
        <ChatInput onSend={startChat} />
      </main>

      <div
        className="w-full flex justify-center items-center text-white"
        style={{
          marginTop: !isMobile ? `-${headerHeight}px` : "0px",
        }}
      >
        <Discover headerRef={headerRef} />
      </div>
    </>
  );
}

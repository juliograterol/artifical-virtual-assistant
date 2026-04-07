"use client";

import { use, useEffect, useRef, useState } from "react";
import Hello from "@/component/hello";
import { useRouter } from "next/navigation";
import { startNewChat } from "@/lib/chat-actions";
import ChatInput from "@/component/chat/chat-input";
import Discover from "@/component/discovery/discover-section";
import { useIsMobile } from "@/lib/useMobile";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/lib/useAuth";
import { showAlert } from "@/lib/show-alert";
import Login from "@/component/login";

export default function Home() {
  const router = useRouter();
  const headerRef = useRef<HTMLElement | null>(null);
  const [headerHeight, setHeaderHeight] = useState(0);
  const isMobile = useIsMobile();

  const [name, setName] = useState(""); // 👈 default empty

  useEffect(() => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  }, []);

  // 🔥 Fetch user name
  const { user } = useAuth();

  useEffect(() => {
    const getUser = async () => {
      if (!user) return;

      const snap = await getDoc(doc(db, "users", user.uid));

      if (snap.exists()) {
        setName(snap.data().name ?? "");
      }
    };

    getUser();
  }, [user]);

  const newChat = async (m: string) => {
    const id = await startNewChat(m);
    if (id) {
      router.push(`/c/${id}`);
    }
  };

  const startChat = async (message: string) => {
    if (!user) {
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
        <Hello name={name} />
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

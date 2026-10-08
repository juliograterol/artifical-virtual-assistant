"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Chat from "@/components/chat/modal";
import ChatInput from "@/components/chat/chat-input";
import { sendMessageToChat } from "@/lib/chat-actions";
import GlassElement from "@/components/glass-elemet/glass-element";

import { db } from "@/lib/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDocs,
  limitToLast,
  endBefore,
  type QueryDocumentSnapshot,
} from "firebase/firestore";
import { changeName } from "@/lib/chat-storage";

export type Message = {
  id: string;
  role: "user" | "agent";
  content: string;
  status: "loading" | "sent" | "error";
  sentAt?: any;
  clientTs?: number;
};

const PAGE_SIZE = 50;

function toMessage(snap: QueryDocumentSnapshot): Message {
  // ✅ estimate pending serverTimestamps so new messages never get a null date
  const data = snap.data({ serverTimestamps: "estimate" });

  return {
    id: snap.id,
    role: data.role === "user" ? "user" : "agent",
    content: data.content ?? "",
    status:
      data.status === "loading" ||
      data.status === "sent" ||
      data.status === "error"
        ? data.status
        : "sent",
    sentAt: data.sentAt ?? null,
    clientTs: data.clientTs,
  };
}

// Messages written in one batch share a serverTimestamp: clientTs breaks the tie
function byTime(a: Message, b: Message) {
  const diff = (a.sentAt?.toMillis?.() ?? 0) - (b.sentAt?.toMillis?.() ?? 0);
  return diff || (a.clientTs ?? 0) - (b.clientTs ?? 0);
}

export default function ChatPage() {
  const { id } = useParams();
  const chatId = id as string;

  const [tail, setTail] = useState<Message[]>([]); // live: last PAGE_SIZE messages
  const [older, setOlder] = useState<Message[]>([]); // loaded on demand
  const [hasOlder, setHasOlder] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [name, setName] = useState("Chat");

  const tailRef = useRef<Message[]>([]);
  const cursorRef = useRef<QueryDocumentSnapshot | null>(null); // oldest message on screen
  const pagingRef = useRef(false);

  const messages = useMemo(() => [...older, ...tail], [older, tail]);

  // 🔥 REAL-TIME MESSAGES (last page only)
  useEffect(() => {
    if (!chatId) return;

    tailRef.current = [];
    cursorRef.current = null;
    pagingRef.current = false;
    setTail([]);
    setOlder([]);
    setHasOlder(false);

    const q = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("sentAt", "asc"),
      limitToLast(PAGE_SIZE),
    );

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const next = snapshot.docs.map(toMessage).sort(byTime);
        const ids = new Set(next.map((m) => m.id));

        // A new message pushes the oldest one out of the live window: keep it on screen
        const dropped = tailRef.current.filter((m) => !ids.has(m.id));
        tailRef.current = next;

        if (dropped.length) {
          pagingRef.current = true;
          setOlder((prev) => [...prev, ...dropped]);
        } else if (!pagingRef.current && snapshot.docs.length) {
          cursorRef.current = snapshot.docs[0];
          setHasOlder(snapshot.docs.length === PAGE_SIZE);
        }

        setTail(next);
      },
      (err) => console.error("Messages listener failed:", err),
    );

    return () => unsub();
  }, [chatId]);

  const loadOlder = async () => {
    const cursor = cursorRef.current;
    if (!cursor || loadingOlder) return;

    setLoadingOlder(true);
    try {
      const snapshot = await getDocs(
        query(
          collection(db, `chats/${chatId}/messages`),
          orderBy("sentAt", "asc"),
          endBefore(cursor),
          limitToLast(PAGE_SIZE),
        ),
      );

      pagingRef.current = true;
      if (snapshot.docs.length) cursorRef.current = snapshot.docs[0];
      setHasOlder(snapshot.docs.length === PAGE_SIZE);
      setOlder((prev) => [...snapshot.docs.map(toMessage).sort(byTime), ...prev]);
    } catch (err) {
      console.error("Error loading older messages:", err);
    } finally {
      setLoadingOlder(false);
    }
  };

  // 🔥 REAL-TIME CHAT NAME (FIXED)
  useEffect(() => {
    if (!chatId) return;

    const unsub = onSnapshot(
      doc(db, "chats", chatId),
      (snap) => {
        if (snap.exists()) {
          const chatName = snap.data()?.name || "Chat";

          setName(chatName);
          document.title = `${chatName} | Ava`;
        }
      },
      (err) => console.error("Chat listener failed:", err),
    );

    return () => unsub();
  }, [chatId]);

  // ⚠️ debounce recommended, but keeping simple
  const changeChatName = async (n: string) => {
    setName(n);

    await changeName({ chatId: chatId, name: n });
  };

  const sendMessage = async (message: string) => {
    await sendMessageToChat(chatId, message);
  };

  return (
    <section className="w-full h-screen flex flex-col justify-between items-center pb-4 px-4 relative">
      <div className="sticky top-0 w-full flex justify-center">
        <GlassElement className="mt-4 max-md:right-4 z-10 w-full md:max-w-3xl max-w-9/12">
          <h1 className="text-white font-medium w-full flex justify-center">
            <input
              placeholder="Chat Name"
              value={name}
              onChange={(e) => changeChatName(e.target.value)}
              className="px-2 w-full text-center outline-0"
            />
          </h1>
        </GlassElement>
      </div>
      <Chat.Modal
        messages={messages}
        hasOlder={hasOlder}
        loadingOlder={loadingOlder}
        onLoadOlder={loadOlder}
      />
      <ChatInput onSend={sendMessage} />
    </section>
  );
}

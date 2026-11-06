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
import { useAuth } from "@/lib/useAuth";
import { requireUser } from "@/lib/require-user";
import { showError } from "@/lib/show-alert";

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
  const { uid, loading: authLoading } = useAuth();

  const [tail, setTail] = useState<Message[]>([]); // live: last PAGE_SIZE messages
  const [older, setOlder] = useState<Message[]>([]); // loaded on demand
  const [hasOlder, setHasOlder] = useState(false);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [name, setName] = useState("Chat");

  const tailRef = useRef<Message[]>([]);
  const cursorRef = useRef<QueryDocumentSnapshot | null>(null); // oldest message on screen
  const pagingRef = useRef(false);

  const errorShownRef = useRef(false);
  const renameTimerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const pendingNameRef = useRef<string | null>(null);

  const messages = useMemo(() => [...older, ...tail], [older, tail]);

  // One alert per page even if several listeners fail for the same reason
  const reportListenerError = (err: unknown) => {
    if (errorShownRef.current) return;
    errorShownRef.current = true;
    showError("Couldn't load this chat", err);
  };

  // 🔐 Signed out once auth has resolved: ask to log in (listeners attach after)
  useEffect(() => {
    if (!authLoading && !uid) requireUser();
  }, [authLoading, uid]);

  // 🔥 REAL-TIME MESSAGES (last page only), only for a signed-in user
  useEffect(() => {
    if (!chatId || !uid) return;

    errorShownRef.current = false;

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
      reportListenerError,
    );

    return () => unsub();
  }, [chatId, uid]);

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
      showError("Couldn't load older messages", err);
    } finally {
      setLoadingOlder(false);
    }
  };

  // 🔥 REAL-TIME CHAT NAME, only for a signed-in user
  useEffect(() => {
    if (!chatId || !uid) return;

    const unsub = onSnapshot(
      doc(db, "chats", chatId),
      (snap) => {
        if (snap.exists()) {
          const chatName = snap.data()?.name || "Chat";

          setName(chatName);
          document.title = `${chatName} | Ava`;
        }
      },
      reportListenerError,
    );

    return () => unsub();
  }, [chatId, uid]);

  const saveName = (n: string) =>
    changeName({ chatId, name: n }).catch((err) =>
      showError("Couldn't rename the chat", err),
    );

  // Leaving the page before the debounce fires still saves the last edit
  useEffect(
    () => () => {
      clearTimeout(renameTimerRef.current);
      if (pendingNameRef.current) saveName(pendingNameRef.current);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [chatId],
  );

  // Saves 500ms after the last keystroke instead of on every keystroke
  const changeChatName = (n: string) => {
    setName(n);

    clearTimeout(renameTimerRef.current);
    pendingNameRef.current = n.trim() || null; // don't save an empty name
    if (!pendingNameRef.current) return;

    renameTimerRef.current = setTimeout(() => {
      const pending = pendingNameRef.current;
      pendingNameRef.current = null;
      if (pending) saveName(pending);
    }, 500);
  };

  const sendMessage = async (message: string) => {
    const user = await requireUser();
    if (!user) throw new Error("Login cancelled"); // ChatInput keeps the text

    try {
      await sendMessageToChat(chatId, message);
    } catch (err) {
      showError("Couldn't send your message", err);
      throw err;
    }
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

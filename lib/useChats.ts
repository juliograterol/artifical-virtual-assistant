"use client";

import { useEffect, useState } from "react";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./firebase";
import { getErrorMessage } from "./firebase-errors";
import { Chat } from "@/components/sidebar/history";

/**
 * Live list of the user's chats, newest activity first.
 * One query instead of user doc + one read per chat. Identical queries
 * (sidebar + history page) share a single listener inside the SDK.
 */
type ChatsState = { uid: string; data: Chat[]; error: string | null };

export const useChats = (uid?: string, max?: number) => {
  // keyed by uid so a different account never sees the previous list
  const [chats, setChats] = useState<ChatsState | null>(null);

  useEffect(() => {
    if (!uid) return;

    const constraints: QueryConstraint[] = [
      where("ownerId", "==", uid),
      where("deleted", "==", false),
      orderBy("updatedAt", "desc"),
    ];
    if (max) constraints.push(limit(max));

    const unsub = onSnapshot(
      query(collection(db, "chats"), ...constraints),
      (snapshot) => {
        setChats({
          uid,
          error: null,
          data: snapshot.docs.map(
            (d) =>
              ({
                id: d.id,
                ...d.data({ serverTimestamps: "estimate" }),
              }) as Chat,
          ),
        });
      },
      (err) => {
        console.error("Error fetching chats:", err);
        setChats({
          uid,
          data: [],
          error: getErrorMessage(err, "Couldn't load your chats."),
        });
      },
    );

    return () => unsub();
  }, [uid, max]);

  // signed out: nothing to show (also clears the list on logout)
  if (!uid) return { data: [] as Chat[], loading: false, error: null };

  if (chats?.uid !== uid) return { data: [] as Chat[], loading: true, error: null };

  return { data: chats.data, loading: false, error: chats.error };
};

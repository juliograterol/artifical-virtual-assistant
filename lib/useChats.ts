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
import { Chat } from "@/components/sidebar/history";

/**
 * Live list of the user's chats, newest activity first.
 * One query instead of user doc + one read per chat. Identical queries
 * (sidebar + history page) share a single listener inside the SDK.
 */
export const useChats = (uid?: string, max?: number) => {
  const [data, setData] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

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
        setData(
          snapshot.docs.map(
            (d) =>
              ({
                id: d.id,
                ...d.data({ serverTimestamps: "estimate" }),
              }) as Chat,
          ),
        );
        setLoading(false);
      },
      (err) => {
        console.log("Error fetching chats:", err);
        setLoading(false);
      },
    );

    return () => unsub();
  }, [uid, max]);

  // signed out: nothing to show (also clears the list on logout)
  return uid ? { data, loading } : { data: [] as Chat[], loading: false };
};

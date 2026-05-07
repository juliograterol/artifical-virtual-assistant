"use client";

import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getChats } from "./chat-storage";
import { Chat } from "@/component/sidebar/history";

type UserData = {
  name?: string;
  lastName?: string;
  email?: string;
  createdAt?: Date;
  chats?: any[];
  // add more fields based on your Firestore schema
};

export const useUser = () => {
  const { user } = useAuth();

  const [data, setData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setData(null);
      setLoading(false);
      return;
    }

    const getUser = async () => {
      try {
        setLoading(true);

        const snap = await getDoc(doc(db, "users", user.uid));

        if (snap.exists()) {
          setData(snap.data() as UserData);
        } else {
          setData(null);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [user?.uid]); // 👈 important: avoid unnecessary reruns

  return { data, loading, error };
};

export const useUserChats = () => {
  const [data, setData] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  const { uid } = useAuth();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        if (!uid) return;

        const chats = await getChats(uid);

        setData(chats as Chat[]);
      } catch (e) {
        console.log("Error fetching chats:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [uid]);

  return { data, loading };
};

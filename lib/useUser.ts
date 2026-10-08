"use client";

import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { doc, getDoc, Timestamp } from "firebase/firestore";
import { db } from "./firebase";

export type UserData = {
  profilePicture?: string;
  name?: string;
  lastName?: string;
  email?: string;
  createdAt?: Timestamp;
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
          console.warn(`No users/${user.uid} document: the app treats this as logged out`);
          setData(null);
        }
      } catch (err) {
        console.error(`Failed to read users/${user.uid}:`, err);
        setError("Failed to fetch user");
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, [user?.uid]); // 👈 important: avoid unnecessary reruns

  return { data, loading, error };
};

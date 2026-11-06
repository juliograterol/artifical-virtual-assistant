"use client";

import { useAuth } from "./useAuth";
import { useEffect, useState } from "react";
import { doc, onSnapshot, Timestamp } from "firebase/firestore";
import { auth, db } from "./firebase";
import { ensureUserProfile } from "./auth-actions";
import { getErrorMessage } from "./firebase-errors";

export type UserData = {
  profilePicture?: string;
  name?: string;
  lastName?: string;
  email?: string;
  createdAt?: Timestamp;
  // add more fields based on your Firestore schema
};

type ProfileState = {
  uid: string;
  data: UserData | null;
  error: string | null;
};

/**
 * Profile of the signed-in user from users/{uid}.
 * Use useAuth() to know *whether* someone is signed in; this is only their profile.
 */
export const useUser = () => {
  const { uid, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<ProfileState | null>(null);

  useEffect(() => {
    if (!uid) return;

    // ✅ live: updates after sign-in, profile creation and profile edits
    const unsub = onSnapshot(
      doc(db, "users", uid),
      (snap) => {
        if (snap.exists()) {
          setProfile({ uid, data: snap.data() as UserData, error: null });
          return;
        }

        setProfile({ uid, data: null, error: null });

        // the snapshot fires again once the profile exists
        if (auth.currentUser?.uid === uid) {
          ensureUserProfile(auth.currentUser).catch((err) =>
            setProfile({
              uid,
              data: null,
              error: getErrorMessage(err, "Couldn't create your profile."),
            }),
          );
        }
      },
      (err) => {
        console.error(`Failed to read users/${uid}:`, err);
        setProfile({
          uid,
          data: null,
          error: getErrorMessage(err, "Couldn't load your profile."),
        });
      },
    );

    return () => unsub();
  }, [uid]);

  // signed out (or auth still resolving): no profile
  if (!uid) return { data: null, loading: authLoading, error: null };

  // signed in, profile for this uid not loaded yet
  if (profile?.uid !== uid) return { data: null, loading: true, error: null };

  return { data: profile.data, loading: false, error: profile.error };
};

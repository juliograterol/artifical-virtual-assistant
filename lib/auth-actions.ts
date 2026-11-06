// lib/auth-actions.ts

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

// ✅ Register
export const register = async (
  email: string,
  password: string,
  name: string,
) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);

  await setDoc(doc(db, "users", res.user.uid), {
    name,
    email,
    createdAt: serverTimestamp(),
  });

  return res.user;
};

/**
 * The UI reads the profile from users/{uid}. Accounts created outside the app
 * (e.g. in the Firebase console) don't have one, so create it on first sign-in.
 * Deduplicated: many components may ask at the same time.
 */
const pendingProfiles = new Map<string, Promise<void>>();

export const ensureUserProfile = (user: User) => {
  const existing = pendingProfiles.get(user.uid);
  if (existing) return existing;

  const task = (async () => {
    const ref = doc(db, "users", user.uid);
    if ((await getDoc(ref)).exists()) return;

    const email = user.email ?? "";
    await setDoc(ref, {
      name: user.displayName || email.split("@")[0] || "User",
      email,
      createdAt: serverTimestamp(),
    });
  })().finally(() => pendingProfiles.delete(user.uid));

  pendingProfiles.set(user.uid, task);
  return task;
};

// ✅ Login
export const login = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email.trim(), password);

  // Not fatal: the session is valid; useUser retries when it reads the profile
  await ensureUserProfile(res.user).catch((err) =>
    console.warn("Couldn't create the user profile:", err),
  );

  // 🍪 Simple auth cookie
  document.cookie = "token=true; path=/; max-age=604800";

  return res.user;
};

// ✅ Logout
export const logout = async () => {
  await signOut(auth);

  // remove cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
};

/**
 * Resolves once Firebase has restored the session from storage, so callers
 * never mistake "not loaded yet" for "signed out".
 */
export const getSignedInUser = async () => {
  await auth.authStateReady();
  return auth.currentUser;
};

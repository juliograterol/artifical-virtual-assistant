// lib/auth-actions.ts

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth, db } from "./firebase";
import { doc, setDoc } from "firebase/firestore";

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
    createdAt: new Date(),
  });

  return res.user;
};

// ✅ Login
export const login = async (email: string, password: string) => {
  const res = await signInWithEmailAndPassword(auth, email, password);

  // 🍪 Simple auth cookie
  document.cookie = "token=true; path=/; max-age=604800";

  return res.user;
};

// ✅ Logout
export const logout = async () => {
  // remove cookie
  document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

  await signOut(auth);
};

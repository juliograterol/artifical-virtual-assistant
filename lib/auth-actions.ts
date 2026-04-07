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

  // store user in Firestore
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
  return res.user;
};

// ✅ Logout
export const logout = async () => {
  await signOut(auth);
};

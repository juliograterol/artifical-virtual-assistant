// Server only: never import this from a "use client" module.
import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

if (!process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
  throw new Error(
    "Missing FIREBASE_CLIENT_EMAIL / FIREBASE_PRIVATE_KEY: add the service account to .env.local (and Vercel)",
  );
}

const app = getApps().length
  ? getApp()
  : initializeApp({
      credential: cert({
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // env vars store the key with literal "\n"
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      }),
    });

export const adminAuth = getAuth(app);
export const adminDb = getFirestore(app);

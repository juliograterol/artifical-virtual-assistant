// One-off migration to the ownerId-based chat model.
//
//   node --env-file=.env.local scripts/backfill-chats.mjs                     # dry run
//   node --env-file=.env.local scripts/backfill-chats.mjs --apply             # write
//   node --env-file=.env.local scripts/backfill-chats.mjs --apply --fail-stuck
//   node --env-file=.env.local scripts/backfill-chats.mjs --apply --drop-user-chats
//
// Safe to re-run: every value is recomputed from the source data.

import { cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const apply = process.argv.includes("--apply");
const failStuck = process.argv.includes("--fail-stuck");
const dropUserChats = process.argv.includes("--drop-user-chats");

const PREVIEW_LENGTH = 140;
const STUCK_AFTER_MS = 10 * 60 * 1000;
// Keep in sync with REPLY_FAILED in lib/n8n.ts
const REPLY_FAILED = "Failed to get a response. Please try again.";

initializeApp({
  credential: cert({
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  }),
});

const db = getFirestore();
const writer = db.bulkWriter();

// Old agent replies may be stored as { reply } objects
function preview(content) {
  const text = typeof content === "string" ? content : (content?.reply ?? "");
  return String(text).slice(0, PREVIEW_LENGTH);
}

const stats = { users: 0, chats: 0, missing: 0, conflicts: 0, stuck: 0, arrays: 0 };

const users = await db.collection("users").get();

for (const user of users.docs) {
  stats.users++;
  const refs = user.get("chats") ?? [];

  for (const ref of refs) {
    const chat = await ref.get();
    if (!chat.exists) {
      stats.missing++;
      continue;
    }

    const owner = chat.get("ownerId");
    if (owner && owner !== user.id) {
      stats.conflicts++;
      console.warn(`! chat ${chat.id} is owned by ${owner} but listed by ${user.id}, skipped`);
      continue;
    }

    const messages = ref.collection("messages");
    const [last] = (await messages.orderBy("sentAt", "desc").limit(1).get()).docs;

    const patch = {
      ownerId: user.id,
      deleted: chat.get("deleted") === true,
      updatedAt:
        last?.get("sentAt") ?? chat.get("createdAt") ?? FieldValue.serverTimestamp(),
    };

    if (last) {
      patch.lastMessage = {
        role: last.get("role") === "user" ? "user" : "agent",
        preview: preview(last.get("content")),
      };
    }

    stats.chats++;
    if (apply) writer.update(ref, patch);

    // Replies the old browser-side flow abandoned
    if (failStuck) {
      const loading = await messages.where("status", "==", "loading").get();

      for (const msg of loading.docs) {
        const sentAt = msg.get("sentAt")?.toMillis?.() ?? 0;
        if (Date.now() - sentAt < STUCK_AFTER_MS) continue;

        stats.stuck++;
        if (apply) {
          writer.update(msg.ref, {
            content: REPLY_FAILED,
            status: "error",
            errorCode: "abandoned",
          });
        }
      }
    }
  }

  if (dropUserChats && refs.length) {
    stats.arrays++;
    if (apply) writer.update(user.ref, { chats: FieldValue.delete() });
  }
}

await writer.close();

console.log(apply ? "Applied:" : "Dry run (pass --apply to write):", stats);

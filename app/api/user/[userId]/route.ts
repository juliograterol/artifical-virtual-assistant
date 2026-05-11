import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
} from "firebase/firestore";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ userId: string }> },
) {
  const { userId } = await context.params;

  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 });
  }

  try {
    // 🔥 Get chat document
    const chatRef = doc(db, "users", userId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // 🔥 Get messages
    const messagesQuery = query(
      collection(db, `chats/${userId}/messages`),
      orderBy("sentAt", "asc"),
    );

    const messagesSnap = await getDocs(messagesQuery);

    const messages = messagesSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    return NextResponse.json({
      id: chatSnap.id,
      ...chatSnap.data(),
      messages,
    });
  } catch (err) {
    console.error(err);

    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

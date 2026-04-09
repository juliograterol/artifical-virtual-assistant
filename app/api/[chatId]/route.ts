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
  req: Request,
  { params }: { params: { chatId?: string } },
) {
  const url = new URL(req.url);
  const fallbackId = url.pathname.split("/").pop();

  const chatId = params?.chatId || fallbackId;

  if (!chatId) {
    return Response.json({ error: "Missing chatId" }, { status: 400 });
  }

  try {
    // 🔥 Get chat document
    const chatRef = doc(db, "chats", chatId);
    const chatSnap = await getDoc(chatRef);

    if (!chatSnap.exists()) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    // 🔥 Get messages subcollection
    const messagesQuery = query(
      collection(db, `chats/${chatId}/messages`),
      orderBy("sentAt", "asc"),
    );

    const messagesSnap = await getDocs(messagesQuery);

    const messages = messagesSnap.docs.map((doc) => ({
      id: doc.id,
      ...(doc.data() as any),
    }));

    return Response.json({
      id: chatSnap.id,
      ...chatSnap.data(),
      messages,
    });
  } catch (err) {
    console.error(err);

    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

"use client";

import Link from "next/link";
import GlassElement from "@/components/glass-elemet/glass-element";
import Options from "@/components/options";
import { Chat } from "@/components/sidebar/history";
import { useUser } from "@/lib/useUser";
import { useAuth } from "@/lib/useAuth";
import { useChats } from "@/lib/useChats";
import { useFormatDate } from "@/lib/useFormatDate";
import Login from "@/components/forms/login";
import Button from "@/components/button";
import TextType from "@/components/TextType";
import { useRouter } from "next/navigation";
import { showAlert } from "@/lib/show-alert";
import Footer from "@/components/footer";

export default function HistoryPage() {
  const router = useRouter();
  const user = useUser();
  const { uid } = useAuth();
  const { data } = useChats(uid);

  const chats = data as Chat[];

  const startHistory = async () => {
    if (!user.data) {
      await showAlert({
        form: <Login onLogin={() => router.push(`/c/`)} />,
      });
    } else {
      router.push(`/c/`);
    }
  };

  return (
    <>
      <div className="w-full flex min-h-screen">
        <section className="w-full h-full md:p-10 px-4 flex flex-col items-center">
          <header className="w-full">
            <h2 className="text-4xl text-white text-center font-medium mb-4">
              History
            </h2>
          </header>
          {chats.length > 0 ? (
            <ul className="flex flex-col gap-2 w-full">
              {chats.map((chat) => {
                return <HistoryItem key={chat.id} chat={chat} />;
              })}
            </ul>
          ) : (
            <div className="text-white flex items-center min-h-[70svh] h-full justify-center">
              <GlassElement className="w-full max-w-3xl">
                <div className="grid justify-items-center space-y-2">
                  <h3 className="font-medium text-xl underline">
                    No history available
                  </h3>
                  <span>
                    Welcome to a blank page with infinite possibilities. This
                    isn't just another chatbot; it's a living sandbox for your
                    ideas, workflows, and logic. Built to adapt to how you
                    think, it's ready to help you build, automate, and create
                    from the ground up.{" "}
                    <TextType
                      text={[
                        "What are we making today?",
                        "Let's build something great!",
                        "The slate is all yours!",
                      ]}
                    />
                  </span>

                  <div className="flex max-md:flex-col gap-2 h-max w-max">
                    <Button onClick={startHistory}>
                      {user.data ? "Chat With Ava" : "Login now"}
                    </Button>
                  </div>
                </div>
              </GlassElement>
            </div>
          )}
        </section>
      </div>
      <Footer />
    </>
  );
}

const HistoryItem = ({ chat }: { chat: Chat }) => {
  // ✅ preview is stored on the chat doc: no per-item message reads
  const { id, name, createdAt, lastMessage } = chat;

  const ItemWrapper = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return (
      <div className="group/item cursor-pointer md:max-w-8/12 w-full text-white hover:bg-[#606060]/50 rounded-xl relative">
        <GlassElement>
          <Link href={href}>{children}</Link>
        </GlassElement>
        <Options id={id} />
      </div>
    );
  };

  return (
    <li className="relative flex w-full justify-center">
      <ItemWrapper href={`c/${chat.id}`}>
        <div className="text-white flex justify-between pb-2 mb-2 border-b border-[#404040] overflow-auto">
          <label className={name ?? "opacity-50"}>
            {name ?? "Untitled Chat"}
          </label>
          <p className="text-[#606060] max-md:text-xs">
            {useFormatDate(createdAt)}
          </p>
        </div>
        {lastMessage && (
          <p className="text-sm text-white opacity-50 line-clamp-1 ml-4 select-none">
            <strong className="font-medium">{lastMessage.role}: </strong>
            {lastMessage.preview}
          </p>
        )}
      </ItemWrapper>
    </li>
  );
};

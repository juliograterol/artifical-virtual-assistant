import ChatInput from "@/component/chat/chat-input";
import GlassElement from "@/component/glass-elemet/glass-element";
import Hello from "@/component/hello";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex max-h-screen w-full items-center justify-center font-sans">
      <main className="h-full w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <section className="h-full w-full flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-6 py-6 text-center sm:items-start sm:text-left">
            <Hello />
          </div>
          {/* <ChatInput /> */}
        </section>
      </main>
    </div>
  );
}

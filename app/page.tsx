import GlassElement from "@/component/glass-elemet/glass-element";
import Hello from "@/component/hello";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex max-h-screen items-center justify-center font-sans">
      <main className="h-full w-full max-w-3xl flex-col items-center justify-between py-32 px-16 sm:items-start">
        <section className="h-full flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center gap-6 py-6 text-center sm:items-start sm:text-left">
            {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}
            <Hello />
          </div>
          <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Chat
            </a>
            <a
              className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-39.5"
              target="_blank"
              rel="noopener noreferrer"
            >
              Leads
            </a>
          </div>
        </section>
        {/* <GlassElement>
          <input
            className="text-white px-10 outline-0"
            placeholder="Type something..."
          ></input>
        </GlassElement> */}
      </main>
    </div>
  );
}

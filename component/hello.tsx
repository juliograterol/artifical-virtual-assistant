import Image from "next/image";
import GlassElement from "./glass-elemet/glass-element";
import AVA from "./AVA";

const greeting: string[] = ["Good morning", "Good afternoon"];
const message: string[] = [
  "How can I help you?",
  "What can I do for you today?",
  "Tell me what's on your mind?",
  "Ready to reach out?",
];

export default function Hello({ name = "User" }: { name?: string }) {
  return (
    <div className="flex flex-col w-full">
      {/* <GlassElement className="w-80 h-80 flex justify-center items-center hover:scale-[1.01] p-10"> */}
      {/* <h1 className="text-white text-8xl text-center font-semibold">AVA</h1> */}
      <AVA />
      {/* </GlassElement> */}
      <h2 className="text-4xl text-white text-center font-medium">
        {greeting[0]}, {name}
      </h2>
      <p className="text-lg text-zinc-400 text-center">
        {message[Math.floor(Math.random() * message.length)]}
      </p>
    </div>
  );
}

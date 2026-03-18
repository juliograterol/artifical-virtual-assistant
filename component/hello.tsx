"use client";

import { useEffect, useState } from "react";

export default function Hello({ name = "User" }: { name?: string }) {
  const greeting: string[] = ["Good morning", "Good afternoon"];
  const message: string[] = [
    "How can I help you?",
    "What can I do for you today?",
    "Tell me what's on your mind?",
    "Let's build something great.",
  ];

  const [randomMessage, setRandomMessage] = useState("");
  const [randomGreeting, setRandomGreeting] = useState("");

  useEffect(() => {
    setRandomMessage(message[Math.floor(Math.random() * message.length)]);
    setRandomGreeting(greeting[Math.floor(Math.random() * greeting.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="md:text-5xl text-4xl text-white text-center font-medium tracking-[-7.5%]">
        {randomGreeting}, {name}
      </h1>

      <p className="text-lg text-zinc-400 text-center">{randomMessage}</p>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";

export default function Hello({ name }: { name?: string }) {
  const message: string[] = [
    "How can I help you?",
    "What can I do for you today?",
    "Tell me what's on your mind?",
    "Let's build something great.",
  ];

  const [randomMessage, setRandomMessage] = useState("");
  const [greeting, setGreeting] = useState("Hello");

  useEffect(() => {
    // Get user's local hour
    const hour = new Date().getHours();

    let greetingText = "Hello";

    if (hour < 12) {
      greetingText = "Good morning";
    } else if (hour < 18) {
      greetingText = "Good afternoon";
    } else {
      greetingText = "Good evening";
    }

    setGreeting(greetingText);

    setRandomMessage(message[Math.floor(Math.random() * message.length)]);
  }, []);

  return (
    <div className="flex flex-col items-center gap-2">
      <h1 className="md:text-5xl text-4xl text-white text-center font-medium tracking-[-7.5%]">
        {greeting}, {name !== "" ? name : "User"}
      </h1>
      <p className="text-lg text-zinc-400 text-center">{randomMessage}</p>
    </div>
  );
}

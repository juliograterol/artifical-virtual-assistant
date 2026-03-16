"use client";

import { useState } from "react";
import ActionButtons from "./action-buttons";

const ChatInput = ({
  placeholder = "Reply to AVA...",
}: {
  placeholder?: string;
}) => {
  const [message, setMessage] = useState<string>("");

  const handleSend = async () => {
    if (!message.trim()) return;

    const payload = {
      message,
      timestamp: Date.now(),
    };

    console.log("Sending:", payload);

    const res = await fetch(
      "https://n8n.interactiveworkers.com/webhook-test/AVA",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message,
        }),
      },
    );

    const data = await res.json();

    console.log("AVA:", data.reply);

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="text-white w-full flex flex-col text-center gap-5">
      <div className="bg-[#282828] rounded-[25px] p-6 w-full">
        <textarea
          className="outline-0 w-full resize-none"
          placeholder={placeholder}
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <div className="flex gap-2 justify-end items-center">
          <ActionButtons.VoiceButton />
          <ActionButtons.Attachment />
          <ActionButtons.SendButton
            onClick={handleSend}
            disabled={!message.trim()}
          />
        </div>
      </div>

      <p className="text-sm">AVA can make mistakes. Check important info.</p>
    </div>
  );
};

export default ChatInput;

"use client";

import { useState } from "react";
import ActionButtons from "../action-buttons";

const ChatInput = ({
  placeholder = "Reply to AVA...",
  onSend,
}: {
  placeholder?: string;
  onSend: (message: string) => Promise<void> | void;
}) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;

    await onSend(message);

    setMessage("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="text-white w-full flex flex-col text-center gap-5 max-w-3xl">
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

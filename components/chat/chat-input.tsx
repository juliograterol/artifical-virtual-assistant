"use client";

import { useState } from "react";
import ActionButtons from "../action-buttons";
import GlassElement from "../glass-elemet/glass-element";
import { Warning } from "../warning";
import TextType from "../TextType";

const ChatInput = ({
  placeholder = [
    "Reply to AVA...",
    "Ask AVA anything.",
    "Generate a marketing strategy for...",
    "Draft a professional email...",
    "Scrap 10 leads located in the United States...",
    "Schedule a meeting with...",
  ],
  onSend,
}: {
  placeholder?: string | string[];
  onSend: (message: string) => Promise<void> | void;
}) => {
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState<boolean>(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setMessage("");
    try {
      setIsSending(true);
      await onSend(message);
    } catch (e) {
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="text-white w-full flex flex-col text-center gap-5 max-w-3xl max-md:px-4 relative">
      <GlassElement>
        {/* <div className="bg-[#282828] rounded-[25px] p-6 w-full"> */}
        {!message && (
          <TextType text={placeholder} className="absolute opacity-50" />
        )}
        <textarea
          className="outline-0 w-full resize-none"
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
            loading={isSending}
          />
        </div>
        {/* </div> */}
      </GlassElement>
      <Warning
        message=" AVA can make mistakes. Check important info."
        status="danger"
      />
    </div>
  );
};

export default ChatInput;

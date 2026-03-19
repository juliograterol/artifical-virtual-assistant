"use client";

import { useState } from "react";
import ActionButtons from "../action-buttons";
import GlassElement from "../glass-elemet/glass-element";

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
    <div className="text-white w-full flex flex-col text-center gap-5 max-w-3xl max-md:px-4">
      <GlassElement>
        {/* <div className="bg-[#282828] rounded-[25px] p-6 w-full"> */}
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
        {/* </div> */}
      </GlassElement>

      <p className="text-sm flex items-center justify-center gap-2">
        <svg
          width="15"
          height="15"
          viewBox="0 0 15 15"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.8467 4.28002V7.8467C7.8467 8.03589 7.77155 8.21733 7.63777 8.3511C7.50399 8.48488 7.32255 8.56004 7.13337 8.56004C6.94418 8.56004 6.76274 8.48488 6.62896 8.3511C6.49518 8.21733 6.42003 8.03589 6.42003 7.8467V4.28002C6.42003 4.09083 6.49518 3.90939 6.62896 3.77561C6.76274 3.64184 6.94418 3.56668 7.13337 3.56668C7.32255 3.56668 7.50399 3.64184 7.63777 3.77561C7.77155 3.90939 7.8467 4.09083 7.8467 4.28002ZM6.6269 9.48024C6.69355 9.41413 6.7726 9.36182 6.85951 9.32632C6.94642 9.29082 7.03949 9.27283 7.13337 9.27337C7.03949 9.27283 6.94642 9.29082 6.85951 9.32632C6.7726 9.36182 6.69355 9.41413 6.6269 9.48024ZM6.42003 9.98671C6.41949 9.89283 6.43748 9.79976 6.47298 9.71285C6.50848 9.62594 6.56078 9.54689 6.6269 9.48024C6.56078 9.54689 6.50848 9.62594 6.47298 9.71285C6.43748 9.79976 6.41949 9.89283 6.42003 9.98671ZM7.13337 9.27337C6.99228 9.27337 6.85436 9.31521 6.73706 9.39359C6.61975 9.47197 6.52832 9.58338 6.47433 9.71373C6.42034 9.84407 6.40621 9.9875 6.43374 10.1259C6.46126 10.2642 6.5292 10.3914 6.62896 10.4911C6.72872 10.5909 6.85583 10.6588 6.9942 10.6863C7.13257 10.7139 7.276 10.6997 7.40635 10.6457C7.53669 10.5918 7.6481 10.5003 7.72648 10.383C7.80487 10.2657 7.8467 10.1278 7.8467 9.98671C7.8467 9.79752 7.77155 9.61608 7.63777 9.4823C7.50399 9.34853 7.32255 9.27337 7.13337 9.27337ZM14.2667 7.13336C14.2667 8.54421 13.8484 9.92337 13.0645 11.0964C12.2807 12.2695 11.1666 13.1838 9.86319 13.7237C8.55973 14.2636 7.12545 14.4049 5.74172 14.1297C4.35798 13.8544 3.08694 13.175 2.08932 12.1774C1.0917 11.1798 0.412311 9.90875 0.137069 8.52501C-0.138174 7.14128 0.00309077 5.70699 0.542998 4.40354C1.08291 3.10009 1.99721 1.98601 3.17028 1.20219C4.34336 0.418364 5.72252 0 7.13337 0C8.07013 0 8.99773 0.18451 9.86319 0.542995C10.7286 0.90148 11.515 1.42692 12.1774 2.08931C12.8398 2.75171 13.3652 3.53808 13.7237 4.40354C14.0822 5.269 14.2667 6.1966 14.2667 7.13336ZM12.8401 7.13336C12.8401 6.00469 12.5054 4.90136 11.8783 3.9629C11.2512 3.02444 10.36 2.29299 9.31722 1.86107C8.27446 1.42914 7.12704 1.31613 6.02005 1.53633C4.91306 1.75652 3.89622 2.30003 3.09813 3.09812C2.30003 3.89622 1.75652 4.91305 1.53633 6.02004C1.31613 7.12703 1.42915 8.27446 1.86107 9.31722C2.293 10.36 3.02444 11.2512 3.9629 11.8783C4.90136 12.5054 6.00469 12.8401 7.13337 12.8401C8.64687 12.8401 10.0984 12.2388 11.1686 11.1686C12.2388 10.0984 12.8401 8.64687 12.8401 7.13336Z"
            fill="#FF4C4C"
          />
        </svg>
        AVA can make mistakes. Check important info.
      </p>
    </div>
  );
};

export default ChatInput;

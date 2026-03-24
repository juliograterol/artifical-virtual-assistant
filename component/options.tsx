"use client";

import { useState } from "react";
import { deleteChat } from "@/lib/chat-actions";
import { showAlert } from "@/lib/show-alert";

const Options = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      className={`rounded-xl absolute top-0 right-0 bg-[#404040] h-full flex items-center px-2 cursor-pointer opacity-0 group-hover/item:opacity-100 transition-opacity`}
    >
      <svg
        onClick={() => setIsOpen(!isOpen)}
        className="w-6 h-6 text-white hover:bg-[#606060] rounded"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          d="M6 12h.01m6 0h.01m5.99 0h.01"
        />
      </svg>
      <div
        className={`absolute top-full left-0 z-10 bg-[#404040] w-max rounded-xl ${isOpen ? "" : "opacity-0"}`}
        onPointerLeave={() => {
          setIsOpen(false);
        }}
      >
        <button
          className="hover:bg-[#606060] text-red-500 p-2 rounded-xl select-none cursor-pointer"
          onClick={async () => {
            const confirmed = await showAlert({
              title: "Delete chat?",
              message:
                "AVA doesn't have backups for chats. This action will delete this chat forever.",
            });
            if (confirmed) {
              deleteChat(id);
            }
          }}
        >
          Delete Chat
        </button>
      </div>
    </div>
  );
};

export default Options;

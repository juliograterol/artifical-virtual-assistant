"use client";

import { useState } from "react";
import { deleteChat } from "@/lib/chat-actions";
import { showAlert } from "@/lib/show-alert";
import ChatNameForm from "./forms/chat-name-form";

const Options = ({ id }: { id: string }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div
      // onMouseLeave={() => setIsOpen(!isOpen)}
      className={`rounded-xl absolute top-0 right-0  h-full flex items-center px-2 opacity-0 group-hover/item:opacity-100 transition-opacity`}
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="hover:bg-[#606060] rounded cursor-pointer "
        >
          <svg
            className="w-6 h-6 text-white"
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
        </button>
        <div
          className={`absolute top-full left-0 z-10 bg-[#404040] w-max rounded-xl ${isOpen ? "" : "opacity-0"} grid`}
          // onMouseOut={() => {
          //   setIsOpen(false);
          // }}
        >
          <button
            className="hover:bg-[#606060] text-red-500 p-2 rounded-xl select-none cursor-pointer"
            onClick={async () => {
              const confirmed = await showAlert({
                title: "Delete chat?",
                icon: "warning",
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
          <button
            className="hover:bg-[#606060] text-white p-2 rounded-xl select-none cursor-pointer"
            onClick={async () => {
              const confirmed = await showAlert({
                form: <ChatNameForm id={id} />,
              });
              if (confirmed) {
                deleteChat(id);
              }
            }}
          >
            Edit Name
          </button>
        </div>
      </div>
    </div>
  );
};

export default Options;

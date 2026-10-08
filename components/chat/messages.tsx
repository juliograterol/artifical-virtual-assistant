import { Timestamp } from "firebase/firestore";
import MessageFormatter from "./message-formatter";
import { forwardRef } from "react";
import { useFormatDate } from "@/lib/useFormatDate";

interface MessageProps {
  message?: any; // 👈 allow anything (we sanitize inside)
  status: "loading" | "sent" | "error";
  isNew?: boolean;
  sentAt?: Timestamp;
}

// Older agent replies were stored with literal "\n" sequences instead of line breaks
function unescapeNewlines(text: string) {
  if (text.includes("\n") || !text.includes("\\n")) return text;

  return text
    .replace(/\\r\\n|\\n/g, "\n")
    .replace(/\\t/g, "\t")
    .replace(/\\"/g, '"');
}

function normalizeMessage(message: any): string {
  if (typeof message === "string") return message;

  if (message && typeof message === "object") {
    // Handle your AVA structured response
    if (message.reply) return String(message.reply);

    // fallback (debug-friendly)
    return JSON.stringify(message, null, 2);
  }

  return "";
}

const Bubble = forwardRef<
  HTMLDivElement,
  {
    message: any;
    align?: "left" | "right";
    status?: "loading" | "sent" | "error";
    isNew?: boolean;
    sentAt?: Timestamp;
  }
>(({ message, align = "left", status = "sent", isNew, sentAt }, ref) => {
  const normalized = normalizeMessage(message);
  const safeMessage =
    align === "left" ? unescapeNewlines(normalized) : normalized;

  return (
    <div
      ref={ref}
      className={`message p-4 text-white rounded-2xl min-w-0 ${align} ${
        align === "left"
          ? "rounded-tl-none bg-[#282828] self-start max-w-[92%] md:max-w-[85%]"
          : "rounded-tr-none bg-[#606060] self-end max-w-[85%] md:max-w-[75%]"
      } ${status === "error" ? "border border-[#FF4C4C]/40" : ""}`}
    >
      {status === "loading" ? (
        <svg
          fill="white"
          className="aspect-square min-h-4"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="4" cy="12" r="3">
            <animate
              id="spinner_jObz"
              begin="0;spinner_vwSQ.end-0.25s"
              attributeName="r"
              dur="0.75s"
              values="3;.2;3"
            />
          </circle>
          <circle cx="12" cy="12" r="3">
            <animate
              begin="spinner_jObz.end-0.6s"
              attributeName="r"
              dur="0.75s"
              values="3;.2;3"
            />
          </circle>
          <circle cx="20" cy="12" r="3">
            <animate
              id="spinner_vwSQ"
              begin="spinner_jObz.end-0.45s"
              attributeName="r"
              dur="0.75s"
              values="3;.2;3"
            />
          </circle>
        </svg>
      ) : (
        <MessageFormatter message={safeMessage} isNew={isNew} />
      )}
      <span className="mt-1 w-full text-[11px] flex justify-end opacity-50 select-none">
        {useFormatDate(sentAt, "time")}
      </span>
    </div>
  );
});
Bubble.displayName = "Bubble";

const UserMessage = forwardRef<HTMLDivElement, MessageProps>(
  ({ message = "", sentAt }, ref) => {
    return (
      <Bubble
        ref={ref}
        message={message}
        align="right"
        status="sent"
        sentAt={sentAt}
      />
    );
  },
);

const AgentMessage = forwardRef<HTMLDivElement, MessageProps>(
  ({ message = "", status, isNew, sentAt }, ref) => {
    return (
      <Bubble
        ref={ref}
        message={message}
        align="left"
        status={status}
        isNew={isNew}
        sentAt={sentAt}
      />
    );
  },
);

UserMessage.displayName = "UserMessage";
AgentMessage.displayName = "AgentMessage";

type C = {
  UserMessage: typeof UserMessage;
  AgentMessage: typeof AgentMessage;
};

export default { UserMessage, AgentMessage } as C;

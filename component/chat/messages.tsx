import MessageFormatter from "./message-formatter";
import { forwardRef } from "react";

interface MessageProps {
  message?: any; // 👈 allow anything (we sanitize inside)
  status: "loading" | "sent" | "error";
  isNew?: boolean;
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
  }
>(({ message, align = "left", status = "sent", isNew }, ref) => {
  const safeMessage = normalizeMessage(message);

  return (
    <div
      ref={ref}
      className={`message p-4 text-white rounded-2xl md:max-w-1/2 mb-4 md:mx-40 ${
        align === "left"
          ? "rounded-tl-none bg-[#282828] self-start sm:mr-40 mr-8"
          : "rounded-tr-none bg-[#606060] self-end sm:ml-40 ml-8"
      }`}
    >
      {status === "loading" ? (
        <svg
          fill="white"
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
    </div>
  );
});
Bubble.displayName = "Bubble";

const UserMessage = forwardRef<HTMLDivElement, MessageProps>(
  ({ message = "" }, ref) => {
    return <Bubble ref={ref} message={message} align="right" status="sent" />;
  },
);

const AgentMessage = forwardRef<HTMLDivElement, MessageProps>(
  ({ message = "", status, isNew }, ref) => {
    return (
      <Bubble
        ref={ref}
        message={message}
        align="left"
        status={status}
        isNew={isNew}
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

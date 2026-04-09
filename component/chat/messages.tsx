import MessageFormatter from "./message-formatter";
import { forwardRef } from "react";

interface MessageProps {
  message?: any; // 👈 allow anything (we sanitize inside)
  status: "loading" | "sent" | "error";
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
  }
>(({ message, align = "left", status = "sent" }, ref) => {
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
        <span className="flex gap-1 items-center opacity-70">
          <span className="w-1 h-1 bg-white rounded-full animate-bounce" />
          <span className="w-1 h-1 bg-white rounded-full animate-bounce delay-150" />
          <span className="w-1 h-1 bg-white rounded-full animate-bounce delay-300" />
        </span>
      ) : (
        <MessageFormatter message={safeMessage} />
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
  ({ message = "", status }, ref) => {
    return <Bubble ref={ref} message={message} align="left" status={status} />;
  },
);

UserMessage.displayName = "UserMessage";
AgentMessage.displayName = "AgentMessage";

type C = {
  UserMessage: typeof UserMessage;
  AgentMessage: typeof AgentMessage;
};

export default { UserMessage, AgentMessage } as C;

import MessageFormatter from "./message-formatter";

interface MessageProps {
  message?: any; // 👈 allow anything (we sanitize inside)
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

const Bubble = ({
  message,
  align = "left",
}: { align?: "left" | "right" } & MessageProps) => {
  const safeMessage = normalizeMessage(message);

  return (
    <div
      className={`message p-4 text-white rounded-2xl w-max md:max-w-3xl max-w-[70%] mb-4 md:mx-40 ${
        align === "left"
          ? "rounded-tl-none bg-[#282828] self-start left"
          : "rounded-tr-none bg-[#606060] self-end right"
      }`}
    >
      <MessageFormatter message={safeMessage} />
    </div>
  );
};

const UserMessage = ({ message = "" }: MessageProps) => {
  return <Bubble message={message} align="right" />;
};

const AgentMessage = ({ message = "" }: MessageProps) => {
  return <Bubble message={message} align="left" />;
};

type C = {
  UserMessage: typeof UserMessage;
  AgentMessage: typeof AgentMessage;
};

export default { UserMessage, AgentMessage } as C;

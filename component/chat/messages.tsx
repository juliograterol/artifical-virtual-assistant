import MessageFormatter from "./message-formatter";

interface MessageProps {
  message?: any; // 👈 allow anything (we sanitize inside)
  pending?: boolean;
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
  pending = false,
}: { align?: "left" | "right" } & MessageProps) => {
  const safeMessage = normalizeMessage(message);

  return (
    <div
      className={`message p-4 text-white rounded-2xl mb-4 md:mx-40 ${
        align === "left"
          ? "rounded-tl-none bg-[#282828] self-start left sm:mr-40 mr-8"
          : "rounded-tr-none bg-[#606060] self-end right sm:ml-40 ml-8"
      }`}
    >
      {pending ? (
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
};

const UserMessage = ({ message = "" }: MessageProps) => {
  return <Bubble message={message} align="right" />;
};

const AgentMessage = ({ message = "", pending = false }: MessageProps) => {
  return <Bubble message={message} align="left" pending={pending} />;
};

type C = {
  UserMessage: typeof UserMessage;
  AgentMessage: typeof AgentMessage;
};

export default { UserMessage, AgentMessage } as C;

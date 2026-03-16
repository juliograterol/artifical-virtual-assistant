import MessageFormatter from "./message-formatter";

interface MessageProps {
  message?: string;
}

const Bubble = ({
  message,
  align = "left",
}: { align?: "left" | "right" } & MessageProps) => {
  return (
    <div
      className={`p-4 text-white rounded-2xl w-max max-w-[70%] mb-4 ${
        align === "left"
          ? "rounded-bl-none bg-[#282828] self-start"
          : "rounded-br-none bg-[#606060] self-end"
      }`}
    >
      <MessageFormatter message={message} />
    </div>
  );
};

const UserMessage = ({ message = "" }: MessageProps) => {
  return <Bubble message={message} align="right" />;
};

const AgentMessage = ({ message = "" }: MessageProps) => {
  return <Bubble message={message} />;
};

type Chat = {
  // Modal: typeof Modal;
  UserMessage: typeof UserMessage;
  AgentMessage: typeof AgentMessage;
};

export default { UserMessage, AgentMessage } as Chat;

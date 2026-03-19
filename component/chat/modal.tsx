import { Message } from "@/lib/chat-storage";
import C from "./messages";

const Modal = ({
  messages,
  loading,
}: {
  messages: Message[];
  loading?: boolean;
}) => {
  return (
    <div className="p-10 flex flex-col w-full overflow-y-auto chat-container relative">
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <C.UserMessage key={i} message={msg.content} />
        ) : (
          <C.AgentMessage key={i} message={msg.content} />
        ),
      )}

      {loading && <C.AgentMessage message="AVA is typing..." />}
    </div>
  );
};

type Chat = {
  Modal: typeof Modal;
};

export default { Modal } as Chat;

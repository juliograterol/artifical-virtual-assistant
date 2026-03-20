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
    <div className="md:p-10 py-10 px-4 flex flex-col w-full overflow-y-auto chat-container relative">
      {messages.map((msg, i) =>
        msg.role === "user" ? (
          <C.UserMessage
            key={msg.id ?? `msg-${i}`} // 👈 fallback
            message={msg.content}
          />
        ) : (
          <C.AgentMessage
            key={msg.id ?? `msg-${i}`} // 👈 fallback
            message={msg.content}
            pending={msg.pending}
          />
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

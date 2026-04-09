import { Message } from "@/lib/chat-storage";
import C from "./messages";
import { useEffect, useRef } from "react";

const Modal = ({
  messages,
  loading,
}: {
  messages: Message[];
  loading?: boolean;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    requestAnimationFrame(() => {
      el.scrollTo({
        top: el.scrollHeight,
        behavior: "smooth",
      });
    });
  }, [messages, loading]);

  return (
    <div
      ref={containerRef}
      className="md:p-10 py-10 px-4 flex flex-col w-full overflow-y-auto chat-container relative"
    >
      {messages.map((msg, i) => {
        const commonProps = {
          message: msg.content,
          status: msg.status ?? "sent",
        };
        return msg.role === "user" ? (
          <C.UserMessage key={msg.id ?? `msg-${i}`} {...commonProps} />
        ) : (
          <C.AgentMessage key={msg.id ?? `msg-${i}`} {...commonProps} />
        );
      })}
    </div>
  );
};

type Chat = {
  Modal: typeof Modal;
};

export default { Modal } as Chat;

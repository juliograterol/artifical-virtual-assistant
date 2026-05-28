import { Message } from "@/lib/chat-storage";
import C from "./messages";
import { useEffect, useMemo, useRef } from "react";
import { useFormatDate } from "@/lib/useFormatDate";
import GlassElement from "../glass-elemet/glass-element";

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

  // ✅ Group messages by date
  const groupedMessages = useMemo(() => {
    return messages.reduce(
      (acc, msg) => {
        const date = useFormatDate(msg.sentAt, "date");

        if (!acc[date]) {
          acc[date] = [];
        }

        acc[date].push(msg);

        return acc;
      },
      {} as Record<string, Message[]>,
    );
  }, [messages]);

  return (
    <main className="h-full w-full overflow-scroll chat-container">
      <div className="h-full w-full overflow-scroll modal">
        <div
          ref={containerRef}
          className="md:p-10 py-10 px-4 flex flex-col w-full overflow-y-auto relative"
        >
          {Object.entries(groupedMessages).map(([date, msgs]) => (
            <div key={date} className="flex flex-col gap-4">
              {/* Date separator */}
              <div className="flex items-center justify-center my-4">
                <GlassElement style={{ borderRadius: 100 }}>
                  <span className="text-xs text-white/75">{date}</span>
                </GlassElement>
              </div>

              {/* Messages */}
              {msgs.map((msg, i) => {
                const commonProps = {
                  message: msg.content,
                  status: msg.status ?? "sent",
                  sentAt: msg.sentAt,
                };

                return msg.role === "user" ? (
                  <C.UserMessage key={msg.id ?? `msg-${i}`} {...commonProps} />
                ) : (
                  <C.AgentMessage
                    key={msg.id ?? `msg-${i}`}
                    isNew={i === msgs.length - 1}
                    {...commonProps}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

type Chat = {
  Modal: typeof Modal;
};

export default { Modal } as Chat;

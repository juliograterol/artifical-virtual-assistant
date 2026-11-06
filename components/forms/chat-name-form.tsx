"use client";

import Input from "../input";
import Button from "../button";
import { useEffect, useState } from "react";
import { changeName, getChat } from "@/lib/chat-storage";
import { Warning } from "../warning";
import { useAlert } from "../alerts/alert";
import { getErrorMessage } from "@/lib/firebase-errors";

export default function ChatNameForm({ id }: { id: string }) {
  const [chat, setChat] = useState<{ chatId: string; name: string }>({
    chatId: id,
    name: "chat-" + id,
  });
  const [previousName, setPreviousName] = useState<string>("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const alert = useAlert(); // the modal this form is shown in

  useEffect(() => {
    const fetchChatName = async () => {
      try {
        const data = await getChat(id);
        if (data && data.name) {
          const chatName = data.name;
          setChat((prev) => ({
            ...prev,
            name: chatName,
          }));
          setPreviousName(chatName);
        }
      } catch (e) {
        setError(getErrorMessage(e, "Couldn't load the chat name."));
      }
    };
    fetchChatName();
  }, []);

  const updateChatName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (chat.name === previousName || saving) return;

    setSaving(true);
    setError("");
    try {
      await changeName(chat);
      alert?.close(true); // ✅ close the modal once saved
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save the name. Try again."));
      setSaving(false);
    }
  };

  return (
    <form
      className="p-10 flex flex-col gap-4 items-center w-full md:max-w-lg sm:max-w-md"
      onSubmit={updateChatName}
    >
      <h1 className="md:text-5xl sm:text-4xl text-3xl font-medium leading-4">
        Change Name
      </h1>
      <h2>Label Your Thoughts</h2>
      <Input
        placeholder="Chat Name"
        value={chat.name}
        onChange={(e) => {
          setChat({ ...chat, name: e.target.value });
        }}
      />
      <Warning
        message="Give this conversation a specific name so you can find it easily later. A clear title today saves a lot of searching tomorrow."
        status="danger"
      />
      {error && <Warning message={error} status="danger" />}
      <div className="flex max-md:flex-col w-full gap-4">
        <Button
          label="Reset"
          type="button"
          disabled={chat.name === previousName}
          onClick={(e) => {
            e.preventDefault();
            setChat((prev) => ({
              ...prev,
              name: previousName,
            }));
          }}
          dark
        />
        <Button
          label="Save"
          type="submit"
          disabled={chat.name === previousName || !chat.name.trim() || saving}
        />
      </div>
    </form>
  );
}

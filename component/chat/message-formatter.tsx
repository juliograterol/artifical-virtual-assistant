import { useEffect, useState } from "react";

type Props = {
  message?: string;
};

export default function MessageFormatter({ message = "" }: Props) {
  const [formattedMessage, setFormattedMessage] = useState("");

  useEffect(() => {
    let text = message;

    // ### -> h3
    text = text.replace(/^### (.*$)/gim, "<h3>$1</h3>");

    // ## -> h2
    text = text.replace(/^## (.*$)/gim, "<h2>$1</h2>");

    // # -> h1
    text = text.replace(/^# (.*$)/gim, "<h1>$1</h1>");

    // **bold**
    text = text.replace(/\*\*(.*?)\*\*/gim, "<strong>$1</strong>");

    // line breaks
    text = text.replace(/\n/g, "<br />");

    setFormattedMessage(text);
  }, [message]);

  return <div dangerouslySetInnerHTML={{ __html: formattedMessage }} />;
}

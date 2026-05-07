"use client";

import "./styles.css";
import React, { useRef, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import type { Components } from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

function parseInline(text: string) {
  const regex = /{{(.*?)}}/g;
  const parts: (string | { key: string })[] = [];

  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    const index = match.index;

    if (index > lastIndex) {
      parts.push(text.slice(lastIndex, index));
    }

    parts.push({ key: match[1].trim() });
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts;
}

type MsgProps = {};

export default function MessageFormatter({
  message,
  editable,
  onChange,
  isNew,
}: {
  message: string;
  editable?: boolean;
  onChange?: (final: string, values: Record<string, string>) => void;
  isNew?: boolean;
}) {
  const valuesRef = useRef<Record<string, string>>({});

  const buildFinal = () => {
    const final = message.replace(/{{(.*?)}}/g, (_, k) => {
      return valuesRef.current[k.trim()] || "";
    });

    onChange?.(final, valuesRef.current);
  };

  const components: Components = useMemo(
    () => ({
      h1: ({ children }) => (
        <h1 className="text-2xl font-bold mt-4 mb-2 pt-2 border-t border-white/25">
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2 className="text-xl font-semibold mt-3 mb-2 pt-2 border-t border-white/25">
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3 className="text-lg font-semibold mt-2 mb-1 pt-2 border-t border-white/25">
          {children}
        </h3>
      ),

      p: ({ children, node }) => {
        if (!editable) {
          let wordIndex = 0;

          const process = (child: any): any => {
            // TEXT NODE → split into words
            if (typeof child === "string") {
              return child.split(" ").map((word: string, i: number) => {
                const currentIndex = wordIndex++;

                return (
                  <span
                    key={`word-${currentIndex}`}
                    className={isNew ? "new-message inline-block" : ""}
                    style={{
                      animationDelay: isNew ? `${currentIndex * 0.03}s` : "0s",
                    }}
                  >
                    {word}&nbsp;
                  </span>
                );
              });
            }

            // ELEMENT NODE → recurse
            if (child?.props?.children) {
              return React.cloneElement(child, {
                ...child.props,
                children: React.Children.map(child.props.children, process),
              });
            }

            return child;
          };

          return (
            <p className="leading-relaxed mb-2">
              {React.Children.map(children, process)}
            </p>
          );
        }

        const content = String(children ?? "");
        const parts = parseInline(content);

        return (
          <p className="leading-relaxed mb-2">
            {parts.map((part, i) => {
              if (typeof part === "string") {
                return <span key={`text-${i}`}>{part}</span>;
              }

              return (
                <input
                  key={part.key}
                  required
                  placeholder={part.key + " *"}
                  defaultValue={valuesRef.current[part.key] || ""}
                  onChange={(e) => {
                    valuesRef.current[part.key] = e.target.value;
                  }}
                  onBlur={buildFinal} // optional: sync on blur
                  className="border-b border-white/20 px-2 py-1 text-sm outline-none focus:border-white/50"
                />
              );
            })}
          </p>
        );
      },

      ul: ({ children }) => <ul className="list-disc pl-6 mb-2">{children}</ul>,

      ol: ({ children }) => (
        <ol className="list-decimal pl-6 mb-2">{children}</ol>
      ),

      li: ({ children }) => <li className="mb-2">{children}</li>,

      code({ children }) {
        return (
          <code className="bg-[#1e1e1e] px-1 py-0.5 rounded text-sm">
            {children}
          </code>
        );
      },

      a: ({ href, children }) => (
        <a href={href} target="_blank" className="text-blue-400 underline">
          {children}
        </a>
      ),

      blockquote: ({ children }) => (
        <blockquote className="border-l-4 border-gray-500 pl-3 italic opacity-80 my-2">
          {children}
        </blockquote>
      ),

      table: ({ children }) => (
        <table className="table-auto border-collapse my-3">{children}</table>
      ),

      th: ({ children }) => (
        <th className="border px-2 py-1 bg-[#333]">{children}</th>
      ),

      td: ({ children }) => <td className="border px-2 py-1">{children}</td>,
    }),
    [editable, message],
  );

  return (
    <div className="gap-2 leading-relaxed">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={components}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
}

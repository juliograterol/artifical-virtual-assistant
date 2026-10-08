"use client";

import { useSettings } from "@/lib/useSettings";
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

// Long replies shouldn't take forever to finish appearing
const WORD_DELAY_S = 0.05;
const MAX_WORD_DELAY_S = 1.5;

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

  const { settings } = useSettings();
  const animate = !!isNew && settings.chatAnimation;

  // Blocks keep their normal display: inline-block here broke tables and list bullets
  const block = animate ? "new-message" : "";

  const components: Components = useMemo(
    () => ({
      h1: ({ children }) => (
        <h1
          className={`${block} text-xl font-bold mt-5 mb-2 pt-3 border-t border-white/15 first:mt-0 first:pt-0 first:border-t-0`}
        >
          {children}
        </h1>
      ),

      h2: ({ children }) => (
        <h2
          className={`${block} text-lg font-semibold mt-5 mb-2 pt-3 border-t border-white/15 first:mt-0 first:pt-0 first:border-t-0`}
        >
          {children}
        </h2>
      ),

      h3: ({ children }) => (
        <h3
          className={`${block} text-base font-semibold mt-4 mb-1.5 first:mt-0`}
        >
          {children}
        </h3>
      ),

      h4: ({ children }) => (
        <h4
          className={`${block} text-sm font-semibold uppercase tracking-wide text-white/70 mt-3 mb-1 first:mt-0`}
        >
          {children}
        </h4>
      ),

      p: ({ children }) => {
        if (!editable) {
          if (!animate) {
            return <p className="leading-relaxed mb-3 last:mb-0">{children}</p>;
          }

          let wordIndex = 0;

          const process = (child: any): any => {
            // TEXT NODE → animate word by word, keeping real spaces so lines still wrap
            if (typeof child === "string") {
              return child.split(/(\s+)/).map((part) => {
                if (!part.trim()) return part;

                const currentIndex = wordIndex++;

                return (
                  <span
                    key={`word-${currentIndex}`}
                    className="new-message inline-block"
                    style={{
                      animationDelay: `${Math.min(currentIndex * WORD_DELAY_S, MAX_WORD_DELAY_S)}s`,
                    }}
                  >
                    {part}
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
            <p className="leading-relaxed mb-3 last:mb-0">
              {React.Children.map(children, process)}
            </p>
          );
        }

        const content = String(children ?? "");
        const parts = parseInline(content);

        return (
          <p className={`${block} leading-relaxed mb-2`}>
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

      strong: ({ children }) => (
        <strong className="font-semibold text-white">{children}</strong>
      ),

      ul: ({ children }) => (
        <ul
          className={`${block} list-disc pl-5 mb-3 last:mb-0 space-y-1 marker:text-white/40`}
        >
          {children}
        </ul>
      ),

      ol: ({ children }) => (
        <ol
          className={`${block} list-decimal pl-5 mb-3 last:mb-0 space-y-1 marker:text-white/50`}
        >
          {children}
        </ol>
      ),

      li: ({ children }) => (
        <li className="pl-1 leading-relaxed [&>p]:mb-1 [&>ul]:mt-1 [&>ol]:mt-1 [&>ul]:mb-0 [&>ol]:mb-0">
          {children}
        </li>
      ),

      // Inline vs. block styling lives in styles.css (.chat-markdown)
      code: ({ className, children }) => (
        <code className={className}>{children}</code>
      ),

      pre: ({ children }) => (
        <pre
          className={`${block} my-3 overflow-x-auto rounded-xl border border-white/10 bg-[#1e1e1e] p-3 text-sm leading-relaxed`}
        >
          {children}
        </pre>
      ),

      a: ({ href, children }) => (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline underline-offset-2 hover:text-blue-300 wrap-break-word"
        >
          {children}
        </a>
      ),

      blockquote: ({ children }) => (
        <blockquote
          className={`${block} border-l-2 border-white/30 pl-3 italic text-white/80 my-3`}
        >
          {children}
        </blockquote>
      ),

      hr: () => <hr className="my-4 border-white/15" />,

      // Scrolls horizontally inside the bubble instead of overflowing it
      table: ({ children }) => (
        <div
          className={`${block} my-3 w-full overflow-x-auto rounded-xl border border-white/10 bg-black/20`}
        >
          <table className="w-full border-collapse text-sm">{children}</table>
        </div>
      ),

      thead: ({ children }) => <thead className="bg-white/5">{children}</thead>,

      tr: ({ children }) => (
        <tr className="border-b border-white/5 last:border-b-0 transition-colors hover:bg-white/3">
          {children}
        </tr>
      ),

      th: ({ children, style }) => (
        <th
          style={style}
          className="px-3 py-2 text-left font-semibold text-white/80 whitespace-nowrap border-b border-white/10"
        >
          {children}
        </th>
      ),

      td: ({ children, style }) => (
        <td style={style} className="px-3 py-2 align-top leading-snug">
          {children}
        </td>
      ),
    }),
    [editable, message, animate, block],
  );

  return (
    <div className="chat-markdown leading-relaxed wrap-break-word">
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

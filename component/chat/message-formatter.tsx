"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.css";

export default function MessageFormatter({ message }: { message: string }) {
  return (
    <div className="prose prose-invert max-w-none break-words">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          // 👇 Custom styling per element
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
          p: ({ children }) => (
            <p className="leading-relaxed mb-2">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-6 mb-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-6 mb-2">{children}</ol>
          ),
          li: ({ children }) => <li className="mb-2">{children}</li>,

          // 🔥 Code blocks
          code({ inline, className, children, ...props }: any) {
            return inline ? (
              <code className="bg-[#1e1e1e] px-1 py-0.5 rounded text-sm">
                {children}
              </code>
            ) : (
              <pre className="bg-[#1e1e1e] p-3 rounded-xl overflow-x-auto text-sm my-2">
                <code className={className}>{children}</code>
              </pre>
            );
          },

          // 🔗 Links
          a: ({ href, children }) => (
            <a href={href} target="_blank" className="text-blue-400 underline">
              {children}
            </a>
          ),

          // 🧾 Blockquote
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-500 pl-3 italic opacity-80 my-2">
              {children}
            </blockquote>
          ),

          // 📊 Tables
          table: ({ children }) => (
            <table className="table-auto border-collapse my-3">
              {children}
            </table>
          ),
          th: ({ children }) => (
            <th className="border px-2 py-1 bg-[#333]">{children}</th>
          ),
          td: ({ children }) => (
            <td className="border px-2 py-1">{children}</td>
          ),
        }}
      >
        {message}
      </ReactMarkdown>
    </div>
  );
}

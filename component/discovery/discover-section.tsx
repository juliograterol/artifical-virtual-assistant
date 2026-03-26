"use client";

import { useState } from "react";
import DiscoverItem from "./discover-item";
import DiscoverNav from "./disover-nav";
import { RefObject } from "react";
import { prompts, type PromptTab } from "./prompts";

export default function Discover({
  headerRef,
}: {
  headerRef: RefObject<HTMLElement | null>;
}) {
  const [tab, setTab] = useState<PromptTab | "recommended">("recommended");
  const [search, setSearch] = useState("");

  const getRecommendedPrompts = () => {
    return Object.values(prompts).flatMap((tabPrompts) =>
      tabPrompts.slice(0, 4),
    );
  };

  const currentPrompts =
    tab === "recommended" ? getRecommendedPrompts() : prompts[tab];

  const filteredPrompts = currentPrompts.filter((p) =>
    `${p.title} ${p.description}`.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <section className="w-full md:max-w-8/12 md:p-10 px-4 flex flex-col min-h-screen items-center">
      <header ref={headerRef} className="w-full">
        <div className="flex w-full md:items-center justify-between mb-4 max-md:flex-col items-start">
          <h2 className="text-4xl text-white text-center font-medium mb-4">
            Discover
          </h2>

          <div className="p-2 border-2 border-[#404040] rounded-full flex gap-2 w-full md:max-w-md">
            <svg
              width="21"
              height="21"
              viewBox="0 0 21 21"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M16.3497 16.3497L19 19 M15.6866 5.25476C12.8274 2.35264 8.15688 2.31787 5.25476 5.1771C2.35264 8.03632 2.31786 12.7068 5.17709 15.6089C8.03632 18.5111 12.7068 18.5458 15.6089 15.6866C18.5111 12.8274 18.5458 8.15688 15.6866 5.25476Z"
                stroke="#606060"
                strokeWidth="2"
              />
            </svg>
            <input
              className="outline-none bg-transparent text-white w-full"
              placeholder="Search prompts..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="none"
              viewBox="0 0 24 24"
              className={`transition-all duration-150 cursor-pointer ${search ? "opacity-100" : " opacity-0"}`}
              onClick={() => setSearch("")}
            >
              <path
                stroke="#606060"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18 17.94 6M18 18 6.06 6"
              />
            </svg>
          </div>
        </div>

        {/* ✅ type-safe */}
        <DiscoverNav onChange={setTab} />
      </header>

      <div className="py-8 w-full grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        {filteredPrompts.map((prompt) => (
          <DiscoverItem key={prompt.title} {...prompt} />
        ))}
      </div>
    </section>
  );
}

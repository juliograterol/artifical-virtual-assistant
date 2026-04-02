"use client";

import { useState } from "react";
import DiscoverItem from "./discover-item";
import DiscoverNav from "./disover-nav";
import { RefObject } from "react";
import { prompts, type PromptTab } from "./prompts";
import SearchInput from "../search-input";

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
    <section
      id={"prompt-templates"}
      className="w-full md:max-w-8/12 md:p-10 px-4 flex flex-col min-h-screen items-center"
    >
      <header ref={headerRef} className="w-full">
        <div className="flex w-full md:items-center justify-between mb-4 max-md:flex-col items-start">
          <h2 className="text-4xl text-white text-center font-medium mb-4">
            Discover
          </h2>

          <SearchInput
            value={search}
            onSearch={setSearch}
            placeholder="Search prompts..."
          />
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

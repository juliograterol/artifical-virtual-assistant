"use client";

import { useRef } from "react";
import DiscoverItem from "./discover-item";
import DiscoverNav from "./disover-nav";
import { RefObject } from "react";
import { prompts } from "./prompts";

export default function Discover({
  headerRef,
}: {
  headerRef: RefObject<HTMLElement | null>;
}) {
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
            <input className="outline-none" placeholder="Search..." />
          </div>
        </div>
        <DiscoverNav />
      </header>
      <div className="py-8 w-full grid md:grid-cols-4 sm:grid-cols-2 gap-4">
        {prompts.map((prompt, i) => {
          return <DiscoverItem key={i} {...prompt} />;
        })}
      </div>
    </section>
  );
}

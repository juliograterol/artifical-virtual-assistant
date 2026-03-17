"use client";

import { useEffect, useRef, useState } from "react";
import GlassElement from "../glass-elemet/glass-element";

export default function Discover() {
  const [active, setActive] = useState(0);

  const containerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [style, setStyle] = useState({
    left: 0,
    width: 0,
    height: 0,
  });

  useEffect(() => {
    const el = itemRefs.current[active];
    const container = containerRef.current;

    if (el && container) {
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();

      setStyle({
        left: elRect.left - containerRect.left,
        width: elRect.width,
        height: elRect.height,
      });
    }
  }, [active]);

  return (
    <section className="w-full p-10 flex flex-col min-h-screen items-start">
      <div className="flex w-full items-center justify-between mb-4">
        <h2 className="text-4xl text-white text-center font-medium mb-4">
          Discover
        </h2>
        <div className="p-2 border-2 border-[#404040] rounded-full flex gap-2">
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
              stroke-width="2"
            />
          </svg>
          <input className="outline-none" placeholder="Search..." />
        </div>
      </div>
      <nav className="rounded-full bg-[#282828] px-4 py-3 w-full relative flex justify-center items-center">
        {/* 🔥 Moving glass */}
        <GlassElement
          className="absolute transition-all duration-300 mx-4 z-10"
          style={{
            left: style.left,
            width: style.width,
            height: "80%",
          }}
        />

        <ul
          ref={containerRef}
          className="flex items-center gap-4 w-full relative"
        >
          {[
            "Recommended",
            "General",
            "Sales Agent",
            "Marketing Specialist",
            "IT Support",
            "Scheduler",
            "Dispatcher",
          ].map((item, i) => (
            <li
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              onClick={() => setActive(i)}
              className={`${active === i ? "z-10" : "z-0"} cursor-pointer px-3 py-1 select-none`}
            >
              {item}
            </li>
          ))}
        </ul>
      </nav>
    </section>
  );
}

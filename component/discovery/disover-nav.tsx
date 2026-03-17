"use client";

import { useEffect, useRef, useState } from "react";
import GlassElement from "../glass-elemet/glass-element";

export default function DiscoverNav() {
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
    <nav className="rounded-full bg-[#282828] px-2 py-3 w-full relative flex justify-center items-center">
      <GlassElement
        className="absolute transition-all duration-300 mx-2 z-10"
        style={{
          left: style.left,
          width: style.width,
          height: "80%",
        }}
      >
        <div className="bg-whit"></div>
      </GlassElement>

      <ul
        ref={containerRef}
        className="flex items-center gap-4 w-full relative max-md:overflow-scroll"
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
  );
}

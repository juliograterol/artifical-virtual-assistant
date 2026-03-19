"use client";

import { useEffect, useRef, useState } from "react";
import GlassElement from "../glass-elemet/glass-element";
import { useIsMobile } from "@/lib/useMobile";

export default function DiscoverNav() {
  const [active, setActive] = useState(0);

  const containerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [isPointerDown, setIsPointerDown] = useState<boolean>(false);
  const isMobile = useIsMobile();

  const [style, setStyle] = useState({
    width: 0,
    height: 0,
    x: 0,
  });

  useEffect(() => {
    const updatePosition = () => {
      const el = itemRefs.current[active];
      const container = containerRef.current;

      if (el && container) {
        const elRect = el.getBoundingClientRect();
        const containerRect = container.getBoundingClientRect();

        setStyle({
          x: el.offsetLeft - container.scrollLeft,
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      }
    };

    updatePosition();

    const container = containerRef.current;
    if (container) {
      container.addEventListener("scroll", updatePosition);
    }

    window.addEventListener("resize", updatePosition);

    return () => {
      if (container) {
        container.removeEventListener("scroll", updatePosition);
      }
      window.removeEventListener("resize", updatePosition);
    };
  }, [active]);

  return (
    <nav
      onPointerDown={() => setIsPointerDown(true)}
      onPointerUp={() => setIsPointerDown(false)}
      className="rounded-full bg-[#282828] px-2 py-3 w-full relative flex justify-center items-center group/bar max-md:overflow-x-hidden"
    >
      <GlassElement
        className={`absolute transition-all mx-2 z-10 ${isPointerDown && isMobile ? "duration-0" : "duration-300"}`}
        theme="medium"
        rounded
        style={{
          left: style.x,
          width: style.width,
          height: "80%",
        }}
      />

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
            className={`${active === i ? "z-10" : "z-0"} cursor-pointer px-3 py-1 select-none min-w-max`}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
}

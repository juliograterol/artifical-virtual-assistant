"use client";

import { useEffect, useRef, useState } from "react";
import GlassElement from "../glass-elemet/glass-element";
import { useIsMobile } from "@/lib/useMobile";
import { prompts, type PromptTab } from "./prompts";

export default function DiscoverNav({
  onChange,
}: {
  onChange?: (tab: PromptTab) => void;
}) {
  const [active, setActive] = useState(0);

  const containerRef = useRef<HTMLUListElement | null>(null);
  const itemRefs = useRef<(HTMLLIElement | null)[]>([]);

  const [isPointerDown, setIsPointerDown] = useState(false);
  const isMobile = useIsMobile();

  const [style, setStyle] = useState({
    width: 0,
    height: 0,
    x: 0,
  });

  // ✅ dynamic tabs from prompts
  const tabs: { label: string; key: PromptTab }[] = Object.keys(prompts).map(
    (key) => ({
      key: key as PromptTab,
      label: key.charAt(0).toUpperCase() + key.slice(1),
    }),
  );

  const handleActive = (index: number) => {
    setActive(index);
    onChange?.(tabs[index].key);
  };

  // ✅ set initial tab
  useEffect(() => {
    onChange?.(tabs[0].key);
  }, []);

  useEffect(() => {
    const updatePosition = () => {
      const el = itemRefs.current[active];
      const container = containerRef.current;

      if (el && container) {
        setStyle({
          x: el.offsetLeft - container.scrollLeft,
          width: el.offsetWidth,
          height: el.offsetHeight,
        });
      }
    };

    updatePosition();

    const container = containerRef.current;
    container?.addEventListener("scroll", updatePosition);
    window.addEventListener("resize", updatePosition);

    return () => {
      container?.removeEventListener("scroll", updatePosition);
      window.removeEventListener("resize", updatePosition);
    };
  }, [active]);

  // ✅ auto scroll active into view (mobile polish)
  useEffect(() => {
    const el = itemRefs.current[active];
    el?.scrollIntoView({ behavior: "smooth", inline: "center" });
  }, [active]);

  return (
    <nav
      onPointerDown={() => setIsPointerDown(true)}
      onPointerUp={() => setIsPointerDown(false)}
      onKeyDown={(e) => {
        if (e.key === "ArrowRight")
          setActive((prev) => (prev + 1) % tabs.length);
        if (e.key === "ArrowLeft")
          setActive((prev) => (prev - 1 + tabs.length) % tabs.length);
      }}
      tabIndex={0}
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
        {tabs.map((item, i) => (
          <li
            key={item.key} // ✅ stable key
            ref={(el) => {
              itemRefs.current[i] = el;
            }}
            className={active === i ? "z-10" : "z-0"}
          >
            <button
              className={`cursor-pointer px-3 py-1 select-none min-w-max 
                ${item.label.length <= 2 ? "uppercase" : "capitalize"} disabled:text-[#606060] disabled:cursor-not-allowed`}
              disabled={prompts[item.key].length === 0}
              onClick={() => handleActive(i)}
            >
              {item.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}

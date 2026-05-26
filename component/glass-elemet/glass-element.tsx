"use client";

import "./glass.css";
import { useSettings } from "@/lib/useSettings";

export default function GlassElement({
  children,
  className,
  rounded = 10,
  style = { borderRadius: 10 },
  theme = "dark",
}: {
  children?: React.ReactNode;
  className?: string;
  rounded?: number | true;
  theme?: "dark" | "light" | "shiny" | "medium" | "";
  style?: React.CSSProperties;
}) {
  const { settings } = useSettings();

  return (
    <div
      className={`
        ${settings.glassEffect ? "glass" : "p-2.5 bg-[#1B1B1B]"}
        ${theme}
        ${className}
        ${rounded ? "rounded-full" : ""}
      `}
      style={style}
    >
      {children}
    </div>
  );
}

import { useEffect, useState } from "react";
import "./glass.css";

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
  const [glassEffect, setGlassEffect] = useState(true);

  useEffect(() => {
    const loadSettings = () => {
      const settings = JSON.parse(
        localStorage.getItem("appearance-settings") || "{}",
      );

      setGlassEffect(settings.glassEffect ?? true);
    };

    loadSettings();

    window.addEventListener("storage", loadSettings);

    return () => {
      window.removeEventListener("storage", loadSettings);
    };
  }, []);

  return (
    <div
      className={`${glassEffect ? "glass" : " p-2.5 bg-[#1B1B1B]"} ${theme} ${className} ${rounded ? "rounded-full" : ``}`}
      style={style}
    >
      {children}
    </div>
  );
}

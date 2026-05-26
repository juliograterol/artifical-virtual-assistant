"use client";

import Image from "next/image";
import { useSettings } from "@/lib/useSettings";

const backgrounds = [
  {
    id: "image",
    src: "/bg.png",
    animated: false,
    type: "image",
  },
  {
    id: "video",
    src: "/bg-loop.mp4",
    animated: true,
    type: "video",
  },
  {
    id: "none",
    value: "none",
    type: "none",
  },
] as const;

export default function BackgroundSelector() {
  const { settings, setSettings } = useSettings();

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-2">
      {backgrounds.map((bg) => {
        const isSelected =
          bg.type === "none"
            ? settings.background === "none"
            : settings.background !== "none" &&
              settings.background.src === bg.src;

        return (
          <label
            key={bg.id}
            className={`
              relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all
              min-h-[20vh]
              ${isSelected ? "border-white scale-[0.98]" : "border-[#404040]"}
            `}
          >
            {/* hidden radio */}
            <input
              type="radio"
              name="background"
              className="hidden"
              checked={isSelected}
              onChange={() => {
                if (bg.type === "none") {
                  setSettings((prev) => ({
                    ...prev,
                    background: "none",
                  }));

                  return;
                }

                setSettings((prev) => ({
                  ...prev,
                  background: {
                    src: bg.src,
                    animated: bg.animated,
                  },
                }));
              }}
            />

            {/* preview */}
            {bg.type === "image" && (
              <Image
                src={bg.src}
                alt="Background"
                fill
                className="object-cover"
              />
            )}

            {bg.type === "video" && (
              <video
                className="absolute inset-0 w-full h-full object-cover"
                src={bg.src}
                autoPlay
                loop
                muted
                playsInline
              />
            )}

            {bg.type === "none" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1B1B1B]">
                None
              </div>
            )}

            {/* selection indicator */}
            <div
              className={`
                absolute top-2 right-2 w-5 h-5 rounded-full border
                ${
                  isSelected
                    ? "bg-white border-white"
                    : "bg-black/50 border-white/50"
                }
              `}
            />
          </label>
        );
      })}
    </div>
  );
}

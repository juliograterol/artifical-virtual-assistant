"use client";

import Image from "next/image";
import { useSettings } from "@/lib/useSettings";
import { backgrounds } from "@/lib/backgrounds";
import Silk from "../Silk";
import Input from "../input";

export default function BackgroundSelector() {
  const { settings, setSettings } = useSettings();

  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-3">
      {backgrounds.map((bg) => {
        const isSelected =
          bg.type === "none"
            ? settings.background === "none"
            : settings.background !== "none" &&
              settings.background.id === bg.id;

        const hasStatic = !!bg.variants?.static;
        const hasAnimated = !!bg.variants?.animated;

        const preview = bg.variants?.animated ?? bg.variants?.static;

        return (
          <label
            key={bg.id}
            className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all
              min-h-[20vh]
              ${isSelected ? "border-white scale-[0.98]" : "border-[#404040]"}`}
          >
            <input
              type="radio"
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
                    id: bg.id,
                    animated:
                      prev.background !== "none"
                        ? prev.background.animated
                        : !!bg.variants?.animated,
                  },
                }));
              }}
            />

            {/* Preview */}

            {bg.type === "image" && preview?.endsWith(".mp4") && (
              <video
                src={preview}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {bg.type === "image" && preview && !preview.endsWith(".mp4") && (
              <Image
                src={preview}
                alt={bg.label}
                fill
                className="object-cover"
              />
            )}

            {bg.type === "video" && (
              <video
                src={preview}
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            {bg.type === "silk" && (
              <div className="absolute inset-0 w-full h-full">
                <Silk
                  speed={5}
                  scale={1}
                  color="#282828"
                  noiseIntensity={1.5}
                />
              </div>
            )}

            {bg.type === "none" && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#1b1b1b]">
                None
              </div>
            )}

            {/* Selection */}

            <div
              className={`absolute top-2 right-2 w-5 h-5 rounded-full border
                ${
                  isSelected
                    ? "bg-white border-white"
                    : "bg-black/50 border-white/50"
                }`}
            />
          </label>
        );
      })}
    </div>
  );
}

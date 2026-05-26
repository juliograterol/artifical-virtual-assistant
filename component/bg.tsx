"use client";
import { useSettings } from "@/lib/useSettings";
import Image from "next/image";

export default function Background() {
  const { settings } = useSettings();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#1B1B1B]">
      {settings.background !== "none" ? (
        settings.background.animated ? (
          <video
            className="w-full h-full object-cover"
            src="/bg-loop.mp4"
            autoPlay
            loop
            muted
            playsInline
          />
        ) : (
          <Image
            src={settings.background.src}
            alt="background"
            width={1080}
            height={1080}
            className="w-full h-full object-cover"
          />
        )
      ) : null}
    </div>
  );
}

"use client";

import Image from "next/image";
import { useSettings } from "@/lib/useSettings";
import { backgrounds } from "@/lib/backgrounds";
import Silk from "./Silk";

export default function Background() {
  const { settings } = useSettings();

  if (settings.background === "none")
    return <div className="fixed inset-0 -z-10 bg-black" />;

  const selected = backgrounds.find((bg) => {
    if (settings.background !== "none") return bg.id === settings.background.id;
  });

  if (!selected) return <div className="fixed inset-0 -z-10 bg-black" />;

  const asset = settings.background.animated
    ? selected.variants?.animated
    : selected.variants?.static;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-black">
      {selected.type === "silk" ? (
        <Silk
          speed={settings.background.animated ? 5 : 1}
          scale={1}
          color="#282828"
          noiseIntensity={1.5}
        />
      ) : asset?.endsWith(".mp4") ? (
        <video
          src={asset}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      ) : asset ? (
        <Image
          src={asset}
          alt="Background"
          fill
          priority
          className="object-cover"
        />
      ) : null}
    </div>
  );
}

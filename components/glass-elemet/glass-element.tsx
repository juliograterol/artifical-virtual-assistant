"use client";

import "./glass.css";
import GlassSurface, { GlassSurfaceProps } from "../GlassSurface";
import { useSettings } from "@/lib/useSettings";

type GlassElementProps = GlassSurfaceProps & {
  theme?: "dark" | "light" | "shiny" | "medium" | "";
  rounded?: number | true;
};

export default function GlassElement({
  children,
  className,
  rounded = 10,
  theme = "dark",
  style,
  width = "100%",
  height = "100%",
  borderRadius,
  borderWidth,
  brightness,
  opacity,
  blur,
  displace = 2,
  backgroundOpacity = 0.2,
  saturation,
  distortionScale,
  redOffset,
  greenOffset,
  blueOffset,
  xChannel,
  yChannel,
  mixBlendMode,
}: GlassElementProps) {
  const { settings } = useSettings();

  const mergedStyle: React.CSSProperties = {
    ...style,
  };

  const radius =
    borderRadius ?? (typeof rounded === "number" ? rounded : rounded ? 100 : 0);

  if (!settings.glassEffect) {
    return (
      <div
        className={`
        ${settings.glassEffect ? "glass" : "p-2.5 glass"}
        ${theme}
        ${className}
        ${rounded ? "rounded-full" : ""}
      `}
        style={{
          width: width,
          height: height,
          ...mergedStyle,
          borderRadius: radius,
        }}
      >
        {children}
      </div>
    );
  }

  return (
    <GlassSurface
      className={`${className}`}
      style={mergedStyle}
      width={width}
      height={height}
      borderRadius={radius}
      borderWidth={borderWidth}
      brightness={brightness}
      opacity={opacity}
      blur={blur}
      displace={displace}
      backgroundOpacity={backgroundOpacity}
      saturation={saturation}
      distortionScale={distortionScale}
      redOffset={redOffset}
      greenOffset={greenOffset}
      blueOffset={blueOffset}
      xChannel={xChannel}
      yChannel={yChannel}
      mixBlendMode={mixBlendMode}
    >
      <div className={"w-full h-full"}>{children}</div>
    </GlassSurface>
  );
}

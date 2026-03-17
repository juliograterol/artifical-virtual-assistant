import "./glass.css";

export default function GlassElement({
  children,
  className,
  borderRadius = "full",
}: {
  children?: React.ReactNode;
  className?: string;
  borderRadius?: number | "full";
}) {
  return (
    <div className="wrapper transition-all flex justify-center items-center">
      <div
        className={`liquidGlass-wrapper ${borderRadius === "full" ? "rounded-full" : `rounded-[${borderRadius}px]`} ${className}`}
      >
        <div
          className={`liquidGlass-effect w-full ${borderRadius === "full" ? "rounded-full" : `rounded-[${borderRadius}px]`}`}
        ></div>
        <div
          className={`liquidGlass-tint w-full ${borderRadius === "full" ? "rounded-full" : `rounded-[${borderRadius}px]`}`}
        ></div>
        <div
          className={`liquidGlass-shine w-full ${borderRadius === "full" ? "rounded-full" : `rounded-[${borderRadius}px]`}`}
        ></div>
        <div
          className={`liquidGlass-text w-full ${borderRadius === "full" ? "rounded-full" : `rounded-[${borderRadius}px]`}`}
        >
          {children}
        </div>
      </div>
      <svg>
        <filter
          id="glass-distortion"
          x="0%"
          y="0%"
          width="100%"
          height="100%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.01 0.01"
            numOctaves="1"
            seed="5"
            result="turbulence"
          />

          <feComponentTransfer in="turbulence" result="mapped">
            <feFuncR type="gamma" amplitude="1" exponent="10" offset="0.5" />
            <feFuncG type="gamma" amplitude="0" exponent="1" offset="0" />
            <feFuncB type="gamma" amplitude="0" exponent="1" offset="0.5" />
          </feComponentTransfer>

          <feGaussianBlur in="turbulence" stdDeviation="3" result="softMap" />

          <feSpecularLighting
            in="softMap"
            surfaceScale="5"
            specularConstant="1"
            specularExponent="100"
            lightingColor="white"
            result="specLight"
          >
            <fePointLight x="-200" y="-200" z="300" />
          </feSpecularLighting>

          <feComposite
            in="specLight"
            operator="arithmetic"
            k1="0"
            k2="1"
            k3="1"
            k4="0"
            result="litImage"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="softMap"
            scale="150"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>
    </div>
  );
}

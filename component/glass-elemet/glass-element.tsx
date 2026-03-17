import "./glass.css";

export default function GlassElement({
  children,
  className,
  rounded = 25,
  style = {},
}: {
  children?: React.ReactNode;
  className?: string;
  rounded?: number | "full";
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={`glass ${className} ${rounded === "full" ? "rounded-full" : `rounded-[${rounded}px]`}`}
      style={style}
    >
      {children}
    </div>
  );
}

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
  return (
    <div
      className={`glass ${theme} ${className} ${rounded ? "rounded-full" : ``}`}
      style={style}
    >
      {children}
    </div>
  );
}

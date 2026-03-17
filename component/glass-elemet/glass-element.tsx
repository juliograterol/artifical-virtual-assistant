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
  return <div className="glass">{children}</div>;
}

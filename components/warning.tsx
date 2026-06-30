import AlertIcon from "./alerts/alert-icon";

type WarningProps = (
  | {
      message: string;
    }
  | { children: React.ReactNode }
) & {
  status?: "info" | "warning" | "success" | "danger";
};

export const Warning = (props: WarningProps) => {
  const statusColor =
    props.status === "success"
      ? "#05df72"
      : props.status === "warning"
        ? "#ffba00"
        : props.status === "danger"
          ? "#FF4C4C"
          : "#FFFFFF";

  return (
    <p className="text-sm flex items-center justify-center gap-2">
      <AlertIcon
        icon="warning"
        size={15}
        color={statusColor}
        // message="AVA is still in development"
      />
      {"children" in props ? props.children : props.message}
    </p>
  );
};

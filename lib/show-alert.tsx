"use client";

import { createRoot } from "react-dom/client";
import Alert, { AlertProps } from "@/components/alerts/alert";
import { getErrorMessage } from "./firebase-errors";

/**
 * Shows a failed Firebase call to the user instead of failing silently.
 */
export function showError(title: string, err: unknown, fallback?: string) {
  console.error(`${title}:`, err);

  return showAlert({
    icon: "warning",
    title,
    message: getErrorMessage(err, fallback),
  });
}

export function showAlert(options: AlertProps): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    const root = createRoot(container);

    const cleanup = () => {
      root.unmount();
      container.remove();
    };

    root.render(
      <Alert
        {...options}
        onCancel={() => {
          options.onCancel?.();

          cleanup();
          resolve(false);
        }}
        onConfirm={() => {
          options.onConfirm?.();

          cleanup();
          resolve(true);
        }}
      />,
    );
  });
}

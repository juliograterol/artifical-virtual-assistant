"use client";

import { createRoot } from "react-dom/client";
import Alert, { AlertProps } from "@/component/alert";

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
          cleanup();
          resolve(false);
        }}
        onConfirm={() => {
          cleanup();
          resolve(true);
        }}
      />,
    );
  });
}

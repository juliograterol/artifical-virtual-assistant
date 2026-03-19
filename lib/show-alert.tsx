// lib/show-alert.tsx
"use client";

import Alert from "@/component/alert";
import { createRoot } from "react-dom/client";

type ShowAlertOptions = {
  title?: string;
  message: string;
};

export function showAlert({
  title,
  message,
}: ShowAlertOptions): Promise<boolean> {
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
        title={title}
        message={message}
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

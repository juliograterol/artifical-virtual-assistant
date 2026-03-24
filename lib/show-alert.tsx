"use client";

import { createRoot } from "react-dom/client";
import { ReactNode } from "react";
import Alert from "@/component/alert";

type ShowAlertOptions = {
  title?: string;
  message?: string;
  description?: string;
  form?: ReactNode;
};

export function showAlert(options: ShowAlertOptions): Promise<boolean> {
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

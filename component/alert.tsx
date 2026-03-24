// components/ui/Alert.tsx
"use client";

import GlassElement from "./glass-elemet/glass-element";

type AlertProps = {
  title?: string;
  message?: string;
  description?: string;
  form?: React.ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function Alert({
  title = "Alert!",
  message,
  form,
  description,
  onCancel,
  onConfirm,
}: AlertProps) {
  return (
    <section className="absolute top-0 left-0 w-full h-full z-100 p-4 flex justify-center items-center bg-black/40 backdrop-blur-xs">
      <div className="relative">
        <GlassElement className="text-white w-full md:max-w-3xl z-10">
          {form ?? (
            <form className="w-full flex flex-col gap-4 md:p-10 p-4">
              <h1 className="md:text-5xl sm:text-4xl text-3xl font-medium leading-4">
                {title}
              </h1>
              {description && <h2>{description}</h2>}

              <p>{message}</p>

              <div className="flex gap-4 w-full justify-end font-semibold">
                <button
                  onClick={onConfirm}
                  className="bg-black rounded-full px-4 py-2 cursor-pointer"
                >
                  Continue
                </button>
              </div>
            </form>
          )}
        </GlassElement>
        {onCancel && (
          <button
            onClick={onCancel}
            className="absolute top-0 left-full -translate-x-2/3 m-2 z-20"
          >
            <GlassElement
              className="aspect-square w-8 h-8 flex items-center justify-center cursor-pointer hover:scale-105 transition"
              style={{ borderRadius: 100 }}
            >
              <svg
                width="12"
                height="12"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M9.30257 6.51913L12.4413 3.47906C12.8235 3.09686 13.0383 2.57849 13.0383 2.03798C13.0383 1.49748 12.8235 0.979108 12.4413 0.596911C12.0591 0.214715 11.5408 0 11.0003 0C10.4598 0 9.94139 0.214715 9.5592 0.596911L6.51913 3.73569L3.47906 0.596911C3.09686 0.214715 2.57849 0 2.03798 0C1.49748 0 0.979108 0.214715 0.596911 0.596911C0.214715 0.979108 0 1.49748 0 2.03798C0 2.57849 0.214715 3.09686 0.596911 3.47906L3.73569 6.51913L0.596911 9.5592C0.214715 9.94139 0 10.4598 0 11.0003C0 11.5408 0.214715 12.0591 0.596911 12.4413C0.979108 12.8235 1.49748 13.0383 2.03798 13.0383C2.57849 13.0383 3.09686 12.8235 3.47906 12.4413L6.51913 9.30257L9.5592 12.4413C9.94139 12.8235 10.4598 13.0383 11.0003 13.0383C11.5408 13.0383 12.0591 12.8235 12.4413 12.4413C12.8235 12.0591 13.0383 11.5408 13.0383 11.0003C13.0383 10.4598 12.8235 9.94139 12.4413 9.5592L9.30257 6.51913Z"
                  className="fill-[#D9D9D9] group-hover:fill-white"
                />
              </svg>
            </GlassElement>
          </button>
        )}
      </div>
    </section>
  );
}

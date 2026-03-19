// components/ui/Alert.tsx
"use client";

type AlertProps = {
  title?: string;
  message: string;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export default function Alert({
  title = "Alert!",
  message,
  onCancel,
  onConfirm,
}: AlertProps) {
  return (
    <section className="fixed inset-0 z-50 flex justify-center items-center text-white bg-black/40">
      <div className="md:w-9/12 w-full max-w-xl bg-[#282828] rounded-3xl p-4 shadow-[0_0_50px_0_#00000090] gap-4 flex flex-col">
        <strong>{title}</strong>

        <div className="bg-[#1B1B1B] p-4 rounded-2xl">
          <p>{message}</p>
        </div>

        <div className="flex gap-4 w-full justify-end font-semibold">
          <button
            onClick={onCancel}
            className="bg-white text-black rounded-full px-4 py-2 cursor-pointer"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="bg-black rounded-full px-4 py-2 cursor-pointer"
          >
            Continue
          </button>
        </div>
      </div>
    </section>
  );
}

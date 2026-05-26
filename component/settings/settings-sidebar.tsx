"use client";

import Image from "next/image";
import Link from "next/link";
import { useIsMobile } from "@/lib/useMobile";

export default function SettingsSidebar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const isMobile = useIsMobile();

  return (
    <aside
      className={`
        fixed md:relative top-0 left-0 z-50
        h-full w-[280px]
        bg-[#282828]
        border-r border-[#404040]
        transition-transform duration-300
        p-6
        flex flex-col
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0
      `}
    >
      {/* header */}
      <div className="flex items-center justify-between border-b border-[#404040] pb-4 mb-6">
        <div className="flex items-center gap-3">
          <Link href="/">
            <Image src="/ava-logo.png" alt="ava" width={28} height={28} />
          </Link>

          <h1 className="text-white text-2xl font-medium">Settings</h1>
        </div>

        {isMobile && (
          <button onClick={onClose} className="text-white text-2xl">
            <svg
              width="12"
              height="12"
              viewBox="0 0 12 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.7141 10.2941C11.9024 10.4824 12.0082 10.7378 12.0082 11.0041C12.0082 11.2704 11.9024 11.5258 11.7141 11.7141C11.5258 11.9024 11.2704 12.0082 11.0041 12.0082C10.7378 12.0082 10.4824 11.9024 10.2941 11.7141L6.00409 7.41409L1.71409 11.7141C1.52579 11.9024 1.27039 12.0082 1.00409 12.0082C0.73779 12.0082 0.482395 11.9024 0.294092 11.7141C0.105788 11.5258 0 11.2704 0 11.0041C0 10.7378 0.105788 10.4824 0.294092 10.2941L4.59409 6.00409L0.294092 1.71409C0.105788 1.52579 -1.9841e-09 1.27039 0 1.00409C1.9841e-09 0.73779 0.105788 0.482395 0.294092 0.294092C0.482395 0.105788 0.73779 1.9841e-09 1.00409 0C1.27039 -1.9841e-09 1.52579 0.105788 1.71409 0.294092L6.00409 4.59409L10.2941 0.294092C10.4824 0.105788 10.7378 0 11.0041 0C11.2704 0 11.5258 0.105788 11.7141 0.294092C11.9024 0.482395 12.0082 0.73779 12.0082 1.00409C12.0082 1.27039 11.9024 1.52579 11.7141 1.71409L7.41409 6.00409L11.7141 10.2941Z"
                fill="#ffffff"
              />
            </svg>
          </button>
        )}
      </div>

      {/* nav */}
      <nav className="flex flex-col gap-2 text-white">
        <a
          href="#account"
          className="p-3 rounded-xl hover:bg-white/5 transition"
        >
          Account
        </a>

        <a
          href="#appearance"
          className="p-3 rounded-xl hover:bg-white/5 transition"
        >
          Appearance
        </a>

        <a
          href="#memory"
          className="p-3 rounded-xl hover:bg-white/5 transition"
        >
          Memory
        </a>
      </nav>
    </aside>
  );
}

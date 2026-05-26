"use client";

import { useState } from "react";
import SettingsSidebar from "@/component/settings/settings-sidebar";
import { useIsMobile } from "@/lib/useMobile";

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    // <div className="absolute z-100 left-0 top-0 w-full h-full">
    <div className="relative h-dvh overflow-hidden bg-[#282828]">
      {/* mobile overlay */}
      {isMobile && isSidebarOpen && (
        <button
          onClick={() => setIsSidebarOpen(false)}
          className="absolute inset-0 bg-black/50 z-40"
        />
      )}

      <div
        className="
          h-full
          grid
          md:grid-cols-[280px_1fr]
          grid-cols-1
        "
      >
        <SettingsSidebar
          isOpen={isMobile ? isSidebarOpen : true}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="relative h-full overflow-y-auto">
          {/* mobile topbar */}
          {isMobile && (
            <header className="sticky top-0 z-30 flex items-center gap-4 p-4 border-b border-[#404040] bg-[#282828]/80 backdrop-blur-xl">
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="cursor-pointer"
              >
                <BarsIcon />
              </button>

              <h1 className="text-white text-xl font-medium">Settings</h1>
            </header>
          )}

          {children}
        </main>
      </div>
    </div>
    // </div>
  );
}

function BarsIcon() {
  return (
    <svg
      width="22"
      height="17"
      viewBox="0 0 22 17"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0 1.20318C0 0.884076 0.126763 0.578043 0.352403 0.352403C0.578043 0.126763 0.884076 0 1.20318 0H20.454C20.7731 0 21.0792 0.126763 21.3048 0.352403C21.5305 0.578043 21.6572 0.884076 21.6572 1.20318C21.6572 1.52228 21.5305 1.82832 21.3048 2.05396C21.0792 2.2796 20.7731 2.40636 20.454 2.40636H1.20318C0.884076 2.40636 0.578043 2.2796 0.352403 2.05396C0.126763 1.82832 0 1.52228 0 1.20318ZM20.454 7.21908H1.20318C0.884076 7.21908 0.578043 7.34584 0.352403 7.57148C0.126763 7.79712 0 8.10315 0 8.42226C0 8.74136 0.126763 9.04739 0.352403 9.27303C0.578043 9.49867 0.884076 9.62543 1.20318 9.62543H20.454C20.7731 9.62543 21.0792 9.49867 21.3048 9.27303C21.5305 9.04739 21.6572 8.74136 21.6572 8.42226C21.6572 8.10315 21.5305 7.79712 21.3048 7.57148C21.0792 7.34584 20.7731 7.21908 20.454 7.21908ZM20.454 14.4382H1.20318C0.884076 14.4382 0.578043 14.5649 0.352403 14.7906C0.126763 15.0162 0 15.3222 0 15.6413C0 15.9604 0.126763 16.2665 0.352403 16.4921C0.578043 16.7177 0.884076 16.8445 1.20318 16.8445H20.454C20.7731 16.8445 21.0792 16.7177 21.3048 16.4921C21.5305 16.2665 21.6572 15.9604 21.6572 15.6413C21.6572 15.3222 21.5305 15.0162 21.3048 14.7906C21.0792 14.5649 20.7731 14.4382 20.454 14.4382Z"
        fill="white"
      />
    </svg>
  );
}

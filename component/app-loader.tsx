"use client";

import { useEffect, useState } from "react";
import AVA from "@/component/AVA";

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [showLoader, setShowLoader] = useState(false);
  const [hideLoader, setHideLoader] = useState(false);

  useEffect(() => {
    const alreadyVisited = sessionStorage.getItem("ava-loaded");

    // only show full loader once per session
    if (!alreadyVisited) {
      setShowLoader(true);

      // simulate initial app preparation
      const timer = setTimeout(() => {
        setHideLoader(true);

        setTimeout(() => {
          setShowLoader(false);
          sessionStorage.setItem("ava-loaded", "true");
        }, 700);
      }, 2200);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {showLoader && (
        <div
          className={`
            fixed inset-0 z-[9999]
            bg-[#1B1B1B]
            flex items-center justify-center
            transition-opacity duration-700
            ${hideLoader ? "opacity-0" : "opacity-100"}
          `}
        >
          <div className="flex flex-col items-center gap-6">
            <AVA />

            <div className="flex flex-col items-center">
              <span className="text-lg font-medium tracking-wide text-white">
                Initializing AVA
              </span>

              <span className="text-sm text-white">
                Preparing your workspace...
              </span>
            </div>

            {/* subtle loading bar */}
            <div className="w-56 h-1 rounded-full overflow-hidden bg-neutral-800">
              <div className="h-full w-full animate-[loader_2s_ease-in-out_infinite] bg-white" />
            </div>
          </div>
        </div>
      )}

      <main
        className={`overflow-x-hidden w-full
          transition-opacity duration-700
          ${showLoader && !hideLoader ? "opacity-0" : "opacity-100"}
        `}
      >
        {children}
      </main>
    </>
  );
}

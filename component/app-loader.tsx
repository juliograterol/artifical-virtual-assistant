"use client";

import { useEffect, useState } from "react";
import AVA from "@/component/AVA";

export default function AppLoader({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div
          className={`fixed inset-0 z-999 bg-[#1B1B1B] flex items-center justify-center overflow-hidden 
          transition-opacity duration-700 ${loading ? "opacity-100" : "opacity-0"}`}
        >
          <AVA
            onComplete={() => {
              setLoading(false);
              const timeout = setTimeout(() => {
                setLoaded(true);
              }, 700);
              return () => clearTimeout(timeout);
            }}
          />
        </div>
      )}

      <div
        className={`overflow-x-hidden w-full
          transition-opacity duration-700
          ${loading ? "opacity-0" : "opacity-100"}
        `}
      >
        {children}
      </div>
    </>
  );
}

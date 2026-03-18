"use client";

import { useState } from "react";
import GlassElement from "../glass-elemet/glass-element";
import SidebarToggle from "./sidebar-toggle";
import SidebarHeader from "./sidebar-header";
import SidebarNav from "./sidebar-nav";
import SidebarFooter from "./sidebar-footer";
import History from "./history";

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <aside
      className={`
        fixed left-0 top-0 h-full w-full
        transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]
        ${isOpen ? "max-w-xs" : "max-w-20"}
      `}
    >
      <SidebarToggle isOpen={isOpen} onToggle={() => setIsOpen(!isOpen)} />

      <GlassElement
        className={`
          bg-[#282828] h-full flex flex-col justify-between
          transition-all duration-500
          ${isOpen && "no-glass"}
        `}
        style={{ borderRadius: 0 }}
      >
        <section>
          <SidebarHeader isOpen={isOpen} />

          <div className="relative">
            <div
              className={`
                transition-all duration-400
                ${isOpen ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}
              `}
            >
              <History />
            </div>
            {/* COMPACT */}
            <div
              className={`
                transition-all duration-400 flex justify-center cursor-pointer
                ${!isOpen ? "opacity-100" : "opacity-0 absolute inset-0 pointer-events-none"}
              `}
            >
              <div className="bg-[#282828] w-min p-4 aspect-square rounded-2xl">
                {/* icon */}
                <svg
                  width="27"
                  height="27"
                  viewBox="0 0 27 27"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M3.86028 22.4994C5.70351 24.3426 8.05193 25.5979 10.6086 26.1064C13.1652 26.615 15.8152 26.354 18.2235 25.3564C20.6318 24.3589 22.6902 22.6696 24.1385 20.5022C25.5867 18.3347 26.3597 15.7866 26.3597 13.1798C26.3597 10.5731 25.5867 8.02492 24.1385 5.85751C22.6902 3.6901 20.6318 2.00081 18.2235 1.00326C15.8152 0.00570822 13.1652 -0.255293 10.6086 0.253254C8.05193 0.7618 5.70351 2.01706 3.86028 3.86029C2.63642 5.08415 1.6656 6.53708 1.00325 8.13613C0.340905 9.73518 -1.18011e-06 11.449 0 13.1798C-1.68584e-07 14.9106 0.340905 16.6245 1.00325 18.2235C1.6656 19.8226 2.63642 21.2755 3.86028 22.4994ZM20.6355 5.7242C22.11 7.19878 23.1143 9.07752 23.5211 11.1228C23.9279 13.1681 23.7191 15.2882 22.9211 17.2148C22.123 19.1414 20.7716 20.7882 19.0377 21.9467C17.3038 23.1053 15.2652 23.7237 13.1798 23.7237C11.0944 23.7237 9.0559 23.1053 7.32197 21.9467C5.58804 20.7882 4.23661 19.1414 3.43857 17.2148C2.64053 15.2882 2.43173 13.1681 2.83856 11.1228C3.2454 9.07752 4.24961 7.19878 5.72419 5.7242C7.70155 3.74684 10.3834 2.63597 13.1798 2.63597C15.9762 2.63597 18.6581 3.74684 20.6355 5.7242ZM8.94875 11.8192L11.8658 11.8658L11.8192 8.94876C11.8192 8.58789 11.9625 8.2418 12.2177 7.98663C12.4729 7.73146 12.819 7.58811 13.1798 7.58811C13.5407 7.58811 13.8868 7.73146 14.142 7.98663C14.3971 8.2418 14.5405 8.58789 14.5405 8.94876L14.4939 11.8658L17.4109 11.8192C17.7718 11.8192 18.1179 11.9625 18.373 12.2177C18.6282 12.4729 18.7716 12.819 18.7716 13.1798C18.7716 13.5407 18.6282 13.8868 18.373 14.142C18.1179 14.3971 17.7718 14.5405 17.4109 14.5405L14.4939 14.4939L14.5405 17.4109C14.5405 17.7718 14.3971 18.1179 14.142 18.373C13.8868 18.6282 13.5407 18.7716 13.1798 18.7716C12.819 18.7716 12.4729 18.6282 12.2177 18.373C11.9625 18.1179 11.8192 17.7718 11.8192 17.4109L11.8658 14.4939L8.94875 14.5405C8.58789 14.5405 8.2418 14.3971 7.98663 14.142C7.73145 13.8868 7.5881 13.5407 7.5881 13.1798C7.5881 12.819 7.73145 12.4729 7.98663 12.2177C8.2418 11.9625 8.58789 11.8192 8.94875 11.8192Z"
                    fill="white"
                  />
                </svg>
              </div>
            </div>
          </div>

          <SidebarNav isOpen={isOpen} />
        </section>

        <SidebarFooter isOpen={isOpen} />
      </GlassElement>
    </aside>
  );
}

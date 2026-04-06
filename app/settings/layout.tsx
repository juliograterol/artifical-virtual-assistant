import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ava | Settings",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="w-full grid justify-center absolute top-0 left-0 bg-[#282828] z-100 xl:grid-cols-[20%_60%_20%] grid-cols-[30%_70%] h-screen">
      <aside className="group/menu md:p-10 p-4 border-r border-[#404040] max-sm:absolute bg-[#282828] h-full max-md:w-9/12 top-0 left-0 max-sm:shadow-[0_0_10px_10px_#00000025] z-10">
        <div className="flex items-center gap-2 border-b border-[#404040] pb-2 mb-4 select-none">
          <Link
            href={"/"}
            className="relative flex items-center justify-center cursor-pointer group/link"
          >
            <div className="group-hover/link:bg-[#1B1B1B] rounded-full p-2 text-white absolute group-hover/menu:opacity-100 opacity-0 transition-opacity duration-150">
              <svg
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 12h14M5 12l4-4m-4 4 4 4"
                />
              </svg>
            </div>
            <Image
              src={"/ava-logo.png"}
              alt={"ava"}
              className="group-hover/menu:opacity-0 opacity-100 transition-opacity duration-150 max-h-6 w-auto"
              width={1080}
              height={1080}
            />
          </Link>
          <h1 className="text-white font-medium text-3xl">Settings</h1>
        </div>
        <ul className="text-white grid gap-2">
          <li className="hover:opacity-50 transition-all duration-150 cursor-pointer">
            Account Settings
          </li>
          <li className="hover:opacity-50 transition-all duration-150 cursor-pointer">
            Appearance
          </li>
          <li className="hover:opacity-50 transition-all duration-150 cursor-pointer">
            Memory
          </li>
        </ul>
      </aside>
      {children}
    </div>
  );
}

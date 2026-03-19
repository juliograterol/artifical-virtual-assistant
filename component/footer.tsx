import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center py-4 mx-4 relative">
      <div className="h-px bg-[#606060] absolute top-0 w-10/12 -z-10" />
      <p className="text-sm cursor-default active:cursor-text">
        Developed by{" "}
        <Link
          href={"https://github.com/juliograterol"}
          className="hover:underline"
          target="_blank"
        >
          @juliograterol
        </Link>{" "}
        • UI/UX by{" "}
        <Link
          href="https://www.behance.net/gabocarrion"
          className="hover:underline"
          target="_blank"
        >
          @gabocarrion
        </Link>{" "}
        • ©Copyright 2006 - 2024 Interactiveworkers. All Rights Reserved
      </p>
    </footer>
  );
}

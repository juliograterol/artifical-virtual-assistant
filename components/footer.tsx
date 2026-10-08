import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full flex justify-center p-4 relative text-white">
      <div className="h-px bg-[#606060] absolute top-0 w-10/12 -z-10" />
      <div className="flex flex-col justify-center items-center">
        <p className="md:text-sm text-xs cursor-default active:cursor-text">
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
          </Link>
        </p>
<<<<<<< HEAD
        <p className="md:text-sm text-xs cursor-default active:cursor-text text-center">
=======
        {/* <p className="text-sm cursor-default active:cursor-text text-center">
>>>>>>> e397750d230d1e5924a20c043b826274b423f583
          ©Copyright 2006 - 2024 Interactiveworkers.
          <br className="md:hidden" /> All Rights Reserved
        </p> */}
      </div>
    </footer>
  );
}

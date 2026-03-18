import Link from "next/link";
import GlassElement from "../glass-elemet/glass-element";

export default function SidebarHeader({ isOpen }: { isOpen: boolean }) {
  return (
    <div className={`flex items-center gap-2 ${isOpen ? "p-4" : "mb-2"}`}>
      <GlassElement
        className={`aspect-square transition-all ${isOpen ? "w-1/2" : "w-full"}`}
        rounded={25}
      >
        <Link href="/" className="h-full flex justify-center">
          <svg
            viewBox="0 -12 316 140"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M87.8583 22.4753L78.4737 3.11199L76.9731 0V22.4679H59.503C38.9644 22.4679 22.3155 39.2455 22.3155 59.9243V71.0342H111.383L87.8583 22.4679V22.4753ZM75.9353 93.5171H22.3155V116H0V59.9318C0 45.7626 4.88267 32.7358 13.0578 22.4753C15.7978 19.0401 18.9036 15.9132 22.3229 13.147C32.5138 4.91601 45.4522 0 59.5104 0H101.797L112.697 22.4679L136.222 71.0342L147.107 93.5021L158 115.985H133.161L122.268 93.5021H75.9428L75.9353 93.5171Z"
              fill="white"
            />

            <path
              d="M204.609 71.0296H293.677V59.9204C293.677 39.2429 277.036 22.4663 256.49 22.4663H239.02V0L237.519 3.11169L228.134 22.4739L204.609 71.0371V71.0296ZM239.02 93.5035H193.732L182.839 115.985H158L168.893 93.5035L179.778 71.0371L203.303 22.4739L214.203 0.00743195H256.49C270.548 0.00743195 283.479 4.92322 293.677 13.1536C297.089 15.9121 300.195 19.0389 302.942 22.4814C311.117 32.7412 316 45.7671 316 59.9355V116H293.685V93.5185H240.065H239.027L239.02 93.5035Z"
              fill="white"
            />
          </svg>
        </Link>
      </GlassElement>

      {isOpen && (
        <div className="transition-all duration-300">
          <p className="text-sm opacity-50">Version 0.1</p>
          <p>AVA - Artificial Virtual Assistant</p>
        </div>
      )}
    </div>
  );
}

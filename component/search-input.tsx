export default function SearchInput({
  value,
  placeholder = "Search...",
  onSearch,
}: {
  value: string;
  placeholder?: string;
  onSearch: (e: any) => void;
}) {
  return (
    <div className="p-2 border-2 border-[#404040] rounded-full flex gap-2 w-full md:max-w-md">
      <svg
        width="21"
        height="21"
        viewBox="0 0 21 21"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M16.3497 16.3497L19 19 M15.6866 5.25476C12.8274 2.35264 8.15688 2.31787 5.25476 5.1771C2.35264 8.03632 2.31786 12.7068 5.17709 15.6089C8.03632 18.5111 12.7068 18.5458 15.6089 15.6866C18.5111 12.8274 18.5458 8.15688 15.6866 5.25476Z"
          stroke="#606060"
          strokeWidth="2"
        />
      </svg>
      <input
        className="outline-none bg-transparent text-white w-full"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onSearch(e.target.value)}
      />
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        viewBox="0 0 24 24"
        className={`transition-all duration-150 cursor-pointer ${value ? "opacity-100" : " opacity-0"}`}
        onClick={() => onSearch("")}
      >
        <path
          stroke="#606060"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M6 18 17.94 6M18 18 6.06 6"
        />
      </svg>
    </div>
  );
}

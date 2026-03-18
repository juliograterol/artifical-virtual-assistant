import GlassElement from "../glass-elemet/glass-element";

export default function SidebarToggle({
  isOpen,
  onToggle,
}: {
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <button
      onClick={onToggle}
      className="absolute right-0 p-4 transition-all group-hover:z-10 group-hover:translate-x-full -z-10 cursor-pointer"
    >
      <GlassElement
        className="aspect-square flex justify-center items-center w-min"
        style={{ borderRadius: 100 }}
      >
        <svg
          width="11"
          height="18"
          viewBox="0 0 11 18"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className={`m-2 transition-all duration-100 ${isOpen ? "" : "-scale-x-100"}`}
        >
          <path
            d="M9.7158 16.2941C9.80953 16.3871 9.88392 16.4977 9.93469 16.6195C9.98546 16.7414 10.0116 16.8721 10.0116 17.0041C10.0116 17.1361 9.98546 17.2668 9.93469 17.3887C9.88392 17.5105 9.80953 17.6211 9.7158 17.7141C9.62284 17.8078 9.51223 17.8822 9.39038 17.933C9.26852 17.9838 9.13781 18.0099 9.0058 18.0099C8.87379 18.0099 8.74308 17.9838 8.62122 17.933C8.49936 17.8822 8.38876 17.8078 8.2958 17.7141L0.295798 9.71409C0.20207 9.62113 0.127676 9.51053 0.0769072 9.38867C0.0261385 9.26681 0 9.1361 0 9.00409C0 8.87208 0.0261385 8.74137 0.0769072 8.61951C0.127676 8.49765 0.20207 8.38706 0.295798 8.29409L8.2958 0.294092C8.4841 0.105788 8.7395 0 9.0058 0C9.13766 0 9.26823 0.0259717 9.39005 0.076432C9.51187 0.126892 9.62256 0.200853 9.7158 0.294092C9.80904 0.38733 9.883 0.498021 9.93346 0.619843C9.98392 0.741665 10.0099 0.872233 10.0099 1.00409C10.0099 1.13595 9.98392 1.26652 9.93346 1.38834C9.883 1.51016 9.80904 1.62085 9.7158 1.71409L2.4158 9.00409L9.7158 16.2941Z"
            fill="white"
          />
        </svg>
      </GlassElement>
    </button>
  );
}

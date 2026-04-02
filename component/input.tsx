type InputProps =
  | {
      type?: "text";
      placeholder?: string;
      value?: string;
    }
  | {
      type: "switch";
      label?: string;
    };

export default function Input(props: InputProps) {
  switch (props.type) {
    case "switch": {
      const { label } = props;
      return (
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <div className="relative w-16 h-9">
              {/* ✅ peer MUST come first */}
              <input
                type="checkbox"
                className="peer absolute w-full h-full opacity-0 z-10 cursor-pointer"
              />
              {/* ✅ track */}
              <div className="absolute inset-0 rounded-full border border-[#404040] transition-all duration-200 peer-checked:border-[#606060] peer-checked:bg-[#606060]/50" />
              {/* ✅ thumb */}
              <div className="absolute top-1 left-1 h-7 w-7 rounded-full bg-[#404040] transition-all duration-200 peer-checked:bg-white peer-checked:translate-x-7 peer-active:scale-90" />
            </div>
            <span className="text-white">{label}</span>
          </label>
        </div>
      );
    }
    // default or text
    default: {
      const { placeholder } = props;
      return (
        <div className="w-full p-4 border border-[#404040] rounded-2xl">
          <input placeholder={placeholder} className="outline-0" />
        </div>
      );
    }
  }
}

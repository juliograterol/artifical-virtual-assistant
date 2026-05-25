type BasicInputProps = {
  id?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  required?: boolean;
};

type InputProps = (
  | {
      type?: "text";
      value?: string;
      placeholder?: string;
      example?: string;
    }
  | {
      type: "switch";
      checked?: boolean;
      label?: string | [string, string];
    }
) &
  BasicInputProps;

export default function Input(props: InputProps) {
  const { required } = props;

  const Required = () => {
    if (required)
      return (
        <>
          {" "}
          <span className="text-[#FF4C4C]">*</span>
        </>
      );
  };

  switch (props.type) {
    case "switch": {
      const { id, label, checked, onChange } = props;
      return (
        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 cursor-pointer">
            {label && Array.isArray(label) && (
              <span className="text-white">{label[0]}</span>
            )}
            <div className="relative w-16 h-9">
              {/* ✅ peer MUST come first */}
              <input
                id={id}
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="peer absolute w-full h-full opacity-0 z-10 cursor-pointer"
              />
              {/* ✅ track */}
              <div className="absolute inset-0 rounded-full border border-[#404040] transition-all duration-200 peer-checked:border-[#606060] peer-checked:bg-[#606060]/50" />
              {/* ✅ thumb */}
              <div className="absolute top-1 left-1 h-7 w-7 rounded-full bg-[#404040] transition-all duration-200 peer-checked:bg-white peer-checked:translate-x-7 peer-active:scale-90" />
            </div>
            {label && (
              <span className="text-white">
                {Array.isArray(label) ? label[1] : label}
                <Required />
              </span>
            )}
          </label>
        </div>
      );
    }
    // default or text
    default: {
      const { id, value, placeholder, example, onChange } = props;
      return (
        <div className="w-full p-4 border border-[#404040] rounded-2xl relative flex ">
          <span
            className={`${value || example ? "-translate-y-full text-xs text-[#909090]" : "translate-y-0"} absolute transition-all duration-100`}
          >
            {placeholder}
            <Required />
          </span>
          <input
            id={id}
            value={value}
            placeholder={example}
            className={`outline-0 w-full ${example && value === "" && "placeholder:opacity-50"}`}
            onChange={onChange}
            required={required}
          />
        </div>
      );
    }
  }
}

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
          <div className="border border-[#404040] rounded-full b relative w-16 overflow-hidden">
            <input
              type="checkbox"
              className="peer z-10 absolute w-full h-full opacity-0"
            />
            <div className="peer-checked:bg-white/30 absolute w-full h-full top-0 left-0 transition-all duration-150" />
            <div className="bg-[#404040] peer-checked:bg-white peer-checked:translate-x-full rounded-full h-7 w-7 m-1 top-0 left-0 -z-10 transition-all" />
          </div>
          <label>{label}</label>
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

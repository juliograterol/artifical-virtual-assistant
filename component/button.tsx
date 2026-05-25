type BasicButtonProps = {
  onClick?: (e?: any) => void;
  dark?: boolean;
  type?: "submit" | "reset" | "button" | undefined;
  disabled?: boolean;
};

type ButtonProps = ({ children: React.ReactNode } | { label: string }) &
  BasicButtonProps;

export default function Button(props: ButtonProps) {
  const { onClick, dark, type, disabled } = props;

  const onClickFunction = (e?: any) => {
    onClick ?? e.preventDefault();
  };

  return (
    <button
      type={type}
      onClick={onClickFunction}
      disabled={disabled}
      className={`font-medium rounded-xl px-4 py-3 w-full cursor-pointer mt-4 active:scale-95 hover:scale-105
        disabled:bg-[#404040] disabled:text-white disabled:opacity-50 disabled:cursor-default
        disabled:pointer-events-none select-none
        ${dark ? "bg-black text-white" : "bg-white text-black"} 
        transition-all duration-100`}
    >
      {"children" in props ? props.children : props.label}
    </button>
  );
}

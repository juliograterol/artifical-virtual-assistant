import React from "react";

const InputField = React.memo(function InputField({
  name,
  value,
  onChange,
}: {
  name: string;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <input
      required
      placeholder={name + " *"}
      value={value}
      onChange={(e) => onChange(name, e.target.value)}
      className="border-b border-white/20 px-2 py-1 text-sm outline-none focus:border-white/50"
    />
  );
});

export default InputField;

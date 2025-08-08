import React from "react";

export default function InputField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
}) {
  return (
    <div className="w-4/5 flex flex-col mb-4">
      <label htmlFor={id} className="mb-1 text-sm">
        {label}
      </label>
      <input
        type={type}
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="block w-full h-8 bg-transparent border-b border-gray-300 text-white focus:outline-none placeholder:text-gray-400"
        />
    </div>
  );
}

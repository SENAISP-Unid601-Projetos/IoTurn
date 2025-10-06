import React from "react";

function SidebarButton({ text, onClick, className }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        className
          ? className
          : "text-white hover:text-blue-600 p-2 rounded-md w-full text-left hover:bg-slate-800 transition-colors duration-300"
      }
    >
      {text}
    </button>
  );
}

export default SidebarButton;
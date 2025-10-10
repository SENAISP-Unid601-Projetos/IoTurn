import React from "react";
import Button from "@mui/material/Button";

function SidebarButton({ text, onClick, className }) {
  return (
    <Button
      variant="text"
      fullWidth
      onClick={onClick}
      sx={{
        justifyContent: "flex-start",
        color: "white",
        textTransform: "none",
        borderRadius: "8px",
        padding: "8px",
        transition: "0.3s",
        "&:hover": {
          color: "#2563eb", // azul-600 do Tailwind
          backgroundColor: "#1e293b", // slate-800
        },
      }}
      className={className}
    >
      {text}
    </Button>
  );
}

export default SidebarButton;

import { useState } from "react";
import { ChevronRight } from "lucide-react";
import {
  Button,
  Collapse,
  Box,
  Typography,
  IconButton
} from "@mui/material";

function MatrioskaMenu({ buttonText, innerItens, className }) {
  const [isRetracted, setIsRetracted] = useState(true);

  return (
    <Box>
      <Button
        variant="text"
        fullWidth
        onClick={() => setIsRetracted(!isRetracted)}
        sx={{
          color: "white",
          justifyContent: "space-between",
          textTransform: "none",
          borderRadius: 2,
          px: 2,
          py: 1,
          "&:hover": {
            backgroundColor: "rgba(255,255,255,0.1)",
            color: "primary.main"
          },
          transition: "all 0.3s ease"
        }}
        className={className}
      >
        <Typography variant="body1">{buttonText}</Typography>
        <IconButton
          size="small"
          sx={{
            color: "inherit",
            transform: isRetracted ? "rotate(0deg)" : "rotate(90deg)",
            transition: "transform 0.3s ease",
          }}
        >
          <ChevronRight size={20} />
        </IconButton>
      </Button>

      <Collapse in={!isRetracted} timeout="auto" unmountOnExit>
        <Box sx={{ ml: 3, mt: 1 }}>
          {innerItens}
        </Box>
      </Collapse>
    </Box>
  );
    const baseStyle =
        "flex items-center justify-between text-white hover:text-blue-600 p-2 rounded-md w-full text-left hover:bg-slate-800 transition-colors duration-300";

    return (
        <div>
            <button
                type="button"
                className={className ? className : baseStyle}
                onClick={() => setIsRetracted(!isRetracted)}
            >
                <span>{buttonText}</span>
                <ChevronRight strokeWidth={5} size={20}
                    className={`transition-transform duration-300 ${!isRetracted ? "rotate-90" : "rotate-0"}`}
                />
            </button>

            {!isRetracted && (
                <div className="ml-6 mt-1">
                    {innerItens}
                </div>
            )}
        </div>
    );
}

export default MatrioskaMenu;

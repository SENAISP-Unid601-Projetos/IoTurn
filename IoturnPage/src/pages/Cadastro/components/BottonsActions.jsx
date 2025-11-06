import { Button, Box } from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import theme from "../../../theme";

const Buttons = ({
  onNext,
  cancelPath,      
  nextLabel = "Próximo",
  cancelLabel = "Cancelar",
  showNextIcon = false,
}) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (cancelPath) navigate(cancelPath);
    else navigate(-1); 
  };

  return (
    <Box display="flex" justifyContent="space-between" width="100%" padding={2} pt={0}>
      <Button
        variant="outlined"
        onClick={handleCancel} 
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
          borderColor: theme.palette.divider,
          "&:hover": {
            backgroundColor: theme.palette.background.paper,
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <ArrowLeft size={18} />
        {cancelLabel}
      </Button>

      <Button
        variant="contained"
        onClick={onNext}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        {nextLabel}
        {showNextIcon && <ArrowRight size={18} />}
      </Button>
    </Box>
  );
};

export default Buttons;

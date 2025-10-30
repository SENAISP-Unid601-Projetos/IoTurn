import { Button, Box } from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";
import theme from "../../../theme";

const Buttons = ({
  onNext,
  onCancel,
  nextLabel = "Próximo",
  cancelLabel = "Cancelar",
  showNextIcon = false
}) => {
  return (
    <Box display="flex" justifyContent="space-between" width="100%" padding={2} pt={0}>
      <Button
        variant="outlined"
        onClick={onCancel}
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
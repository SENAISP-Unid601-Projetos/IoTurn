import { Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight } from "lucide-react"; // 👈 ícones Lucide

const Buttons = ({
  onNext,
  nextLabel = "Próximo",
  cancelLabel = "Cancelar",
  cancelPath = "/main/gerenciamento",
}) => {
  const navigate = useNavigate();

  return (
    <Box
      display="flex"
      justifyContent="space-between"
      mt={4}
      width="100%"
      maxWidth="600px"
      margin="0 auto"
    >
      {/* Botão Cancelar */}
      <Button
        variant="outlined"
        onClick={() => navigate(cancelPath)}
        sx={{
          borderRadius: "12px",
          textTransform: "none",
          display: "flex",
          alignItems: "center",
          gap: "6px",
        }}
      >
        <ArrowLeft size={18} />
        {cancelLabel}
      </Button>

      {/* Botão Próximo */}
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
        <ArrowRight size={18} />
      </Button>
    </Box>
  );
};

export default Buttons;

import React from "react";
import { Typography, Box } from "@mui/material";
import theme from "../../../../../theme";

const DispositivoInfoSection = () => (
  <Box
    sx={{
      position: "relative",
      pl: 2,
      mb: 3,
      "&::before": {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: "4px",
        bgcolor: theme.palette.primary.main,
        borderRadius: 2,
      },
    }}
  >
    <Typography variant="h6" fontWeight="bold" sx={{ mb: 1 }}>
      Cadastrar Novo Dispositivo
    </Typography>
    <Typography variant="body2" color="text.secondary">
      Preencha as informações do sensor Heltec V2. A vinculação com gateway
      e máquina será feita posteriormente no cadastro da máquina.
    </Typography>
  </Box>
);

export default DispositivoInfoSection;
import React from "react";
import { Typography, Box } from "@mui/material";
import theme from "../../../../../theme";

const GatewayGuidelinesSection = () => (
  <Box
    sx={{
      mt: 3,
      p: 1,
      borderTop: `1px solid ${theme.palette.divider}`,
      position: "relative",
      pl: 2,
      mb: 2,
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
    <Typography variant="subtitle1" fontWeight="bold">
      Diretrizes de Cadastro
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ 
        whiteSpace: "pre-line",
        lineHeight: 1.7 
      }}
    >
      {`• O Gateway ID deve ser único e corresponder ao Chip ID do ESP32
• Gateways offline não conseguem gerenciar dispositivos até ficarem online
• Um único Gateway pode gerenciar múltiplos dispositivos IoT simultaneamente
• O status será atualizado automaticamente quando o Gateway enviar o primeiro heartbeat
• Certifique-se de que o Gateway tenha acesso à rede Wi-Fi antes de ativá-lo`}
    </Typography>
  </Box>
);

export default GatewayGuidelinesSection;
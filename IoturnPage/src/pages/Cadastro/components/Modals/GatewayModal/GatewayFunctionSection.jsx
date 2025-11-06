
import React from "react";
import { Typography, Box } from "@mui/material";
import theme from "../../../../../theme";

const GatewayFunctionSection = () => (
  <Box
    sx={{
      mt: 3,
      p: 1,
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
      Função do Gateway
    </Typography>
    <Typography
      variant="body2"
      color="text.secondary"
      sx={{ 
        whiteSpace: "pre-line",
        lineHeight: 1.7 
      }}
    >
      {`O Gateway ESP32 atua como ponto de comunicação entre os sensores Heltec V2 (LoRa) e o servidor central via Wi-Fi. Ele é responsável por:
• Receber dados dos dispositivos IoT via protocolo LoRa
• Encaminhar os dados para o servidor através da rede Wi-Fi
• Gerenciar múltiplos dispositivos simultaneamente
• Enviar heartbeats periódicos para monitoramento de conectividade`}
    </Typography>
  </Box>
);

export default GatewayFunctionSection;
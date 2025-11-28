import React from "react";
import { Box, Typography } from "@mui/material";
import { Settings } from "lucide-react";
import theme from "../../../theme";

const MachineHeaderSection = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "column",
      alignItems: "center",
      flexDirection: "column",
      textAlign: "center",
    }}
  >
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        mb: 1,
      }}
    >
      <Settings color={theme.palette.primary.dark} size={30} />
      <Typography variant="h4" component="h1" fontWeight="bold">
        Cadastro de Máquina
      </Typography>
    </Box>
    <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
      Registre uma nova máquina e vincule um dispositivo IoT
    </Typography>
  </Box>
);

export default MachineHeaderSection;
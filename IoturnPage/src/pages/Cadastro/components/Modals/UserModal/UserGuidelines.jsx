import React from "react";
import { Typography, Box } from "@mui/material";
import theme from "../../../../../theme";

const UserGuidelines = () => {
  return (
    <Box
      sx={{ mt: 3, bgcolor: "background.default" }}>
      <Typography
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
            borderRadius: "4px",
          },
        }}>
        <Typography variant="subtitle1" fontWeight="bold">
          Diretrizes de Cadastro
        </Typography>
        <Typography variant="body2" color="text.secondary">
        <ul>
          <li>O e-mail deve ser único no sistema e será usado para login</li>
          <li>Senhas devem ter no mínimo 8 caracteres com letras maiúsculas, minúsculas e números</li>
          <li>Administradores têm acesso total, incluindo gerenciamento de usuários e configurações</li>
          <li>Técnicos podem gerenciar máquinas e dispositivos, mas não alterar configurações do sistema</li>
          <li>Visualizadores têm acesso somente leitura aos dashboards e relatórios</li>
        </ul>
        </Typography>
      </Typography>
    </Box>
  );
};

export default UserGuidelines;
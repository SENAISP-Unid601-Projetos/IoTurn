import React from "react";
import { Box, Typography } from "@mui/material";

const GerenciamentoMaquinas = () => {
    console.log("GerenciamentoMaquinas component rendered");
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                bgcolor: "blue", // ← fundo escuro do tema
                p: 3,
            }}
        >
            <Typography variant="h1" color="text.primary">
                Página de Gerenciamento de Máquinas
            </Typography>
        </Box>
    );
};

export default GerenciamentoMaquinas;
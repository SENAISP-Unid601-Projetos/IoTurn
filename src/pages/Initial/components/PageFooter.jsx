import React from 'react';
import { Typography, Box, Container } from '@mui/material';
import Logo from "../../../assets/Logo.png";

const PageFooter = () => (
    <Box sx={{ width: "100%", py: 3 }}>
        <Container
            maxWidth="lg"
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                minHeight: { xs: "120px", md: "60px" },
                height: {xs: '200px', md: "100px"}
            }}
        >
            <Box
                component="img"
                src={Logo}
                alt="IoTurn Logo"
                sx={{
                    height: "5rem",
                    transform: "scale(1.5)",
                    width: 'auto',
                    py: 2,
                }}
            />

            <Typography variant="body2" color="text.secondary">
                © 2025 IoTurn. Plataforma de Monitoramento Industrial.
            </Typography>
        </Container>
    </Box>
);

export default PageFooter;
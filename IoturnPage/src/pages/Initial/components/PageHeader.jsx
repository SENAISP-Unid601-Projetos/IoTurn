import React from 'react';
import { AppBar, Toolbar, Button, Box, Container } from '@mui/material';
import Logo from "../../../assets/LogoSemBorda.png";

const PageHeader = () => (
    <AppBar
        position="static"
        elevation={0}
        sx={{ backgroundColor: "transparent" }}
    >
        <Container maxWidth="lg">
            <Toolbar sx={{ padding: { xs: "0", md: "0 1.5rem" } }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                    <Box
                        component="img"
                        src={Logo}
                        alt="IoTurn Logo"
                        sx={{
                            height: "50px",
                            transform: "scale(5)",
                            width: "auto",
                            py: 2,
                        }}
                    />
                </Box>
                <Box sx={{ flexGrow: 1 }} />
                <Button
                    variant="contained"
                    href="/login"
                    sx={{
                        borderRadius: "20px",
                        textTransform: "none",
                        px: 3,
                        py: 1,
                        fontSize: "1rem",
                    }}
                >
                    Acessar
                </Button>
            </Toolbar>
        </Container>
    </AppBar>
);

export default PageHeader;
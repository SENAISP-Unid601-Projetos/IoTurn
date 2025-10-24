import React from 'react';
import { Typography, Container } from '@mui/material';
import BtnAcess from './BtnAcess';

const CallSection = () => (
    <Container
        sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: { xs: 4, md: 8 },
        }}
    >
        <Typography
            component="h2"
            variant="h3"
            sx={{
                fontWeight: "bold",
                mt: 2,
                fontSize: { xs: "2rem", md: "2.5rem" },
            }}
        >
            Pronto para transformar sua operação?
        </Typography>
        <Typography
            variant="h6"
            component="p"
            color="text.secondary"
            sx={{ my: 4, fontSize: { xs: "1rem", md: "1.125rem" } }}
        >
            Junte-se a empresas que já confiam na IoTurn para monitorar sua
            infraestrutura.
        </Typography>
        <BtnAcess />
    </Container>
);

export default CallSection;
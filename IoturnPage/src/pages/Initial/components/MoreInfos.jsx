import React from 'react';
import { Typography, Container } from '@mui/material';
import MoreInfoCards from './CardInfo';

const MoreInfos = () => (
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
                fontSize: { xs: "2rem", md: "2.5rem" },
            }}
        >
            Tudo que você precisa em um só lugar
        </Typography>
        <Typography
            component="p"
            variant="h6"
            color="text.secondary"
            sx={{
                mt: 1,
                maxWidth: { xs: "90%", md: "60%" },
                fontSize: { xs: "1rem", md: "1.125rem" },
            }}
        >
            Ferramentas poderosas para gerenciar sua infraestrutura IoT com eficiência
            e segurança.
        </Typography>
        <MoreInfoCards />
    </Container>
);

export default MoreInfos;
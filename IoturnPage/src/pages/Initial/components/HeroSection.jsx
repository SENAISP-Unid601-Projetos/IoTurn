import React from 'react';
import { Typography, Box, Container, Stack } from '@mui/material';
import { CheckCircle2 } from 'lucide-react';
import BtnAcess from './BtnAcess';
import bgImage from '../../../assets/bg.jpg'

const HeroSection = () => (
    <Box
        maxWidth="md"
        sx={{
            display: 'flex',
            position: 'relative',
            backgroundImage: `url(${bgImage})`,
            backgroundSize: 'cover',
            backfaceVisibility: '10%',
            minWidth: '100%',
            maxWidth: '100%',
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            py: { xs: 4, md: 8 },
            '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                backgroundColor: 'rgba(7, 10, 17, 0.9)',
                zIndex: 1,
            },
            '& > *': {
                position: 'relative',
                zIndex: 2,
            }
        }}
    >
        <Typography
            variant="h1"
            component="h1"
            sx={{
                fontWeight: "bold",
                mb: 2,
                fontSize: { xs: "2.5rem", sm: "3.5rem", md: "4rem" },
            }}
        >
            Monitoramento <br />
            IoT{" "}
            <Typography
                component="span"
                variant="inherit"
                color="primary"
                sx={{ fontWeight: "bold" }}
            >
                inteligente
            </Typography>{" "}
            <br />
            para sua indústria
        </Typography>
        <Typography
            variant="h5"
            component="p"
            color="text.secondary"
            sx={{
                mb: 4,
                maxWidth: "600px",
                fontSize: { xs: "1rem", md: "1.25rem" },
            }}
        >
            Conecte, monitore e otimize seus dispositivos industriais em tempo real.
            Uma plataforma completa para transformar dados em decisões.
        </Typography>
        <BtnAcess />
        <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={{ xs: 2, sm: 4 }}
            sx={{ mt: 4 }}
        >
            <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle2 size={16} color="#2979ff" />
                <Typography variant="body2" color="text.secondary">
                    Acesso direto ao painel
                </Typography>
            </Stack>
            <Stack direction="row" alignItems="center" spacing={1}>
                <CheckCircle2 size={16} color="#2979ff" />
                <Typography variant="body2" color="text.secondary">
                    Monitoramento em tempo real
                </Typography>
            </Stack>
        </Stack>
    </Box>
);

export default HeroSection;
// src/pages/Initial/components/LogoCarousel.jsx
import React from 'react';
import { Box, Typography, keyframes } from '@mui/material';
import uplabLogo from '../../../assets/uplab.png';
import nextronLogo from '../../../assets/nextron.png';

const scrollX = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
`;

const LogoCarousel = () => {
    const logos = [
        { src: uplabLogo, alt: 'UpLab' },
        { src: nextronLogo, alt: 'Nextron' },
    ];

    const baseLogoList = Array(6).fill(logos).flat();

    const duplicatedLogos = [...baseLogoList, ...baseLogoList];

    return (
        <Box
            sx={{
                py: { xs: 4, md: 6 },
                bgcolor: 'background.default',
                width: '100%',
                overflow: 'hidden',
                maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            }}
        >
            <Typography
                variant="h6"
                color="text.secondary"
                textAlign="center"
                sx={{ mb: 4 }}
            >
                Parceiros
            </Typography>

            <Box
                sx={{
                    display: 'flex',
                    width: 'fit-content',
                    filter: 'grayscale(25%)',
                    opacity: 0.8,
                    animation: `${scrollX} 50s linear infinite`,
                    '&:hover': {
                        animationPlayState: 'paused',
                    },
                }}
            >
                {duplicatedLogos.map((logo, index) => (
                    <Box
                        key={index}
                        component="img"
                        src={logo.src}
                        alt={logo.alt}
                        sx={{
                            height: { xs: 35, md: 50 },
                            width: 'auto',
                            mx: { xs: 4, md: 6 },
                            transition: 'transform 0.3s',
                            '&:hover': {
                                transform: 'scale(1.1)',
                            },
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default LogoCarousel;
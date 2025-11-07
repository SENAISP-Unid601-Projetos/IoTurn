import React from 'react';
import { Paper, Typography, Box, useTheme, alpha } from '@mui/material';
import { TrendingDown, Minus, TrendingUp } from 'lucide-react';

// Componente Stat (Min, Méd, Máx)
const Stat = ({ label, value, icon: Icon }) => (
    <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 0.5
    }}>
        <Typography
            variant="caption"
            color="text.secondary" // Label (Min, Méd) em cinza
            sx={{
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
            }}
        >
            {Icon && <Icon size={14} />}
            {label}
        </Typography>
        <Typography
            variant="body2"
            sx={{ fontWeight: 'bold', color: 'text.primary' }} // Valor (1418) em branco
        >
            {value}
        </Typography>
    </Box>
);

const MetricCard = ({ icon: Icon, title, value, unit, min, med, max, status = 'default' }) => {
    const theme = useTheme();

    // Configuração do semáforo
    const statusConfig = {
        good: {
            color: theme.palette.success.main, // Verde "neon" (para borda e texto)
            bgcolor: alpha(theme.palette.success.main, 0.1), // Fundo do card (suave)
            glow: alpha(theme.palette.success.main, 0.25), // Brilho "neon"
        },
        warning: {
            color: theme.palette.warning.main, // Amarelo "neon"
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            glow: alpha(theme.palette.warning.main, 0.25),
        },
        danger: {
            color: theme.palette.error.main, // Vermelho "neon"
            bgcolor: alpha(theme.palette.error.main, 0.1),
            glow: alpha(theme.palette.error.main, 0.25),
        },
        default: {
            color: theme.palette.divider, // Borda cinza
            bgcolor: theme.palette.background.default, // Fundo preto
            iconColor: theme.palette.text.secondary, // Ícone cinza
            textColor: theme.palette.text.primary, // COR DO TEXTO: Branca (para não ficar cinza)
            glow: 'transparent', // Sem brilho
        }
    };

    const config = statusConfig[status] || statusConfig.default;

    // Define as variáveis de cor
    const borderColor = config.color;
    const backgroundColor = config.bgcolor;
    const valueTextColor = config.textColor || config.color;
    const statusIconColor = config.iconColor || config.color;
    const glow = config.glow;

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                bgcolor: backgroundColor,
                border: `1px solid ${borderColor}`,
                boxShadow: `0 0 12px ${glow}`,
                borderRadius: 3,
                minWidth: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                transition: 'border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease',
            }}
        >
            {/* LINHA SUPERIOR */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    {Icon && <Icon size={18} />}
                    {title}
                </Typography>
                {Icon && <Icon size={18} color={statusIconColor} />}
            </Box>

            {/* VALOR PRINCIPAL */}
            <Box sx={{
                my: 2,
                textAlign: 'center',
            }}>
                <Typography component="span" variant="h3" sx={{
                    fontWeight: 'bold',
                    color: valueTextColor,
                    transition: 'color 0.3s ease',
                }}>
                    {value}
                </Typography>
                <Typography component="span" variant="h5" color="text.secondary" sx={{ ml: 0.5 }}>
                    {unit}
                </Typography>
            </Box>

            {/* LINHA INFERIOR (STATS) */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', pt: 2, borderTop: `1px solid ${theme.palette.divider}` }}>
                <Stat label="Min" value={min} icon={TrendingDown} />
                <Stat label="Méd" value={med} icon={Minus} />
                <Stat label="Máx" value={max} icon={TrendingUp} />
            </Box>
        </Paper>
    );
};

export default MetricCard;
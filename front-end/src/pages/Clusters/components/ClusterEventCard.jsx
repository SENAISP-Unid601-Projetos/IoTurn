import React from 'react';
import { Paper, Typography, Box, useTheme, Tooltip, Divider, alpha } from '@mui/material';
import { Clock, Sparkles, Info, ArrowRight } from 'lucide-react';
import theme from '../../../theme'

const Metric = ({ label, value, unit = '' }) => (
    <Box>
        <Typography variant="caption" color="text.secondary">
            {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
            {value}{unit}
        </Typography>
    </Box>
);


const ClusterEventCard = ({ event }) => {
    const theme = useTheme();
    
    const CLUSTER_COLORS_HEX = [
        "#F59E0B", // Laranja
        "#FB923C", // Laranja Claro
        "#FBBF24", // Amarelo
    ];

    const baseColor = event.predicted_cluster === -1
        ? theme.palette.error.main
        : CLUSTER_COLORS_HEX[Math.floor(Math.random() * CLUSTER_COLORS_HEX.length)];

    const statusColor = baseColor;
    const glow = alpha(baseColor, 0.25);
    const cardBgColor = alpha(baseColor, 0.05);
    const insightBgColor = alpha(baseColor, 0.1);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                bgcolor: cardBgColor,
                border: `1px solid ${statusColor}`,
                boxShadow: `0 0 8px ${glow}`,
                borderRadius: 3,
                mb: 2,
                transition: 'all 0.3s ease',
            }}
        >
            {/* Card Header */}
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    mb: 2,
                }}
            >
                {/* Ícone Clock: Cor de destaque */}
                <Clock size={18} color={statusColor} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {event.machineName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    {event.time}
                </Typography>
            </Box>

            {/* Card Body - Descrição e Cluster */}
            <Box sx={{ mb: 2.5, pl: 4.25 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                        {/* Cluster ID: Cor de destaque */}
                        Cluster: <Box component="span" sx={{ color: statusColor, fontWeight: 'bold' }}>{event.clusterId}</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Força: <Box component="span" sx={{ color: statusColor, fontWeight: 'bold' }}>{event.clusterForce}</Box>
                        <Tooltip title="Nível de confiança do cluster">
                            <Info size={14} />
                        </Tooltip>
                    </Typography>

                    {event.previousClusterId && (
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            Anterior:
                            <Box component="span" sx={{ color: statusColor, fontWeight: 'bold' }}>
                                {event.previousClusterId}
                            </Box>
                            <ArrowRight size={14} />
                            <Box component="span" sx={{ color: statusColor, fontWeight: 'bold' }}>
                                {event.previousClusterForce}
                            </Box>
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Insight Box (com fundo e borda de destaque) */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: insightBgColor,
                    borderRadius: 2,
                    borderLeft: `3px solid ${statusColor}`,
                    boxShadow: `0 0 10px ${glow} inset`,
                    mb: 2.5,
                    pl: 2.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    {/* Ícone Sparkles na cor de destaque */}
                    <Sparkles size={18} color={statusColor} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Insight de IA
                    </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {event.insight}
                </Typography>
                <Divider sx={{ borderColor: theme.palette.divider }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                    Este é um insight gerado automaticamente. Sempre verifique as informações e sua veracidade antes de tomar decisões ou conclusões.
                </Typography>
            </Box>

            {/* Footer Metrics */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: `1px solid ${theme.palette.divider}`,
                    pt: 2,
                    px: 2,
                }}
            >
                {/* Valores das Métricas: Destaque com a cor do status */}
                <Metric label="RPM" value={event.rpm} color={statusColor} />
                <Metric label="Temperatura" value={event.temperature} unit="°C" color={statusColor} />
                <Metric label="Nível de Óleo" value={event.oilLevel} unit="%" color={statusColor} />
                <Metric label="Corrente" value={event.current} unit="A" color={statusColor} />
            </Box>
        </Paper>
    );
};

export default ClusterEventCard;
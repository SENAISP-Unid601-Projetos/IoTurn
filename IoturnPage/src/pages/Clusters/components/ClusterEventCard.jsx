import React from 'react';
import { Paper, Typography, Box, useTheme, alpha, Chip, Tooltip } from '@mui/material';
import { Clock, Sparkles, Info, ArrowRight } from 'lucide-react';
import theme from '../../../theme'

const typeConfig = {
    anomaly: {
        label: 'Anomaly',
        color: 'error',
        iconColor: (theme) => theme.palette.error.main,
    },
    transition: {
        label: 'Transition',
        color: 'primary',
        iconColor: (theme) => theme.palette.primary.main,
    },
    low_force_cluster: {
        label: 'Baixa Força',
        color: 'warning',
        iconColor: (theme) => theme.palette.warning.main,
    },
    default: {
        label: 'Evento',
        color: 'secondary',
        iconColor: (theme) => theme.palette.text.secondary,
    }
};

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
    const config = typeConfig[event.eventType] || typeConfig.default;
    const cardBorderColor = config.iconColor(theme);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 3,
                bgcolor: 'background.default',
                border: `1px solid ${cardBorderColor}`,
                borderRadius: 3,
                mb: 2,
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
                <Clock size={18} color={theme.palette.text.secondary} />
                <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                    {event.machineName}
                </Typography>
                <Chip
                    label={config.label}
                    color={config.color}
                    variant="outlined"
                    size="small"
                />
                <Typography variant="body2" color="text.secondary">
                    {event.time}
                </Typography>
            </Box>

            {/* Card Body - Descrição e Cluster */}
            <Box sx={{ mb: 2.5, pl: 4.25 }}>
                <Typography variant="body1" sx={{ mb: 1.5 }}>
                    {event.description}
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary">
                        Cluster: <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{event.clusterId}</Box>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        Força: <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>{event.clusterForce}</Box>
                        <Tooltip title="Nível de confiança do cluster">
                            <Info size={14} />
                        </Tooltip>
                    </Typography>

                    {event.previousClusterId && (
                        <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            Anterior:
                            <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                {event.previousClusterId}
                            </Box>
                            <ArrowRight size={14} />
                            <Box component="span" sx={{ color: 'text.primary', fontWeight: 'bold' }}>
                                {event.previousClusterForce}
                            </Box>
                        </Typography>
                    )}
                </Box>
            </Box>

            {/* Insight Box */}
            <Box
                sx={{
                    p: 2,
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    borderLeft: `3px solid ${theme.palette.primary.main}`,
                    mb: 2.5,
                    pl: 2.5,
                }}
            >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                    <Sparkles size={18} color={theme.palette.primary.main} />
                    <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                        Insight de IA
                    </Typography>
                    <Chip label="Verificar Informações" color="warning" size="small" variant="outlined" />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    {event.insight}
                </Typography>
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
                <Metric label="RPM" value={event.rpm} />
                <Metric label="Temperatura" value={event.temperature} unit="°C" />
                <Metric label="Nível de Óleo" value={event.oilLevel} unit="%" />
                <Metric label="Corrente" value={event.current} unit="A" />
            </Box>
        </Paper>
    );
};

export default ClusterEventCard;
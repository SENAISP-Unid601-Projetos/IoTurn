import React, { useState, useEffect } from 'react';
import { Box, Typography, IconButton, useTheme, Stack, CircularProgress, Alert } from '@mui/material';
import { RefreshCw, Activity, AlertTriangle, Bug, ShieldAlert, ZapOff } from 'lucide-react';
import { fetchClusterData } from '../../services/ClusterService';
import SummaryStatCard from './components/SumaryStatCard';
import ClusterEventCard from './components/ClusterEventCard';


const ClusterAnalysisPage = () => {
    const theme = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const loadData = async () => {
        try {
            setLoading(true);
            const result = await fetchClusterData();
            setData(result);
            setError(null);
        } catch (err) {
            console.error("Erro ao carregar dados de cluster:", err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">Falha ao carregar dados: {error}</Alert>;
    }

    if (!data) {
        return <Typography>Nenhum dado encontrado.</Typography>;
    }

    return (
        <Box>
            {/* Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
                        Logs de Análise de Clusters
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Monitoramento inteligente HDBSCAN - Exibindo apenas eventos relevantes
                    </Typography>
                </Box>
                <IconButton
                    onClick={loadData}
                    sx={{
                        border: `1px solid ${theme.palette.divider}`,
                        borderRadius: 2,
                    }}
                >
                    <RefreshCw size={18} />
                </IconButton>
            </Box>

            {/* Summary Cards */}
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 2,
                    my: 3,
                }}
            >
                <SummaryStatCard title="Total de Eventos" value={data.summary.totalEvents} icon={Activity} />
                <SummaryStatCard title="Críticos" value={data.summary.critical} icon={ShieldAlert} color={theme.palette.error.main} />
                <SummaryStatCard title="Avisos" value={data.summary.warnings} icon={AlertTriangle} color={theme.palette.warning.main} />
                <SummaryStatCard title="Anomalias" value={data.summary.anomalies} icon={Bug} color={theme.palette.error.main} />
                <SummaryStatCard title="Força Baixa" value={data.summary.lowForce} icon={ZapOff} color={theme.palette.warning.main} />
            </Box>

            {/* Event Log */}
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>
                Eventos Registrados ({data.events.length})
            </Typography>
            <Stack>
                {data.events.map(event => (
                    <ClusterEventCard key={event.id} event={event} />
                ))}
            </Stack>
        </Box>
    );
};

export default ClusterAnalysisPage;
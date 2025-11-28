import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Box, Typography, IconButton, useTheme, Stack, CircularProgress, Alert } from '@mui/material';
import { RefreshCw, Activity, AlertTriangle, Bug, ShieldAlert, ZapOff } from 'lucide-react';
import SummaryStatCard from './components/SumaryStatCard';
import ClusterEventCard from './components/ClusterEventCard';
import { useRealtimeData } from '../../context/RealtimeDataProvider';


const formatSSEEvent = (sseEvent) => {
    const timestamp = sseEvent.timestamp;
    const clusterId = sseEvent.predicted_cluster;
    const machineName = `Máquina ${sseEvent.machineId}`;

    const eventType = 'anomaly';

    return {
        id: sseEvent.id,
        machineName: machineName,
        eventType: eventType,
        clusterId: 'ANOMALIA',
        clusterForce: sseEvent.prediction_strength?.toFixed(2) || '0.00',
        time: new Date(timestamp).toLocaleTimeString("pt-BR", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        }),

        // Métricas do Payload
        rpm: sseEvent.rpm?.toFixed(2) || 'N/A',
        temperature: sseEvent.oilTemperature?.toFixed(2) || 'N/A',
        oilLevel: sseEvent.oilLevel?.toFixed(2) || 'N/A',
        current: sseEvent.current?.toFixed(2) || 'N/A',

        insight: sseEvent.log,

        previousClusterId: null,
        previousClusterForce: null,
    };
};

const calculateSummary = (events) => {
    return events.reduce((acc, event) => {
        acc.totalEvents += 1;

        if (event.eventType === 'anomaly') {
            acc.critical += 1;
            acc.anomalies += 1;
        }
        if (event.clusterForce && parseFloat(event.clusterForce) < 0.1) acc.lowForce += 1;

        return acc;
    }, {
        totalEvents: 0,
        critical: 0,
        warnings: 0,
        anomalies: 0,
        lowForce: 0,
    });
};

const ClusterAnalysisPage = () => {
    const theme = useTheme();
    const { clusterEvents: realtimeEvents, connectionError } = useRealtimeData();
    const [displayData, setDisplayData] = useState({ summary: calculateSummary([]), events: [] });

    useEffect(() => {
        if (realtimeEvents.length === 0) {
            setDisplayData({ summary: calculateSummary([]), events: [] });
            return;
        }

        const newFormattedEvents = realtimeEvents
            .map(formatSSEEvent)
            .filter(event => event.clusterId !== undefined);

        setDisplayData({
            summary: calculateSummary(newFormattedEvents),
            events: newFormattedEvents,
        });

    }, [realtimeEvents]);

    const isLoadingInitial = displayData.events.length === 0 && !connectionError;

    if (isLoadingInitial) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (connectionError) {
        return <Alert severity="error">Falha na conexão em tempo real: {connectionError}</Alert>;
    }

    const validEvents = displayData.events;
    const summary = displayData.summary;

    if (validEvents.length === 0) {
        return <Typography>Nenhum evento de cluster recebido.</Typography>;
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
                {/* O botão Refresh agora apenas recalcula os dados (não faz fetch REST) */}
                <IconButton
                    onClick={() => console.log("Recarregar dados: Apenas recalcula o resumo do SSE.")}
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
                <SummaryStatCard title="Total de Eventos" value={summary.totalEvents} icon={Activity} />
            </Box>

            {/* Event Log */}
            <Stack>
                {validEvents.map(event => (
                    <ClusterEventCard key={event.id} event={event} />
                ))}
            </Stack>
        </Box>
    );
};

export default ClusterAnalysisPage;
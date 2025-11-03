import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Typography,
    Grid,
    Button,
    IconButton,
    CircularProgress,
    Alert,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    Divider,
} from "@mui/material";
import {
    RefreshCw,
    GaugeCircle,
    Thermometer,
    Droplets,
    Zap,
} from "lucide-react";
// import mqtt from "mqtt";
import { fetchMachineById } from "../../services/machineService";
import MetricCard from "./components/MetricCard";
import DynamicChart from "./components/DynamicChart";

const MAX_DATA_POINTS = 30;

const generateMockDataPoint = (lastValue, min, max) => {
    let newValue = lastValue + (Math.random() - 0.5) * (max / 10);
    if (newValue < min) newValue = min;
    if (newValue > max) newValue = max;
    return {
        x: new Date().getTime(),
        y: parseFloat(newValue.toFixed(2)),
    };
};

const getInitialChartData = (val, min, max) => {
    let data = [];
    let lastVal = val;
    for (let i = 0; i < MAX_DATA_POINTS; i++) {
        const { y } = generateMockDataPoint(lastVal, min, max);
        data.push({ x: new Date().getTime() - (MAX_DATA_POINTS - i) * 1000, y });
        lastVal = y;
    }
    return data;
};


const MachineDashboard = () => {
    const { machineId } = useParams();
    const navigate = useNavigate();
    const theme = useTheme();

    const [machine, setMachine] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date().toLocaleTimeString());
    const [period, setPeriod] = useState("last_hour");
    const [selectedMachine, setSelectedMachine] = useState(machineId);

    const [rpmData, setRpmData] = useState([]);
    const [tempData, setTempData] = useState([]);
    const [oleoData, setOleoData] = useState([]);
    const [correnteData, setCorrenteData] = useState([]);

    const intervalRef = useRef(null);

    const updateMockData = useCallback(() => {
        if (!machine) return;

        setRpmData((prev) => [
            ...prev.slice(1),
            generateMockDataPoint(prev[prev.length - 1]?.y || machine.metrics.rpm.value, 0, 1800),
        ]);
        setTempData((prev) => [
            ...prev.slice(1),
            generateMockDataPoint(prev[prev.length - 1]?.y || machine.metrics.temp.value, 60, 90),
        ]);
        setOleoData((prev) => [
            ...prev.slice(1),
            generateMockDataPoint(prev[prev.length - 1]?.y || machine.metrics.oleo.value, 70, 100),
        ]);
        setCorrenteData((prev) => [
            ...prev.slice(1),
            generateMockDataPoint(prev[prev.length - 1]?.y || machine.metrics.corrente.value, 8, 16),
        ]);

        setLastUpdated(new Date().toLocaleTimeString());
    }, [machine]);

    useEffect(() => {
        const loadMachineData = async () => {
            if (!machineId) return;
            try {
                setLoading(true);
                const data = await fetchMachineById(machineId);
                setMachine(data);
                setSelectedMachine(data.id);
                setRpmData(getInitialChartData(data.metrics.rpm.value, 0, 1800));
                setTempData(getInitialChartData(data.metrics.temp.value, 60, 90));
                setOleoData(getInitialChartData(data.metrics.oleo.value, 70, 100));
                setCorrenteData(getInitialChartData(data.metrics.corrente.value, 8, 16));
                setError(null);
            } catch (e) {
                console.error("Falha ao carregar dados da máquina:", e);
                setError(e.message);
            } finally {
                setLoading(false);
            }
        };
        loadMachineData();
    }, [machineId]);

    useEffect(() => {
        intervalRef.current = setInterval(updateMockData, 3000);
        return () => {
            clearInterval(intervalRef.current);
        };
    }, [updateMockData]);


    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "80vh" }}>
                <CircularProgress />
            </Box>
        );
    }
    if (error) {
        return <Alert severity="error">Falha ao carregar dados da máquina: {error}</Alert>;
    }
    if (!machine) {
        return <Typography>Máquina não encontrada.</Typography>;
    }

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Box>
                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Monitoramento IoT</Typography>
                    <Typography variant="caption" color="text.secondary">
                        Atualizado às: {lastUpdated}
                    </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button variant="outlined" sx={{ borderRadius: 2 }} onClick={() => navigate('/main/maquinas')}>
                        Início
                    </Button>
                    <IconButton
                        onClick={updateMockData}
                        sx={{
                            border: `1px solid ${theme.palette.divider}`,
                            borderRadius: 2,
                        }}
                    >
                        <RefreshCw size={18} />
                    </IconButton>
                </Box>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', gap: 4, alignItems: 'center', mb: 2 }}>
                <FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                        Máquinas Monitoradas
                    </Typography>
                    <Select
                        value={selectedMachine}
                        onChange={(e) => navigate(`/main/dashboard/${e.target.value}`)}
                        size="small"
                        sx={{ minWidth: 200, borderRadius: 2 }}
                    >
                        <MenuItem value={machine.id}>{machine.name} - {machine.serialNumber}</MenuItem>
                    </Select>
                </FormControl>
                <FormControl>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5 }}>
                        Período de Análise
                    </Typography>
                    <Select
                        value={period}
                        onChange={(e) => setPeriod(e.target.value)}
                        size="small"
                        sx={{ minWidth: 150, borderRadius: 2 }}
                    >
                        <MenuItem value="last_15m">Últimos 15min</MenuItem>
                        <MenuItem value="last_hour">Última hora</MenuItem>
                        <MenuItem value="last_6h">Últimas 6h</MenuItem>
                        <MenuItem value="last_24h">Últimas 24h</MenuItem>
                        <MenuItem value="last_7d">Últimos 7 dias</MenuItem>
                    </Select>
                </FormControl>
            </Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 2, mt: 3 }}>
                {machine.name}
            </Typography>


            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5, mb: 3, alignItems: 'flex-start' }}>
                <Box sx={{ width: '25%', p: 1.5 }}>
                    <MetricCard
                        title="RPM"
                        icon={GaugeCircle}
                        value={rpmData[rpmData.length - 1]?.y || 0}
                        unit={machine.metrics.rpm.unit}
                        min={machine.metrics.rpm.min}
                        med={machine.metrics.rpm.med}
                        max={machine.metrics.rpm.max}
                        status="good"
                    />
                </Box>
                <Box sx={{ width: '25%', p: 1.5 }}>
                    <MetricCard
                        title="Temperatura"
                        icon={Thermometer}
                        value={tempData[tempData.length - 1]?.y || 0}
                        unit={machine.metrics.temp.unit}
                        min={machine.metrics.temp.min}
                        med={machine.metrics.temp.med}
                        max={machine.metrics.temp.max}
                        status="warning"
                    />
                </Box>
                <Box sx={{ width: '25%', p: 1.5 }}>
                    <MetricCard
                        title="Nível de Óleo"
                        icon={Droplets}
                        value={oleoData[oleoData.length - 1]?.y || 0}
                        unit={machine.metrics.oleo.unit}
                        min={machine.metrics.oleo.min}
                        med={machine.metrics.oleo.med}
                        max={machine.metrics.oleo.max}
                        status="good"
                    />
                </Box>
                <Box sx={{ width: '25%', p: 1.5 }}>
                    <MetricCard
                        title="Corrente"
                        icon={Zap}
                        value={correnteData[correnteData.length - 1]?.y || .0}
                        unit={machine.metrics.corrente.unit}
                        min={machine.metrics.corrente.min}
                        med={machine.metrics.corrente.med}
                        max={machine.metrics.corrente.max}
                        status="danger"
                    />
                </Box>
            </Box>


            <Box sx={{ display: 'flex', flexWrap: 'wrap', mx: -1.5, alignItems: 'flex-start' }}>
                <Box sx={{ width: { xs: '100%', sm: '50%', md: '50%', lg: '25%' }, p: 1.5 }}>
                    <DynamicChart
                        title="RPM"
                        seriesData={rpmData}
                        yMin={0}
                        yMax={1800}
                        unit=""
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%', md: '50%', lg: '25%' }, p: 1.5 }}>
                    <DynamicChart
                        title="Temperatura"
                        seriesData={tempData}
                        yMin={60}
                        yMax={90}
                        unit="°C"
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%', md: '50%', lg: '25%' }, p: 1.5 }}>
                    <DynamicChart
                        title="Nível de Óleo"
                        seriesData={oleoData}
                        yMin={70}
                        yMax={100}
                        unit="%"
                    />
                </Box>
                <Box sx={{ width: { xs: '100%', sm: '50%', md: '50%', lg: '25%' }, p: 1.5 }}>
                    <DynamicChart
                        title="Corrente"
                        seriesData={correnteData}
                        yMin={8}
                        yMax={16}
                        unit="A"
                    />
                </Box>
            </Box>
        </Box>
    );
};

export default MachineDashboard;
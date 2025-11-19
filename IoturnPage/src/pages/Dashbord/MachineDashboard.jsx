import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Select,
  MenuItem,
  FormControl,
  Divider,
} from "@mui/material";
import { GaugeCircle, Thermometer, Droplets, Zap } from "lucide-react";

import { fetchMachineById } from "../../services/machineService";
import MetricCard from "./components/MetricCard";
import DynamicChart from "./components/DynamicChart";

// ------------------------------------------------------
// Configurações
// ------------------------------------------------------
const MAX_DATA_POINTS = 30;

const generateMockPoint = (last, min, max) => {
  let next = last + (Math.random() - 0.5) * (max / 10);
  next = Math.min(Math.max(next, min), max);

  return {
    x: Date.now(),
    y: parseFloat(next.toFixed(2)),
  };
};

const buildInitialChart = (initialValue, min, max) => {
  const data = [];
  let last = initialValue;

  for (let i = 0; i < MAX_DATA_POINTS; i++) {
    const { y } = generateMockPoint(last, min, max);

    data.push({
      x: Date.now() - (MAX_DATA_POINTS - i) * 1000,
      y,
    });

    last = y;
  }

  return data;
};

// ------------------------------------------------------
// Dashboard
// ------------------------------------------------------
const MachineDashboard = () => {
  const { machineId } = useParams();
  const navigate = useNavigate();

  // Dados da máquina
  const [machine, setMachine] = useState(null);
  const [machineData, setMachineData] = useState({});

  // Status
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filtros
  const [period, setPeriod] = useState("last_hour");
  const [selectedMachine, setSelectedMachine] = useState(machineId);

  // Atualização SSE
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  // Gráficos
  const [rpmData, setRpmData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [oleoData, setOleoData] = useState([]);
  const [correnteData, setCorrenteData] = useState([]);

  const [rpmMax, setRpmMax] = useState(3000);
  const [tempMax, setTempMax] = useState(3000);
  const [oleoMax, setOleoMax] = useState(3000);
  const [correnteMax, setCorrenteMax] = useState(3000);

  const calcMax = (arr) => (arr.length ? Math.max(...arr.map((p) => p.y)) : 0);

  useEffect(() => setRpmMax(calcMax(rpmData)), [rpmData]);
  useEffect(() => setTempMax(calcMax(tempData)), [tempData]);
  useEffect(() => setOleoMax(calcMax(oleoData)), [oleoData]);
  useEffect(() => setCorrenteMax(calcMax(correnteData)), [correnteData]);

  // ------------------------------------------------------
  // Carregamento inicial
  // ------------------------------------------------------
  useEffect(() => {
    if (!machineId) return;

    const load = async () => {
      try {
        setLoading(true);

        const data = await fetchMachineById(machineId);
        setMachine(data);
        setSelectedMachine(data.id);

        const { metrics } = data;

        setRpmData(buildInitialChart(metrics.rpm.value, 0, rpmMax));
        setTempData(buildInitialChart(metrics.temp.value, 0, tempMax));
        setOleoData(buildInitialChart(metrics.oleo.value, 0, oleoMax));
        setCorrenteData(
          buildInitialChart(metrics.corrente.value, 0, correnteMax)
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [machineId]);

  // ------------------------------------------------------
  // SSE
  // ------------------------------------------------------
  useEffect(() => {
    if (!machineId) return;

    const url = `${
      import.meta.env.VITE_APP_API_URL
    }/machines/stream/${machineId}`;
    const source = new EventSource(url);

    source.onmessage = (event) => {
      try {
        const incoming = JSON.parse(event.data);

        setMachineData((prev) => ({ ...prev, ...incoming }));

        const addPoint = (timestamp, value, setter) => {
          const point = { x: new Date(timestamp).getTime(), y: value };
          setter((prev) => [...prev.slice(1), point]);
        };

        if (incoming.rpm && incoming.timeStampRpm)
          addPoint(incoming.timeStampRpm, incoming.rpm, setRpmData);

        if (incoming.temperatura && incoming.timeStampTemperatura)
          addPoint(
            incoming.timeStampTemperatura,
            incoming.temperatura,
            setTempData
          );

        if (incoming.nivel && incoming.timeStampNivel)
          addPoint(incoming.timeStampNivel, incoming.nivel, setOleoData);

        if (incoming.corrente && incoming.timeStampCorrente)
          addPoint(
            incoming.timeStampCorrente,
            incoming.corrente,
            setCorrenteData
          );

        setLastUpdated(new Date().toLocaleTimeString());
      } catch (err) {
        console.error("Erro no SSE:", err);
      }
    };

    source.onerror = () => source.close();
    return () => source.close();
  }, [machineId]);

  // ------------------------------------------------------
  // UI: estados iniciais
  // ------------------------------------------------------
  if (loading)
    return (
      <Box
        sx={{
          height: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );

  if (error)
    return <Alert severity="error">Erro ao carregar máquina: {error}</Alert>;

  if (!machine) return <Typography>Máquina não encontrada.</Typography>;

  // ------------------------------------------------------
  // Render
  // ------------------------------------------------------
  return (
    <Box>
      {/* Topo */}
      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Monitoramento IoT
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Atualizado às: {lastUpdated}
          </Typography>
        </Box>

        <Button
          variant="outlined"
          sx={{ borderRadius: 2 }}
          onClick={() => navigate("/main/maquinas")}
        >
          Início
        </Button>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* Filtros */}
      <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
        {/* Seleção máquina */}
        <FormControl>
          <Typography variant="caption" color="text.secondary">
            Máquinas Monitoradas
          </Typography>

          <Select
            size="small"
            sx={{ minWidth: 200, borderRadius: 2 }}
            value={selectedMachine}
            onChange={(e) => navigate(`/main/dashboard/${e.target.value}`)}
          >
            <MenuItem value={machine.id}>
              {machine.name} – {machine.serialNumber}
            </MenuItem>
          </Select>
        </FormControl>

        {/* Período */}
        <FormControl>
          <Typography variant="caption" color="text.secondary">
            Período de Análise
          </Typography>

          <Select
            size="small"
            sx={{ minWidth: 150, borderRadius: 2 }}
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value="last_15m">Últimos 15 min</MenuItem>
            <MenuItem value="last_hour">Última hora</MenuItem>
            <MenuItem value="last_6h">Últimas 6 h</MenuItem>
            <MenuItem value="last_24h">Últimas 24 h</MenuItem>
            <MenuItem value="last_7d">Últimos 7 dias</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Typography variant="h4" fontWeight={700} sx={{ mb: 3 }}>
        {machine.name}
      </Typography>

      {/* Métricas */}
      <Box sx={{ display: "flex", flexWrap: "wrap", mx: -1.5 }}>
        <MetricWrapper>
          <MetricCard
            title="RPM"
            icon={GaugeCircle}
            value={machineData.rpm ?? machine.metrics.rpm.value}
            {...machine.metrics.rpm}
            status="good"
          />
        </MetricWrapper>

        <MetricWrapper>
          <MetricCard
            title="Temperatura"
            icon={Thermometer}
            value={machineData.temperatura ?? machine.metrics.temp.value}
            {...machine.metrics.temp}
            status="warning"
          />
        </MetricWrapper>

        <MetricWrapper>
          <MetricCard
            title="Nível de Óleo"
            icon={Droplets}
            value={machineData.nivel ?? machine.metrics.oleo.value}
            {...machine.metrics.oleo}
            status="good"
          />
        </MetricWrapper>

        <MetricWrapper>
          <MetricCard
            title="Corrente"
            icon={Zap}
            value={machineData.corrente ?? machine.metrics.corrente.value}
            {...machine.metrics.corrente}
            status="danger"
          />
        </MetricWrapper>
      </Box>

      {/* Gráficos */}
      <Box sx={{ display: "flex", flexWrap: "wrap", mx: -1.5 }}>
        <ChartWrapper>
          <DynamicChart
            title="RPM"
            seriesData={rpmData}
            yMin={0}
            yMax={rpmMax}
          />
        </ChartWrapper>

        <ChartWrapper>
          <DynamicChart
            title="Temperatura"
            seriesData={tempData}
            yMin={0}
            yMax={tempMax}
            unit="°C"
          />
        </ChartWrapper>

        <ChartWrapper>
          <DynamicChart
            title="Nível de Óleo"
            seriesData={oleoData}
            yMin={0}
            yMax={oleoMax}
            unit="%"
          />
        </ChartWrapper>

        <ChartWrapper>
          <DynamicChart
            title="Corrente"
            seriesData={correnteData}
            yMin={0}
            yMax={correnteMax}
            unit="A"
          />
        </ChartWrapper>
      </Box>
    </Box>
  );
};

// ------------------------------------------------------
// Subcomponentes auxiliares
// ------------------------------------------------------
const MetricWrapper = ({ children }) => (
  <Box sx={{ width: "25%", p: 1.5 }}>{children}</Box>
);

const ChartWrapper = ({ children }) => (
  <Box sx={{ width: { xs: "100%", sm: "50%", lg: "25%" }, p: 1.5 }}>
    {children}
  </Box>
);

export default MachineDashboard;

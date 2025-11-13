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
import { fetchMachineById } from "../../services/machineService";
import MetricCard from "./components/MetricCard";
import DynamicChart from "./components/DynamicChart";

const MAX_DATA_POINTS = 30;

// Gera os gráficos valores minimos e max.
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
  // exemplo
  // data = {machineId: 1, rpm: 1175.25, timeStampRpm: '2025-11-13T19:45:46.362Z'}
  return data;
};

const MachineDashboard = () => {
  const { machineId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const [machineData, setMachineData] = useState({});

  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );
  const [period, setPeriod] = useState("last_hour");
  const [selectedMachine, setSelectedMachine] = useState(machineId);

  const [rpmData, setRpmData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [oleoData, setOleoData] = useState([]);
  const [correnteData, setCorrenteData] = useState([]);

  // Um loop infinito após a inicialização enviando constantemente valores para os useStates initialCharData,
  useEffect(() => {
    const loadMachineData = async () => {
      if (!machineId) return;
      try {
        setLoading(true);
        const data = await fetchMachineById(machineId);
        setMachine(data);
        setSelectedMachine(data.id);

        // Gráficos
        setRpmData(
          getInitialChartData(
            data.metrics.rpm.value,
            data.metrics.rpm.min,
            data.metrics.rpm.max
          )
        );

        setTempData(
          getInitialChartData(
            data.metrics.temp.value,
            data.metrics.temp.min,
            data.metrics.temp.max
          )
        );
        setOleoData(
          getInitialChartData(
            data.metrics.oleo.value,
            data.metrics.oleo.min,
            data.metrics.oleo.max
          )
        );
        setCorrenteData(
          getInitialChartData(
            data.metrics.corrente.value,
            data.metrics.corrente.min,
            data.metrics.corrente.max
          )
        );

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

  // 3. Hook de Efeito para gerenciar a conexão SSE realiza a ignição do programa
  useEffect(() => {
    if (!machineId) return;

    const url = `${
      import.meta.env.VITE_APP_API_URL
    }/machines/stream/${machineId}`;
    let sseSource = new EventSource(url);

    sseSource.onmessage = (event) => {
      try {
        const newData = JSON.parse(event.data);

        // MODIFICAÇÃO: Mescla o estado anterior com os novos dados
        setMachineData((prevData) => ({
          ...prevData,
          ...newData,
        }));

        if (newData.rpm !== undefined && newData.timeStampRpm) {
          const dataPoint = {
            x: new Date(newData.timeStampRpm).getTime(),
            y: newData.rpm,
          };
          setRpmData((prev) => [...prev.slice(1), dataPoint]);
        }

        if (newData.temperatura !== undefined && newData.timeStampTemperatura) {
          const dataPoint = {
            x: new Date(newData.timeStampTemperatura).getTime(),
            y: newData.temperatura,
          };
          setTempData((prev) => [...prev.slice(1), dataPoint]);
        }

        if (newData.nivel !== undefined && newData.timeStampNivel) {
          const dataPoint = {
            x: new Date(newData.timeStampNivel).getTime(),
            y: newData.nivel,
          };
          setOleoData((prev) => [...prev.slice(1), dataPoint]);
        }

        if (newData.corrente !== undefined && newData.timeStampCorrente) {
          const dataPoint = {
            x: new Date(newData.timeStampCorrente).getTime(),
            y: newData.corrente,
          };
          setCorrenteData((prev) => [...prev.slice(1), dataPoint]);
        }

        setLastUpdated(new Date().toLocaleTimeString());
      } catch (e) {
        console.error("Falha ao processar dado do SSE:", e);
      }
    };
    sseSource.onerror = (err) => {
      console.error("Erro no EventSource:", err);
      sseSource.close();
    };

    // Função de limpeza: Fecha a conexão ao sair da página
    return () => {
      if (sseSource) {
        sseSource.close();
      }
    };
  }, [machineId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return (
      <Alert severity="error">
        Falha ao carregar dados da máquina: {error}
      </Alert>
    );
  }
  if (!machine) {
    return <Typography>Máquina não encontrada.</Typography>;
  }

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Box>
          <Typography variant="h5" sx={{ fontWeight: "bold" }}>
            Monitoramento IoT
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Atualizado às: {lastUpdated}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            sx={{ borderRadius: 2 }}
            onClick={() => navigate("/main/maquinas")}
          >
            Início
          </Button>
        </Box>
      </Box>
      <Divider sx={{ my: 2 }} />
      <Box sx={{ display: "flex", gap: 4, alignItems: "center", mb: 2 }}>
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
            <MenuItem value={machine.id}>
              {machine.name} - {machine.serialNumber}
            </MenuItem>
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
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2, mt: 3 }}>
        {machine.name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mx: -1.5,
          mb: 3,
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ width: "25%", p: 1.5 }}>
          <MetricCard
            title="RPM"
            icon={GaugeCircle}
            value={machineData.rpm ?? machine.metrics.rpm.value}
            unit={machine.metrics.rpm.unit}
            min={machine.metrics.rpm.min}
            med={machine.metrics.rpm.med}
            max={machine.metrics.rpm.max}
            status="good"
          />
        </Box>
        <Box sx={{ width: "25%", p: 1.5 }}>
          <MetricCard
            title="Temperatura"
            icon={Thermometer}
            value={machineData.temperatura ?? machine.metrics.temp.value}
            unit={machine.metrics.temp.unit}
            min={machine.metrics.temp.min}
            med={machine.metrics.temp.med}
            max={machine.metrics.temp.max}
            status="warning"
          />
        </Box>
        <Box sx={{ width: "25%", p: 1.5 }}>
          <MetricCard
            title="Nível de Óleo"
            icon={Droplets}
            value={machineData.nivel ?? machine.metrics.oleo.value}
            unit={machine.metrics.oleo.unit}
            min={machine.metrics.oleo.min}
            med={machine.metrics.oleo.med}
            max={machine.metrics.oleo.max}
            status="good"
          />
        </Box>
        <Box sx={{ width: "25%", p: 1.5 }}>
          <MetricCard
            title="Corrente"
            icon={Zap}
            value={machineData.corrente ?? machine.metrics.corrente.value}
            unit={machine.metrics.corrente.unit}
            min={machine.metrics.corrente.min}
            med={machine.metrics.corrente.med}
            max={machine.metrics.corrente.max}
            status="danger"
          />
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          mx: -1.5,
          alignItems: "flex-start",
        }}
      >
        <Box
          sx={{
            width: { xs: "100%", sm: "50%", md: "50%", lg: "25%" },
            p: 1.5,
          }}
        >
          <DynamicChart
            title="RPM"
            seriesData={rpmData} //WIP
            yMin={machine.metrics.rpm.min}
            yMax={machine.metrics.rpm.max}
            unit=""
          />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", sm: "50%", md: "50%", lg: "25%" },
            p: 1.5,
          }}
        >
          <DynamicChart
            title="Temperatura"
            seriesData={tempData}
            yMin={machine.metrics.temp.min}
            yMax={machine.metrics.temp.max}
            unit="°C"
          />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", sm: "50%", md: "50%", lg: "25%" },
            p: 1.5,
          }}
        >
          <DynamicChart
            title="Nível de Óleo"
            seriesData={oleoData}
            yMin={machine.metrics.oleo.min}
            yMax={machine.metrics.oleo.max}
            unit="%"
          />
        </Box>
        <Box
          sx={{
            width: { xs: "100%", sm: "50%", md: "50%", lg: "25%" },
            p: 1.5,
          }}
        >
          <DynamicChart
            title="Corrente"
            seriesData={correnteData}
            yMin={machine.metrics.corrente.min}
            yMax={machine.metrics.corrente.max}
            unit="A"
          />
        </Box>
      </Box>
    </Box>
  );
};

export default MachineDashboard;

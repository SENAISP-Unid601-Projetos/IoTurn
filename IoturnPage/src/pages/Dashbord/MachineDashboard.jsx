import React, { useState, useEffect, useRef } from "react";
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
  const [tempMax, setTempMax] = useState(100);
  const [oleoMax, setOleoMax] = useState(100);
  const [correnteMax, setCorrenteMax] = useState(50);

  // Referência para o offset de tempo
  const timeOffsetRef = useRef(0);

  // ------------------------------------------------------
  // Detecção e correção do offset de tempo
  // ------------------------------------------------------
  const calculateTimeOffset = (serverTimestamp) => {
    const serverTime = new Date(serverTimestamp).getTime();
    const localTime = Date.now();
    return localTime - serverTime;
  };

  const getAdjustedTimestamp = (serverTimestamp) => {
    if (!serverTimestamp) return Date.now();

    const serverTime = new Date(serverTimestamp).getTime();
    // Se for um timestamp inválido, usa o tempo local
    if (isNaN(serverTime)) return Date.now();

    // Aplica o offset calculado
    return serverTime + timeOffsetRef.current;
  };

  // ------------------------------------------------------
  // Atualização em tempo real do tamanho dos gráficos
  // ------------------------------------------------------
  const calcMax = (arr) => {
    if (arr.length === 0) return 0;
    const max = Math.max(...arr.map((p) => p.y));
    // Adiciona uma margem de 10% para melhor visualização
    return max * 1.1;
  };

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

        // Inicializa os gráficos vazios
        setRpmData([]);
        setTempData([]);
        setOleoData([]);
        setCorrenteData([]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [machineId]);

  // ------------------------------------------------------
  // SSE - Recebimento de dados em tempo real
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

        // Calcula o offset na primeira mensagem válida
        if (timeOffsetRef.current === 0) {
          const timestamp =
            incoming.timeStampRpm ||
            incoming.timeStampTemperatura ||
            incoming.timeStampNivel ||
            incoming.timeStampCorrente;

          if (timestamp) {
            timeOffsetRef.current = calculateTimeOffset(timestamp);
          }
        }

        const addPoint = (timestamp, value, setter) => {
          if (timestamp == null || value == null) return;

          const adjustedTimestamp = getAdjustedTimestamp(timestamp);

          const point = {
            x: adjustedTimestamp,
            y: parseFloat(value),
          };

          setter((prev) => {
            // Verifica se já existe um ponto idêntico (ou mesmo timestamp)
            const exists = prev.some((p) => p.x === point.x && p.y === point.y);
            if (exists) {
              return prev; // Não adiciona duplicado
            }
            const newData = [...prev, point];
            return newData.slice(-MAX_DATA_POINTS);
          });
        };

        // Adiciona pontos aos gráficos com timestamps corrigidos
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

    source.onerror = (err) => {
      console.error("Erro na conexão SSE:", err);
      source.close();
    };

    return () => source.close();
  }, [machineId]);

  // ------------------------------------------------------
  // Função para forçar recálculo do offset
  // ------------------------------------------------------
  const recalculateTimeOffset = () => {
    // Busca o último timestamp disponível de qualquer métrica
    const lastTimestamp =
      machineData.timeStampRpm ||
      machineData.timeStampTemperatura ||
      machineData.timeStampNivel ||
      machineData.timeStampCorrente;

    if (lastTimestamp) {
      timeOffsetRef.current = calculateTimeOffset(lastTimestamp);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

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
            {timeOffsetRef.current !== 0 && (
              <span style={{ marginLeft: 8 }}>
                (Offset: {Math.round(timeOffsetRef.current / 1000)}s)
              </span>
            )}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={recalculateTimeOffset}
            title="Recalcular diferença de tempo"
          >
            Sincronizar Tempo
          </Button>
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
            yMax={rpmMax || 3000}
          />
        </ChartWrapper>

        <ChartWrapper>
          <DynamicChart
            title="Temperatura"
            seriesData={tempData}
            yMin={0}
            yMax={tempMax || 100}
            unit="°C"
          />
        </ChartWrapper>

        <ChartWrapper>
          <DynamicChart
            title="Nível de Óleo"
            seriesData={oleoData}
            yMin={0}
            yMax={oleoMax || 100}
            unit="%"
          />
        </ChartWrapper>

        <ChartWrapper>
          <DynamicChart
            title="Corrente"
            seriesData={correnteData}
            yMin={0}
            yMax={correnteMax || 50}
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

import React, { useState, useEffect, useRef, useCallback } from "react";
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
import { fetchAllMachineData } from "../../services/machineService";
import { useRealtimeData } from "../../context/RealtimeDataProvider";

const MAX_DATA_POINTS = 30;

const MachineDashboard = () => {
  const { machineId } = useParams();
  const { latestMachineData, connectionError } = useRealtimeData();
  const navigate = useNavigate();

  const [machine, setMachine] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [period, setPeriod] = useState("last_hour");
  const [selectedMachine, setSelectedMachine] = useState(machineId);

  const [dataMachines, setDataMachines] = useState('');

  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString()
  );

  const [rpmData, setRpmData] = useState([]);
  const [tempData, setTempData] = useState([]);
  const [oleoData, setOleoData] = useState([]);
  const [correnteData, setCorrenteData] = useState([]);

  const [rpmMax, setRpmMax] = useState(3000);
  const [tempMax, setTempMax] = useState(100);
  const [oleoMax, setOleoMax] = useState(100);
  const [correnteMax, setCorrenteMax] = useState(50);

  const timeOffsetRef = useRef(0);

  const calculateTimeOffset = (serverTimestamp) => {
    const serverTime = new Date(serverTimestamp).getTime();
    const localTime = Date.now();
    return localTime - serverTime;
  };

  const getAdjustedTimestamp = (serverTimestamp) => {
    if (!serverTimestamp) return Date.now();

    const serverTime = new Date(serverTimestamp).getTime();
    if (isNaN(serverTime)) return Date.now();

    return serverTime + timeOffsetRef.current;
  };

  const addPoint = useCallback((timestamp, value, setter) => {
    if (timestamp == null || value == null) return;

    const adjustedTimestamp = getAdjustedTimestamp(timestamp);

    const point = {
      x: adjustedTimestamp,
      y: parseFloat(value),
    };

    setter((prev) => {
      const exists = prev.some((p) => p.x === point.x && p.y === point.y);
      if (exists) {
        return prev;
      }
      const newData = [...prev, point];
      return newData.slice(-MAX_DATA_POINTS);
    });
  }, [getAdjustedTimestamp]);

  const calcMax = (arr) => {
    if (arr.length === 0) return 0;
    const max = Math.max(...arr.map((p) => p.y));
    return max * 1.1;
  };

  useEffect(() => setRpmMax(calcMax(rpmData)), [rpmData]);
  useEffect(() => setTempMax(calcMax(tempData)), [tempData]);
  useEffect(() => setOleoMax(calcMax(oleoData)), [oleoData]);
  useEffect(() => setCorrenteMax(calcMax(correnteData)), [correnteData]);

  useEffect(() => {
    if (!machineId) return;

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchMachineById(machineId);
        const dataAllMachine = await fetchAllMachineData();
        setMachine(data);
        setDataMachines(dataAllMachine);

        setSelectedMachine(machineId);

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

  useEffect(() => {
    if (!machineId) return;

    const incoming = latestMachineData[machineId];
    if (!incoming) return;

    console.log(`[SSE - Máquina ${machineId}] DADOS RECEBIDOS:`, incoming);

    if (timeOffsetRef.current === 0) {
      const timestamp =
        incoming.timeStampRpm ||
        incoming.timeStampTemperatura ||
        incoming.timeStampNivel ||
        incoming.timeStampCorrente ||
        incoming.timestamp;

      if (timestamp) {
        timeOffsetRef.current = calculateTimeOffset(timestamp);
      }
    }

    if (incoming.rpm && incoming.timeStampRpm)
      addPoint(incoming.timeStampRpm, incoming.rpm, setRpmData);

    if ((incoming.temperatura || incoming.oilTemperature) && incoming.timeStampTemperatura)
      addPoint(
        incoming.timeStampTemperatura,
        incoming.temperatura ?? incoming.oilTemperature,
        setTempData
      );

    if ((incoming.nivel || incoming.oilLevel) && incoming.timeStampNivel)
      addPoint(incoming.timeStampNivel, incoming.nivel ?? incoming.oilLevel, setOleoData);

    if ((incoming.corrente || incoming.current) && incoming.timeStampCorrente)
      addPoint(
        incoming.timeStampCorrente,
        incoming.corrente ?? incoming.current,
        setCorrenteData
      );

    setLastUpdated(new Date().toLocaleTimeString());

  }, [machineId, latestMachineData, addPoint]);

  const recalculateTimeOffset = () => {
    const currentMachineData = latestMachineData[machineId] || {};

    const lastTimestamp =
      currentMachineData.timeStampRpm ||
      currentMachineData.timeStampTemperatura ||
      currentMachineData.timeStampNivel ||
      currentMachineData.timeStampCorrente ||
      currentMachineData.timestamp;

    if (lastTimestamp) {
      timeOffsetRef.current = calculateTimeOffset(lastTimestamp);
      setLastUpdated(new Date().toLocaleTimeString());
    }
  };

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

  if (error || connectionError)
    return <Alert severity="error">Erro ao carregar máquina: {error || connectionError}</Alert>;

  if (!machine) return <Typography>Máquina não encontrada.</Typography>;

  const currentMachineData = latestMachineData[machineId] || {};

  return (
    <Box>
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
            {connectionError && (
              <span style={{ marginLeft: 8, color: 'red' }}>
                (Erro de Conexão)
              </span>
            )}
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
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
            {Array.isArray(dataMachines) && dataMachines.map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name} – {m.serialNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

      <Box sx={{ display: "flex", flexWrap: "wrap", mx: -1.5 }}>
        <MetricWrapper>
          <MetricCard
            title="RPM"
            icon={GaugeCircle}
            value={currentMachineData.rpm ?? machine.metrics?.rpm?.value}
            unit={machine.metrics?.rpm?.unit}
            min={machine.metrics?.rpm?.min}
            max={machine.metrics?.rpm?.max}
            status="good"
            dataSeries={rpmData}
          />
        </MetricWrapper>

        <MetricWrapper>
          <MetricCard
            title="Temperatura"
            icon={Thermometer}
            value={currentMachineData.temperatura ?? currentMachineData.oilTemperature ?? machine.metrics?.temp?.value}
            unit={machine.metrics?.temp?.unit}
            min={machine.metrics?.temp?.min}
            max={machine.metrics?.temp?.max}
            status="warning"
            dataSeries={tempData}
          />
        </MetricWrapper>

        <MetricWrapper>
          <MetricCard
            title="Nível de Óleo"
            icon={Droplets}
            value={currentMachineData.nivel ?? currentMachineData.oilLevel ?? machine.metrics?.oleo?.value}
            unit={machine.metrics?.oleo?.unit}
            min={machine.metrics?.oleo?.min}
            max={machine.metrics?.oleo?.max}
            status="good"
            dataSeries={oleoData}
          />
        </MetricWrapper>

        <MetricWrapper>
          <MetricCard
            title="Corrente"
            icon={Zap}
            value={currentMachineData.corrente ?? currentMachineData.current ?? machine.metrics?.corrente?.value}
            unit={machine.metrics?.corrente?.unit}
            min={machine.metrics?.corrente?.min}
            max={machine.metrics?.corrente?.max}
            status="danger"
            dataSeries={correnteData}
          />
        </MetricWrapper>
      </Box>

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

const MetricWrapper = ({ children }) => (
  <Box sx={{ width: "25%", p: 1.5 }}>{children}</Box>
);

const ChartWrapper = ({ children }) => (
  <Box sx={{ width: { xs: "100%", sm: "50%", lg: "25%" }, p: 1.5 }}>
    {children}
  </Box>
);

export default MachineDashboard;
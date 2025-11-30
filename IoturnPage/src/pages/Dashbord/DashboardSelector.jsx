import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Alert,
  useTheme,
  Divider,
} from "@mui/material";
import MachineCard from "./components/MachineCard";
import { fetchAllMachineData } from "../../services/machineService";
import { Activity } from "lucide-react";
import { useRealtimeData } from "../../context/RealtimeDataProvider"; // Importa o hook

const DashboardSelectionPage = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const theme = useTheme();
  
  // Consumir dados globais
  const { latestMachineData } = useRealtimeData(); 

  // Efeito para carregar dados iniciais (via REST) - Inalterado
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllMachineData();
        setMachines(data);
        if (data.length > 0) {
          setSelectedMachineId(data[0].id);
        }
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Efeito NOVO: Substitui o SSE por consumo do contexto
  // O bloco useEffect anterior (com machines.forEach e new EventSource) foi REMOVIDO.
  useEffect(() => {
    if (Object.keys(latestMachineData).length === 0) return;

    setMachines((prevMachines) => {
      return prevMachines.map((m) => {
        const newData = latestMachineData[m.id];
        if (newData) {
          let updatedMetrics = { ...m.metrics };

          // Atualiza as métricas (suporta dados individuais ou do payload de cluster)
          if (newData.rpm !== undefined) {
            updatedMetrics.rpm = {
              ...updatedMetrics.rpm,
              value: newData.rpm,
            };
          }
          if (newData.temperatura !== undefined || newData.oilTemperature !== undefined) {
            updatedMetrics.temp = {
              ...updatedMetrics.temp,
              value: newData.temperatura ?? newData.oilTemperature, // Usa a métrica mais recente
            };
          }
          if (newData.nivel !== undefined || newData.oilLevel !== undefined) {
             updatedMetrics.oleo = {
                ...updatedMetrics.oleo,
                value: newData.nivel ?? newData.oilLevel, // Usa a métrica mais recente
            };
          }
          if (newData.corrente !== undefined || newData.current !== undefined) {
            updatedMetrics.corrente = {
              ...updatedMetrics.corrente,
              value: newData.corrente ?? newData.current, // Usa a métrica mais recente
            };
          }
          
          return { ...m, metrics: updatedMetrics };
        }
        return m;
      });
    });
  }, [latestMachineData]); // Dependência do estado global

  const handleCardClick = (id) => {
    setSelectedMachineId(id);
  };

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">Falha ao carregar os dados</Alert>;
    }

    return (
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {machines.map((machine) => (
          <Box
            key={machine.id}
            sx={{
              p: 1,
              width: { xs: "100%", sm: "45%", md: "30%" },
              cursor: "pointer",
            }}
          >
            <MachineCard
              machine={machine}
              isSelected={machine.id === selectedMachineId}
              onClick={handleCardClick}
            />
          </Box>
        ))}
      </Grid>
    );
  };

  return (
    <Box sx={{ paddingLeft: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1 }}>
          <Activity color={theme.palette.primary.dark} size={30} />
          <Typography variant="h4" sx={{ fontWeight: "bold" }}>
            Máquinas disponíveis
          </Typography>
        </Box>
      </Box>
      <Divider sx={{ my: 4 }} />
      {renderContent()}
    </Box>
  );
};

export default DashboardSelectionPage;
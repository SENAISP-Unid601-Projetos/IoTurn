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

const DashboardSelectionPage = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const theme = useTheme();

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
      return (
        <Alert severity="error">Falha ao carregar os dados</Alert>
      );
    }

    return (
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        {machines.map((machine) => (
          <Box
            key={machine.id}
            sx={{ p: 1, width: { xs: "100%", sm: "45%", md: "30%" }, cursor: "pointer" }}
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
    <Box sx={{paddingLeft: 4}}>
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

import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MachineCard from '../../components/MachineCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { fetchAllMachineData } from '../../services/machineService'; 

const DashboardSelectionPage = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchAllMachineData(); 
        setMachines(data);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      );
    }
    if (error) {
      return <Alert severity="error">Falha ao carregar os dados: {error}</Alert>;
    }
    return (
      <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
        {machines.map((machine) => (
          <MachineCard key={machine.id} machine={machine} />
        ))}
      </Box>
    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4">Selecionar Máquina</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Escolha uma máquina para monitorar
          </Typography>
        </Box>
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DashboardSelectionPage;
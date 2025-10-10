import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import { Box, Typography, CircularProgress, Alert, useTheme,Divider } from '@mui/material';
import MachineCard from '../../components/MachineCard';
import { fetchAllMachineData } from '../../services/machineService';
import { Activity } from 'lucide-react';


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
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      );
    }

    if (error) {
      return <Alert severity="error">Falha ao carregar os dados: {error}</Alert>;
    }

    return (
      <Box
  sx={{
    display: 'flex',
    flexWrap: 'wrap',
    gap: 3,
    justifyContent: 'space-between',
  }}
>
  {machines.map((machine) => (
    <Box
      key={machine.id}
      sx={{
        flex: '1 1 30%', // 3 por linha em telas grandes
        minWidth: 300,   
        display: 'flex',
      }}
    >
      <MachineCard
        machine={machine}
        isSelected={machine.id === selectedMachineId}
        onClick={handleCardClick}
      />
    </Box>
  ))}
</Box>

    );
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', backgroundColor: 'background.default' }}>
      <Sidebar selectedMachineId={selectedMachineId} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
         <Box sx={{ mb: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
            <Activity color={theme.palette.text.primary} size={30} />
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>Máquinas disponíveis</Typography>
          </Box>
          <Typography sx={{ color: 'text.secondary', pl: '48px' }}>
            Escolha uma máquina para monitorar
          </Typography>
        </Box>
         <Divider sx={{ my: 4 }} /> 
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DashboardSelectionPage;
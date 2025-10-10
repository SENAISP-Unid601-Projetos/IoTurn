import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MachineCard from '../../components/MachineCard';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import { fetchAllMachineData } from '../../services/machineService';
import Grid from '@mui/material/Grid';

const DashboardSelectionPage = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMachineId, setSelectedMachineId] = useState(null); 

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
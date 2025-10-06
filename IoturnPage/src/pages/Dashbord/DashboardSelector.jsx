import React from 'react';
import Sidebar from '../../components/Sidebar';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import MachineCard from '../../components/MachineCards';

// Vamos usar os dados mockados que criamos antes para o exemplo funcionar
// No seu caso, estes dados viriam do 'useState' e 'useEffect' com sua API
const mockMachines = [
  { id: 1, status: 'online', name: 'Torno CNC Setor A', model: 'HELTEC-A8F3B2', company: 'Indústria Metalúrgica Silva LTDA', lastUpdate: '2 min atrás', metrics: [{ name: 'RPM', value: 1520, status: 'normal' }, { name: 'Temp', value: 72, unit: '°C', status: 'normal' }, { name: 'Óleo', value: 85, unit: '%', status: 'normal' }, { name: 'Corrente', value: 12.3, unit: 'A', status: 'normal' }] },
  { id: 2, status: 'alert', name: 'Fresadora Setor B', model: 'HELTEC-C4D9E1', company: 'Fábrica de Componentes Tech SA', lastUpdate: '1 min atrás', metrics: [{ name: 'RPM', value: 1680, status: 'normal' }, { name: 'Temp', value: 82, unit: '°C', status: 'warning' }, { name: 'Óleo', value: 78, unit: '%', status: 'normal' }, { name: 'Corrente', value: 14.1, unit: 'A', status: 'normal' }] },
  { id: 3, status: 'offline', name: 'Prensa Hidráulica Setor C', model: 'HELTEC-F7A2C8', company: 'Manufatura Industrial Brasil', lastUpdate: '15 min atrás', metrics: [{ name: 'RPM', value: 8, status: 'danger' }, { name: 'Temp', value: 45, unit: '°C', status: 'normal' }, { name: 'Óleo', value: 92, unit: '%', status: 'normal' }, { name: 'Corrente', value: 0, unit: 'A', status: 'danger' }] },
];


const DashboardSelectionPage = () => {
  return (
    <Box
      sx={{
        // ERRO 2: Faltava o display: 'flex' para o layout principal
        display: 'flex',
        backgroundColor: 'background.default',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <Sidebar />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

        {/* Cabeçalho da página (seu código aqui estava correto) */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4">Selecionar Máquina</Typography>
          <Typography sx={{ color: 'text.secondary' }}>
            Escolha uma máquina para monitorar
          </Typography>
        </Box>

        {/* Contêiner para os cards (seu código aqui estava correto) */}
        <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
          
          {/* ERRO 4: Passando os dados para os cards usando .map() */}
          {mockMachines.map((machine) => (
            <MachineCard key={machine.id} machine={machine} />
          ))}
          
        </Box>
      </Box>
    </Box> 
  
  );
};

export default DashboardSelectionPage;
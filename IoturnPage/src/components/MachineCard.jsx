import React from 'react';
import { Card, CardContent, Typography, Box, Grid, useTheme } from '@mui/material';
import { ArrowRight, GaugeCircle, Thermometer, Droplets, Zap } from 'lucide-react';

const statusColors = {
  online: '#238636',
  alert: '#dbab09',
  offline: '#8b949e',
};

const iconMap = {
  RPM: GaugeCircle,
  Temp: Thermometer,
  Óleo: Droplets,
  Corrente: Zap,
};

// --- COMPONENTE AUXILIAR PARA CADA ITEM DE MÉTRICA ---
// Isso ajuda a não repetir o código
const MetricItem = ({ metric, theme }) => {
  // Se a métrica não for encontrada, não renderiza nada
  if (!metric) return null;

  const IconComponent = iconMap[metric.name];
  let metricColor = theme.palette.text.primary;
  if (metric.status === 'warning') metricColor = theme.palette.warning.main;
  if (metric.status === 'danger') metricColor = theme.palette.error.main;

  return (
    <Box>
      <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', mb: 0.5 }}>
        <IconComponent
          color={theme.palette.text.secondary}
          size={16}
          style={{ marginRight: theme.spacing(0.5) }}
        />
        {metric.name}
      </Typography>
      <Typography variant="h6" sx={{ color: metricColor, fontWeight: 'bold' }}>
        {metric.value}{metric.unit}
      </Typography>
    </Box>
  );
};


const MachineCard = ({ machine }) => {
  const theme = useTheme();

  // Para garantir que pegamos a métrica certa, usamos .find()
  // Isso torna o código mais robusto, não dependendo da ordem do array
  const rpmMetric = machine.metrics.find(m => m.name === 'RPM');
  const tempMetric = machine.metrics.find(m => m.name === 'Temp');
  const oleoMetric = machine.metrics.find(m => m.name === 'Óleo');
  const correnteMetric = machine.metrics.find(m => m.name === 'Corrente');

  return (
    <Card sx={{
      //Rever reponsibilidade 
      width: "30%",
      backgroundColor: 'background.paper',
      borderRadius: 3,
      color: 'text.primary',
      border: `1px solid ${machine.status === 'online' ? theme.palette.primary.main : 'transparent'}`,
      cursor: 'pointer',
      '&:hover': {
        borderColor: theme.palette.primary.dark,
      },
    }}>
      <CardContent>
        {/* Parte superior do card (continua igual) */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: statusColors[machine.status] || 'grey.500' }} />
          <ArrowRight color={theme.palette.text.secondary} size={20} />
        </Box>
        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {machine.name} {machine.sector}
        </Typography>
        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.875rem' }}>
          {machine.machineId}
        </Typography>
        <Typography variant="body2">{machine.company}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>{machine.lastUpdate}</Typography>
        
        {/* --- NOVA ESTRUTURA DA GRADE DE MÉTRICAS --- */}
        <Grid container spacing={2} sx={{ mt: 2 ,justifyContent: "space-between", marginInline: "1rem"}}>
          {/* Coluna da Esquerda */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <MetricItem metric={rpmMetric} theme={theme} />
              <MetricItem metric={oleoMetric} theme={theme} />
            </Box>
          </Grid>

          {/* Coluna da Direita */}
          <Grid item xs={6}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 ,}}>
              <MetricItem metric={tempMetric} theme={theme} />
              <MetricItem metric={correnteMetric} theme={theme} />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MachineCard;
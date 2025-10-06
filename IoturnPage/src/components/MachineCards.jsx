import React from 'react';
// Importe os componentes MUI que ainda usamos
import { Card, CardContent, Typography, Box, Grid, useTheme } from '@mui/material';

// 1. IMPORTE OS ÍCONES DO LUCIDE-REACT
import { ArrowRight, GaugeCircle, Thermometer, Droplets, Zap } from 'lucide-react';

// Os objetos de cores continuam os mesmos
const statusColors = {
  online: '#238636',
  alert: '#dbab09',
  offline: '#8b949e',
};

// 2. ATUALIZE O ICONMAP COM OS ÍCONES DO LUCIDE
const iconMap = {
  RPM: GaugeCircle,
  Temp: Thermometer,
  Óleo: Droplets,
  Corrente: Zap,
};

const metricValueColors = {
  normal: 'text.primary',
  warning: 'warning.main',
  danger: 'error.main',
};


const MachineCard = ({ machine }) => {
  // 3. PEGUE O TEMA ATUAL DO MUI PARA USAR AS CORES
  const theme = useTheme();

  return (
    <Card sx={{
      minWidth: 300,
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box sx={{
            width: 12, height: 12, borderRadius: '50%',
            backgroundColor: statusColors[machine.status] || 'grey.500'
          }} />
          
          {/* 4. SUBSTITUA O ÍCONE MUI PELO LUCIDE E USE AS PROPS DE ESTILO */}
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
        
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {machine.metrics.map((metric) => {
            const IconComponent = iconMap[metric.name];
            // Resolve a cor do texto da métrica a partir do tema
            let metricColor = theme.palette.text.primary;
            if (metric.status === 'warning') metricColor = theme.palette.warning.main;
            if (metric.status === 'danger') metricColor = theme.palette.error.main;

            return (
              <Grid item xs={6} key={metric.name}>
                <Typography variant="body2" sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', mb: 0.5 }}>
                  
                  {/* 5. FAÇA O MESMO PARA OS ÍCONES DAS MÉTRICAS */}
                  <IconComponent
                    color={theme.palette.text.secondary}
                    size={16}
                    style={{ marginRight: theme.spacing(0.5) }} // use a 'style' prop para margem
                  />
                  {metric.name}
                </Typography>
                <Typography variant="h6" sx={{ color: metricColor, fontWeight: 'bold' }}>
                  {metric.value}{metric.unit}
                </Typography>
              </Grid>
            );
          })}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default MachineCard;
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

const MachineCard = ({ machine, isSelected, onClick }) => {
  const theme = useTheme();

  const leftMetrics = machine.metrics?.filter(m => ['Óleo', 'Corrente'].includes(m.name)) || [];
  const rightMetrics = machine.metrics?.filter(m => ['RPM', 'Temp'].includes(m.name)) || [];

  return (
    <Card
      onClick={() => onClick(machine.id)}
      sx={{
        flexGrow: 1,
        minHeight: { xs: 220, sm: 250, md: 280 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: 'background.paper',
        borderRadius: 3,
        color: 'text.primary',
        cursor: 'pointer',
        border: `1px solid ${isSelected ? theme.palette.primary.main : 'transparent'}`,
        transition: 'border-color 0.1s ease-in-out',
        '&:hover': {
          borderColor: isSelected ? theme.palette.primary.main : theme.palette.primary.dark,
        },

      }}
    >
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Topo */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 12,
              height: 12,
              borderRadius: '50%',
              backgroundColor: statusColors[machine.status] || 'grey.500',
            }}
          />
          <ArrowRight color={theme.palette.text.secondary} size={20} />
        </Box>

        <Typography variant="h5" component="div" sx={{ fontWeight: 'bold' }}>
          {machine.name} {machine.sector}
        </Typography>
        <Typography sx={{ mb: 1.5, color: 'text.secondary', fontSize: '0.875rem' }}>
          {machine.machineId}
        </Typography>
        <Typography variant="body2">{machine.company}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', flexGrow: 1 }}>
          {machine.lastUpdate}
        </Typography>

        {/* Métricas — divididas em 2 colunas */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-around',
            mt: 2,
            borderRadius: 1,
            p: 1.5,
          }}
        >
          {/* Coluna Esquerda */}
          <Box sx={{ flex: 1, pr: 2 }}>
            {leftMetrics.map((metric) => {
              const IconComponent = iconMap[metric.name];
              let metricColor = theme.palette.text.primary;
              if (metric.status === 'warning') metricColor = theme.palette.warning.main;
              if (metric.status === 'danger') metricColor = theme.palette.error.main;

              return (
                <Box key={metric.name} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', mb: 0.3 }}
                  >
                    <IconComponent
                      color={theme.palette.text.secondary}
                      size={16}
                      style={{ marginRight: theme.spacing(0.5) }}
                    />
                    {metric.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: metricColor, fontWeight: 'bold' }}>
                    {metric.value}
                    {metric.unit}
                  </Typography>
                </Box>
              );
            })}
          </Box>

          {/* Coluna Direita */}
          <Box sx={{ flex: 1, pl: 2 }}>
            {rightMetrics.map((metric) => {
              const IconComponent = iconMap[metric.name];
              let metricColor = theme.palette.text.primary;
              if (metric.status === 'warning') metricColor = theme.palette.warning.main;
              if (metric.status === 'danger') metricColor = theme.palette.error.main;

              return (
                <Box key={metric.name} sx={{ mb: 1 }}>
                  <Typography
                    variant="body2"
                    sx={{ color: 'text.secondary', display: 'flex', alignItems: 'center', mb: 0.3 }}
                  >
                    <IconComponent
                      color={theme.palette.text.secondary}
                      size={16}
                      style={{ marginRight: theme.spacing(0.5) }}
                    />
                    {metric.name}
                  </Typography>
                  <Typography variant="h6" sx={{ color: metricColor, fontWeight: 'bold' }}>
                    {metric.value}
                    {metric.unit}
                  </Typography>
                </Box>
              );
            })}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MachineCard;

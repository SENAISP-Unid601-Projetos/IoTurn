import React from "react";
import { Paper, Typography, Box, useTheme, alpha } from "@mui/material";
import { TrendingDown, Minus, TrendingUp } from "lucide-react";

// Componente Stat (Min, Méd, Máx)
const Stat = ({ label, value, icon: Icon }) => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      textAlign: "center",
      gap: 0.5,
    }}
  >
    <Typography
      variant="caption"
      color="text.secondary" // Label (Min, Méd) em cinza
      sx={{
        textTransform: "uppercase",
        display: "flex",
        alignItems: "center",
        gap: 0.5,
      }}
    >
      {Icon && <Icon size={14} />}
      {label}
    </Typography>
    <Typography
      variant="body2"
      sx={{ fontWeight: "bold", color: "text.primary" }} // Valor (1418) em branco
    >
      {value}
    </Typography>
  </Box>
);

const MetricCard = ({
  icon: Icon,
  title,
  value,
  unit,
  // Os props min, med, max foram mantidos na desestruturação (como 'external')
  // mas serão substituídos pelos valores calculados a partir de dataSeries.
  min: externalMin,
  med: externalMed,
  max: externalMax,
  dataSeries = [], // 🟢 NOVO PROP: Array de dados para cálculo
  status = "default",
}) => {
  const theme = useTheme();

  // 1. EXTRAIR VALORES NUMÉRICOS DA SÉRIE
  const numericValues = dataSeries
    // Mapeia para o valor 'y' (se for um ponto {x, y}) ou usa o próprio ponto (se for apenas um número)
    .map(point => (point && point.y !== undefined ? point.y : point)) 
    // Filtra para garantir que apenas números válidos sejam considerados
    .filter(v => typeof v === 'number' && !isNaN(v));

  // 2. CÁLCULOS
  const calculatedMin = numericValues.length > 0 ? Math.min(...numericValues) : 0;
  const calculatedMax = numericValues.length > 0 ? Math.max(...numericValues) : 0;
  const sum = numericValues.reduce((acc, curr) => acc + curr, 0);
  const calculatedMed = numericValues.length > 0 ? sum / numericValues.length : 0;

  // 3. FUNÇÃO DE FORMATAÇÃO
  const formatValue = (val) => {
    if (typeof val !== 'number' || isNaN(val)) return 'N/A';
    // Formata para 2 casas decimais, ou mantém inteiro se for o caso
    return val % 1 === 0 ? val : val.toFixed(2);
  };

  // 4. VALORES PARA EXIBIÇÃO
  const displayMin = formatValue(calculatedMin);
  const displayMed = formatValue(calculatedMed);
  const displayMax = formatValue(calculatedMax);

  // Configuração do semáforo
  const statusConfig = {
    good: {
      color: theme.palette.success.main, // Verde "neon" (para borda e texto)
      bgcolor: alpha(theme.palette.success.main, 0.1), // Fundo do card (suave)
      glow: alpha(theme.palette.success.main, 0.25), // Brilho "neon"
    },
    warning: {
      color: theme.palette.warning.main, // Amarelo "neon"
      bgcolor: alpha(theme.palette.warning.main, 0.1),
      glow: alpha(theme.palette.warning.main, 0.25),
    },
    danger: {
      color: theme.palette.error.main, // Vermelho "neon"
      bgcolor: alpha(theme.palette.error.main, 0.1),
      glow: alpha(theme.palette.error.main, 0.25),
    },
    default: {
      color: theme.palette.divider, // Borda cinza
      bgcolor: theme.palette.background.default, // Fundo preto
      iconColor: theme.palette.text.secondary, // Ícone cinza
      textColor: theme.palette.text.primary, // COR DO TEXTO: Branca (para não ficar cinza)
      glow: "transparent", // Sem brilho
    },
  };

  const config = statusConfig[status] || statusConfig.default;

  // Define as variáveis de cor
  const borderColor = theme.palette.divider;
  const backgroundColor = theme.palette.background.default;
  const valueTextColor = theme.palette.text.primary;
  const glow = alpha(theme.palette.primary.main, 0.25);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        bgcolor: backgroundColor,
        border: `1px solid ${borderColor}`,
        boxShadow: `0 0 12px ${glow}`,
        borderRadius: 3,
        minWidth: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        transition:
          "border-color 0.3s ease, box-shadow 0.3s ease, background-color 0.3s ease",
      }}
    >
      {/* LINHA SUPERIOR */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ display: "flex", alignItems: "center", gap: 1 }}
        >
          {Icon && <Icon size={18} />}
          {title}
        </Typography>
        {Icon && <Icon size={18} color={valueTextColor} />}
      </Box>

      {/* VALOR PRINCIPAL */}
      <Box
        sx={{
          my: 2,
          textAlign: "center",
        }}
      >
        <Typography
          component="span"
          variant="h3"
          sx={{
            fontWeight: "bold",
            color: valueTextColor,
            transition: "color 0.3s ease",
          }}
        >
          {value}
        </Typography>
        <Typography
          component="span"
          variant="h5"
          color="text.secondary"
          sx={{ ml: 0.5 }}
        >
          {unit}
        </Typography>
      </Box>

      {/* LINHA INFERIOR (STATS) */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          pt: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        {/* 🟢 CORRIGIDO: Usando valores calculados */}
        <Stat label="Min" value={displayMin} icon={TrendingDown} />
        <Stat label="Méd" value={displayMed} icon={Minus} />
        <Stat label="Máx" value={displayMax} icon={TrendingUp} />
      </Box>
    </Paper>
  );
};

export default MetricCard;
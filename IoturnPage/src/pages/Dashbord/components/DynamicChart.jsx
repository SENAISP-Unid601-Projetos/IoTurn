import React, { useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import { Box, Typography, Paper, useTheme, alpha } from "@mui/material";

// Constantes do gráfico
const MAX_DATA_POINTS = 30;
const XAXIS_RANGE = 30000; // 30 segundos

const DynamicChart = ({
  seriesData,
  title,
  unit = "",
  yMin = 0,
  yMax = 100,
}) => {
  const theme = useTheme();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const lastProcessedData = useRef([]);

  // Cor primária do tema
  const chartColor = theme.palette.primary.main;

  // Função para processar e deduplicar os dados
  const processSeriesData = (data) => {
    if (!data || data.length === 0) return [];

    // Remove pontos duplicados baseado no timestamp
    const uniqueData = [];
    const timestampMap = new Map();

    data.forEach((point) => {
      // Agrupa por timestamp (arredondado para evitar micro-diferenças)
      const roundedTime = Math.floor(point.x / 1000) * 1000; // Arredonda para segundos
      if (!timestampMap.has(roundedTime)) {
        timestampMap.set(roundedTime, point);
      }
    });

    // Converte de volta para array e ordena por timestamp
    return Array.from(timestampMap.values())
      .sort((a, b) => a.x - b.x)
      .slice(-MAX_DATA_POINTS); // Mantém apenas os últimos pontos
  };

  useEffect(() => {
    if (!chartRef.current) return;

    const processedData = processSeriesData(seriesData);
    lastProcessedData.current = processedData;

    const options = {
      chart: {
        toolbar: {
          show: false,
          offsetX: 0,
          offsetY: 0,
        },
        animations: {
          enabled: false,
          easing: "linear",
          dynamicAnimation: {
            speed: 10000,
          },
        },
      },
      series: [
        {
          name: title,
          data: processedData,
        },
      ],
      colors: [chartColor],
      stroke: {
        curve: "smooth",
        width: 3, // Aumentei para melhor visualização durante animação
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        gradient: {
          type: "vertical",
          shadeIntensity: 0.5,
          gradientToColors: [alpha(chartColor, 0.1)],
          inverseColors: false,
        },
      },
      markers: {
        size: 4,
        strokeColors: chartColor,
        strokeWidth: 2,
        fillOpacity: 1,
        hover: {
          size: 8,
          strokeWidth: 3,
        },
      },
      xaxis: {
        type: "datetime",
        range: XAXIS_RANGE,
        labels: {
          style: {
            colors: theme.palette.text.secondary,
            fontSize: "11px",
          },
          datetimeUTC: false,
          format: "HH:mm:ss",
          datetimeFormatter: {
            hour: "HH:mm:ss",
            minute: "HH:mm:ss",
            second: "HH:mm:ss",
          },
        },
        axisBorder: { show: false },
        axisTicks: { show: false },
        tooltip: {
          enabled: false,
        },
      },
      yaxis: {
        min: Math.max(0, yMin - 5),
        max: yMax > 0 ? yMax * 1.1 : 100,
        tickAmount: 5,
        labels: {
          style: {
            colors: theme.palette.text.secondary,
            fontSize: "11px",
          },
          formatter: (val) => {
            if (val === null || val === undefined) return "0" + unit;
            return `${val % 1 === 0 ? val : val.toFixed(1)}${unit}`;
          },
        },
        forceNiceScale: true,
      },
      grid: {
        show: true,
        borderColor: alpha(theme.palette.divider, 0.3),
        strokeDashArray: 3,
        xaxis: {
          lines: {
            show: true,
          },
        },
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      tooltip: {
        theme: theme.palette.mode,
        x: {
          format: "HH:mm:ss",
        },
        y: {
          formatter: (val) => {
            return val !== null && val !== undefined ? `${val}${unit}` : "N/A";
          },
        },
      },
      legend: {
        show: false,
      },
    };

    chartInstance.current = new ApexCharts(chartRef.current, options);
    chartInstance.current.render();

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [title, theme]);

  // Efeito para atualizar os dados da série
  useEffect(() => {
    if (!chartInstance.current || !seriesData || seriesData.length === 0) {
      return;
    }

    const processedData = processSeriesData(seriesData);

    // Verifica se os dados realmente mudaram
    const currentDataString = JSON.stringify(processedData);
    const lastDataString = JSON.stringify(lastProcessedData.current);

    if (currentDataString === lastDataString) {
      return;
    }

    lastProcessedData.current = processedData;

    try {
      // Atualiza os dados da série
      chartInstance.current.updateSeries(
        [
          {
            name: title,
            data: processedData,
          },
        ],
        true
      );

      // Ajusta dinamicamente o eixo Y baseado nos dados
      if (processedData.length > 0) {
        const values = processedData
          .map((p) => p.y)
          .filter((val) => !isNaN(val));
        if (values.length > 0) {
          const dataMin = Math.min(...values);
          const dataMax = Math.max(...values);
          const padding = Math.max((dataMax - dataMin) * 0.1, 1); // 10% de padding ou pelo menos 1

          chartInstance.current.updateOptions(
            {
              yaxis: {
                min: Math.max(0, dataMin - padding),
                max: dataMax + padding,
              },
            },
            false,
            true
          );
        }
      }
    } catch (error) {
      console.error(`Erro ao atualizar gráfico ${title}:`, error);
    }
  }, [seriesData, title]);

  // Efeito para atualizar o Y-axis com limites externos
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.updateOptions(
        {
          yaxis: {
            min: Math.max(0, yMin - 5),
            max: yMax > 0 ? yMax * 1.1 : 100,
          },
        },
        false,
        true
      );
    }
  }, [yMin, yMax]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        bgcolor: "background.default",
        border: `1px solid ${theme.palette.divider}`,
        borderRadius: 3,
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: "bold",
          mb: 2,
          display: "flex",
          alignItems: "center",
          gap: 1,
          color: theme.palette.text.primary,
        }}
      >
        {title}
      </Typography>
      <Box
        ref={chartRef}
        sx={{
          flex: 1,
          minHeight: 300,
        }}
      />
    </Paper>
  );
};

export default DynamicChart;

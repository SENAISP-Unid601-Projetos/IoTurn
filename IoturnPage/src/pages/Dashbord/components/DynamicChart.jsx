import React, { useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import { Box, Typography, Paper, useTheme, alpha } from '@mui/material';

// Constantes do gráfico
const MAX_DATA_POINTS = 30;
const XAXIS_RANGE = 30000;

const DynamicChart = ({ seriesData, title, unit = '', yMin = 0, yMax = 100 }) => {
    const theme = useTheme();
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Cor primária do tema (Azul)
    const chartColor = theme.palette.primary.main;

    useEffect(() => {
        if (!chartRef.current) return;

        const options = {
            chart: {
                background: 'transparent',
                type: 'area',
                height: 300,
                zoom: { enabled: false },
                toolbar: { show: false },
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: { speed: 1000 },
                },
            },
            dataLabels: { enabled: false },
            stroke: { curve: 'smooth', width: 2 },
            series: [{ name: title, data: seriesData }],
            colors: [chartColor],
            fill: {
                type: 'gradient',
                gradient: {
                    shade: 'dark',
                    type: 'vertical',
                    shadeIntensity: 0.5,
                    gradientToColors: [alpha(chartColor, 0.05)],
                    inverseColors: false,
                    opacityFrom: 0.6,
                    opacityTo: 0.1,
                    stops: [0, 90, 100]
                }
            },
            markers: { size: 0, strokeWidth: 0, hover: { size: 5 } },
            xaxis: {
                type: 'datetime',
                range: XAXIS_RANGE,
                labels: {
                    style: { colors: theme.palette.text.secondary },
                    datetimeUTC: false,
                    format: 'HH:mm:ss',
                },
                axisBorder: { show: false },
                axisTicks: { show: false },
            },
            yaxis: {
                min: yMin,
                max: yMax,
                tickAmount: 5,
                labels: {
                    style: { colors: theme.palette.text.secondary },
                    formatter: (val) => `${Math.floor(val)}${unit}`,
                },
            },
            grid: {
                show: true,
                borderColor: theme.palette.divider,
                strokeDashArray: 3,
            },
            tooltip: {
                theme: 'dark',
                x: { format: 'HH:mm:ss' },
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
    }, [theme.palette.primary.main, theme.palette.divider, theme.palette.text.secondary]);

    // Efeito para atualizar os dados da série
    useEffect(() => {
        if (chartInstance.current && seriesData.length > 0) {
            chartInstance.current.updateSeries([{ data: seriesData }]);
        }
    }, [seriesData]);

    // Efeito para atualizar o Y-axis
    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.updateOptions({
                yaxis: {
                    min: yMin,
                    max: yMax,
                }
            });
        }
    }, [yMin, yMax]);

    return (
        <Paper
            elevation={0}
            sx={{
                p: 2.5,
                // ATUALIZADO: Fundo preto padrão do tema
                bgcolor: 'background.default',
                border: `1px solid ${theme.palette.divider}`,
                borderRadius: 3,
            }}
        >
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                {title}
            </Typography>
            <Box ref={chartRef} />
        </Paper>
    );
};

export default DynamicChart;
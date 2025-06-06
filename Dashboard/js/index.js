const MAX_DATA_POINTS = 60;
const brokerUrl = 'ws://10.110.12.59:8080';
const topicos = ['esp32/temperatura', 'esp32/rpm', 'esp32/nivelOleo', 'esp32/corrente'];

function createLineChart(containerId, title) {
    let data = [];

    const options = {
        series: [{
            name: title,
            data: data.slice()
        }],
        chart: {
            id: `realtime-${containerId}`,
            height: 350,
            type: 'line',
            animations: {
                enabled: true,
                easing: 'linear',
                dynamicAnimation: {
                    speed: 1000
                }
            },
            toolbar: { show: false },
            zoom: { enabled: false }
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth' },
        title: {
            text: title,
            align: 'left',
            style: {
                color: '#333333' // Cor do título para tema claro (cinza escuro)
            }
        },
        markers: { size: 0 },
        xaxis: {
            type: 'datetime',
            range: 20000,
            labels: {
                style: {
                    colors: '#666666' // Cor dos labels do eixo X para tema claro (cinza médio)
                }
            },
            axisBorder: {
                show: true,
                color: '#999999' // Cor da borda do eixo X para tema claro (cinza claro)
            },
            axisTicks: {
                show: true,
                color: '#999999' // Cor dos ticks do eixo X para tema claro (cinza claro)
            }
        },
        yaxis: {
            max: 100,
            labels: {
                style: {
                    colors: '#666666' // Cor dos labels do eixo Y para tema claro (cinza médio)
                }
            },
            axisBorder: {
                show: true,
                color: '#999999' // Cor da borda do eixo Y para tema claro (cinza claro)
            },
            axisTicks: {
                show: true,
                color: '#999999' // Cor dos ticks do eixo Y para tema claro (cinza claro)
            }
        },
        grid: {
            borderColor: '#E0E0E0', // Cor das linhas do grid para tema claro (cinza muito claro)
            strokeDashArray: 4,
            xaxis: {
                lines: {
                    show: false
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            }
        },
        tooltip: {
            theme: 'light' // Tema do tooltip para claro (texto escuro em fundo claro)
        }
    };

    const chart = new ApexCharts(document.querySelector(`#${containerId}`), options);
    chart.render();

    function updateChart(value) {
        const timestamp = new Date().getTime();
        data.push({ x: timestamp, y: parseFloat(value) });

        if (data.length > MAX_DATA_POINTS) {
            data.splice(0, data.length - MAX_DATA_POINTS);
        }

        chart.updateSeries([{ data }]);
    }

    return {
        chart,
        update: updateChart
    };
}

function createGauge(containerId, subtitle) {
    let chart = JSC.chart(containerId, {
        debug: false,
        type: 'gauge',
        chartArea: {
            background: {
                fill: '#253443', // <--- ALtere esta linha para a cor de fundo da área do gráfico
                outline: { width: 0 }
            }
        },
        backgroundColor: '#253443', // <--- ALtere esta linha para a cor de fundo do container do gauge
        animation_duration: 1000,
        legend_visible: false,
        xAxis: { spacingPercentage: 0.25 },
        yAxis: {
            defaultTick: { padding: -5, label_style_fontSize: '14px' },
            line: { width: 9, color: 'smartPalette', breaks_gap: 0.06 },
            scale_range: [0, 100]
        },
        palette: {
            pointValue: '{%value/100}',
            colors: ['green', 'yellow', 'red']
        },
        defaultTooltip_enabled: false,
        defaultSeries: {
            angle: { sweep: 180 },
            shape: {
                innerSize: '70%',
                label: {
                    text: `<span color="%color">{%sum:n1}</span><br/><span color="#696969" fontSize="20px">${subtitle}</span>`,
                    style_fontSize: '46px',
                    verticalAlign: 'middle'
                }
            }
        },
        series: [{
            type: 'column roundcaps',
            points: [{ id: '1', x: 'speed', y: 0 }],
        }]
    });

    function setGauge(y) {
        chart.series(0).options({
            points: [{ id: '1', x: 'speed', y: y }]
        });
    }

    return {
        chart,
        setGauge
    };
}

const chartTemp = createLineChart("graph-temp", "Temperatura (°C)");
const chartCorrent = createLineChart("graph-corrent", "Corrente (A)");

const gaugeRPM = createGauge("graph-rpm", "RPM");
const gaugeNOleo = createGauge("graph-nOleo", "Nível Óleo");

const client = mqtt.connect(brokerUrl);

client.on('connect', () => {
    console.log(`✅ Conectado ao broker MQTT em ${brokerUrl}`);

    topicos.forEach(topic => {
        client.subscribe(topic, err => {
            if (err) {
                console.error(`Erro ao se inscrever no tópico ${topic}:`, err);
            } else {
                console.log(`Inscrito no tópico: ${topic}`);
            }
        });
    });
});

client.on('message', (topic, message) => {
    const value = parseFloat(message.toString());

    switch (topic) {
        case 'esp32/temperatura':
            chartTemp.update(value);
            break;
        case 'esp32/corrente':
            chartCorrent.update(value);
            break;
        case 'esp32/rpm':
            gaugeRPM.setGauge(value);
            break;
        case 'esp32/nivelOleo':
            gaugeNOleo.setGauge(value);
            break;
    }
});

client.on('error', (err) => {
    console.error('Erro de conexão MQTT:', err);
    client.end();
});
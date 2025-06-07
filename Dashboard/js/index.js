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
            align: 'center',
            style: {
                color: '#333333',
                fontSize: '22px' // Cor do título 
            }
        },
        markers: { size: 0 },
        xaxis: {
            type: 'datetime',
            range: 20000,
            labels: {
                style: {
                    colors: '#000',
                    fontSize: '18px' // Cor dos labels do eixo X 
                }
            },
            axisBorder: {
                show: true,
                color: '#000' // Cor da borda do eixo X 
            },
            axisTicks: {
                show: true,
                color: '#000' // Cor dos ticks do eixo X 
            }
        },
        yaxis: {
            max: 100,
            labels: {
                style: {
                    colors: ' #000',
                    fontSize: '18px' // Cor dos labels do eixo Y 
                }
            },
            axisBorder: {
                show: true,
                color: ' #000' // Cor da borda do eixo Y 
            },
            axisTicks: {
                show: true,
                color: ' #000' // Cor dos ticks do eixo Y 
            }
        },
        grid: {
            borderColor: '#E0E0E0', // Cor das linhas do grid claro
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
            theme: 'light'
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
                fill: 'transparent',
                outline: { width: 0 }
            }
        },

        backgroundColor: 'transparent',
        animation_duration: 1000,
        legend_visible: false,
        xAxis: { spacingPercentage: 0.25 },
        yAxis: {
            scale_range: [0, 100],
            visible: false,
            line: {
                width: 0,
                color: 'smartPalette',
                breaks_gap: 0.06
            },
        },
        palette: {
            pointValue: '{%value/100}',
            colors: [' #87CEFA', ' #2d86e5', ' #194869 '] // Cores para diferentes faixas do medidor
        },
        defaultTooltip_enabled: false,
        defaultSeries: {
            angle: { sweep: 180 },
            shape: {
                innerSize: '70%',
                label: {
                    text: `<span color="#333333" fontSize="46px">{%sum:n1}</span><br/><span color="#696969" fontSize="20px">${subtitle}</span>`,
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
    if (isNaN(value)) {
        console.warn(`Mensagem MQTT inválida para o tópico ${topic}: ${message.toString()}`);
        return;
    }

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

import React, { useState, useEffect, useRef } from 'react';
import ApexCharts from 'apexcharts';
import * as JSC from 'jscharting';
import mqtt from 'mqtt';
import logo from "../../assets/LogoSemBorda2.png";
import './dashboard.css';

const MAX_DATA_POINTS = 60;
const brokerUrl = 'ws://10.110.12.59:8080';
const topicos = ['esp32/temperatura', 'esp32/rpm', 'esp32/nivelOleo', 'esp32/corrente'];

const Dashboard = () => {
    const [isMenuOpen, setMenuOpen] = useState(false);

    const chartTempRef = useRef(null);
    const chartCorrentRef = useRef(null);
    const gaugeRPMRef = useRef(null);
    const gaugeNOleoRef = useRef(null);

    const tempChart = useRef(null);
    const correntChart = useRef(null);
    const rpmGauge = useRef(null);
    const nOleoGauge = useRef(null);

    useEffect(() => {
        // Temperature Chart
        const optionsTemp = {
            chart: {
                height: 350,
                type: 'line',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000
                    }
                },
            },
            series: [{
                name: 'Temperatura (°C)',
                data: []
            }],
            xaxis: {
                type: 'datetime',
                range: 20000,
            },
            yaxis: {
                max: 100
            }
        };
        tempChart.current = new ApexCharts(chartTempRef.current, optionsTemp);
        tempChart.current.render();

        // Current Chart
        const optionsCorrent = {
            chart: {
                height: 350,
                type: 'line',
                animations: {
                    enabled: true,
                    easing: 'linear',
                    dynamicAnimation: {
                        speed: 1000
                    }
                },
            },
            series: [{
                name: 'Corrente (A)',
                data: []
            }],
            xaxis: {
                type: 'datetime',
                range: 20000,
            },
            yaxis: {
                max: 100
            }
        };
        correntChart.current = new ApexCharts(chartCorrentRef.current, optionsCorrent);
        correntChart.current.render();


        // RPM Gauge
        rpmGauge.current = JSC.chart(gaugeRPMRef.current, {
            type: 'gauge',
            animation_duration: 800,
            yAxis: { scale_range: [0, 100] },
            series: [{
                points: [{ x: 'speed', y: 0 }]
            }]
        });


        // Oil Level Gauge
        nOleoGauge.current = JSC.chart(gaugeNOleoRef.current, {
            type: 'gauge',
            animation_duration: 800,
            yAxis: { scale_range: [0, 100] },
            series: [{
                points: [{ x: 'speed', y: 0 }]
            }]
        });


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

            const timestamp = new Date().getTime();

            switch (topic) {
                case 'esp32/temperatura':
                    if (tempChart.current) {
                        const series = tempChart.current.w.globals.series[0];
                        series.data.push({ x: timestamp, y: value });
                        if (series.data.length > MAX_DATA_POINTS) {
                            series.data.shift();
                        }
                        tempChart.current.updateSeries([{ data: series.data }]);
                    }
                    break;
                case 'esp32/corrente':
                    if (correntChart.current) {
                        const series = correntChart.current.w.globals.series[0];
                        series.data.push({ x: timestamp, y: value });
                        if (series.data.length > MAX_DATA_POINTS) {
                            series.data.shift();
                        }
                        correntChart.current.updateSeries([{ data: series.data }]);
                    }
                    break;
                case 'esp32/rpm':
                    if (rpmGauge.current) {
                        rpmGauge.current.series(0).points(0).options({ y: value });
                    }
                    break;
                case 'esp32/nivelOleo':
                    if (nOleoGauge.current) {
                        nOleoGauge.current.series(0).points(0).options({ y: value });
                    }
                    break;
                default:
                    break;
            }
        });

        client.on('error', (err) => {
            console.error('Erro de conexão MQTT:', err);
            client.end();
        });


        return () => {
            if (tempChart.current) tempChart.current.destroy();
            if (correntChart.current) correntChart.current.destroy();
            if (rpmGauge.current) rpmGauge.current.destroy();
            if (nOleoGauge.current) nOleoGauge.current.destroy();
            client.end();
        };
    }, []);

    return (
        <div className="bg-gradient-to-b from-[#1a2a3a] to-[#90b6e4] text-white min-h-screen">
            <header className="flex justify-between items-center p-4 lg:p-6 relative z-10">
                <img src={logo} alt="Logo IoTurn" className="h-16" />
                <button onClick={() => setMenuOpen(!isMenuOpen)} className="text-white text-3xl">
                    &#9776;
                </button>
            </header>

            <nav className={`fixed top-0 h-full w-64 bg-black bg-opacity-30 backdrop-blur-md p-6 transition-right duration-300 ease-in-out z-50 ${isMenuOpen ? 'right-0' : '-right-full'}`}>
                <button onClick={() => setMenuOpen(false)} className="absolute top-4 right-4 text-white text-4xl">
                    &times;
                </button>
                <ul className="mt-20">
                    <li className="mb-4">
                        <a href="#" className="text-white text-lg hover:text-[#2d86e5]">Página Inicial</a>
                    </li>
                    <li>
                        <a href="#" className="text-white text-lg hover:text-[#2d86e5]">Chatbot</a>
                    </li>
                </ul>
            </nav>

            <main className="p-4 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6 mb-6">
                    <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-lg">
                        <div ref={chartCorrentRef} className="echart-box"></div>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg flex justify-center items-center">
                        <div ref={gaugeRPMRef} className="gauge-container"></div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-7 gap-6">
                    <div className="lg:col-span-5 bg-white rounded-2xl p-6 shadow-lg">
                        <div ref={chartTempRef} className="echart-box"></div>
                    </div>
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg flex justify-center items-center">
                        <div ref={gaugeNOleoRef} className="gauge-container"></div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Dashboard;
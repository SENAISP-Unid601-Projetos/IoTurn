import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import * as JSC from "jscharting";
import mqtt from "mqtt"; // Embora não usado, mantido para reativação
import Sidebar from "../../components/Sidebar";
import logo from "../../assets/LogoSemBorda2.png";
import "./dashboard.css";

// --- Constantes de Configuração ---
const MAX_DATA_POINTS = 60;

const Dashboard = () => {
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [tempData, setTempData] = useState([]);
  const [correntData, setCorrentData] = useState([]);

  // --- Refs para os elementos DOM dos gráficos ---
  const chartTempRef = useRef(null);
  const chartCorrentRef = useRef(null);
  const gaugeRPMRef = useRef(null);
  const gaugeNOleoRef = useRef(null);

  // --- Refs para as instâncias dos GRÁFICOS de linha ---
  const tempChart = useRef(null);
  const correntChart = useRef(null);

  // --- Refs para os PONTOS dos gauges que serão atualizados ---
  const rpmPoint = useRef(null);
  const nOleoPoint = useRef(null);

  // Efeito principal para inicialização e simulação de dados
  useEffect(() => {
    const optionsTemp = {
      chart: {
        height: 350,
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: { speed: 1000 },
        },
      },
      series: [{ name: "Temperatura (°C)", data: [] }],
      xaxis: { type: "datetime", range: 20000 },
      yaxis: { max: 100 },
    };
    tempChart.current = new ApexCharts(chartTempRef.current, optionsTemp);
    tempChart.current.render();

    const optionsCorrent = {
      chart: {
        height: 350,
        type: "line",
        animations: {
          enabled: true,
          easing: "linear",
          dynamicAnimation: { speed: 1000 },
        },
      },
      series: [{ name: "Corrente (A)", data: [] }],
      xaxis: { type: "datetime", range: 20000 },
      yaxis: { max: 100 },
    };
    correntChart.current = new ApexCharts(
      chartCorrentRef.current,
      optionsCorrent
    );
    correntChart.current.render();

    JSC.chart(gaugeRPMRef.current, {
      type: "gauge",
      animation_duration: 800,
      yAxis: { scale_range: [0, 100] },
      series: [{ points: [{ x: "speed", y: 0 }] }],
      events: {
        load: function () {
          rpmPoint.current = this.series(0).points(0);
        },
      },
    });

    JSC.chart(gaugeNOleoRef.current, {
      type: "gauge",
      animation_duration: 800,
      yAxis: { scale_range: [0, 100] },
      series: [{ points: [{ x: "speed", y: 0 }] }],
      events: {
        load: function () {
          nOleoPoint.current = this.series(0).points(0);
        },
      },
    });

    const dataInterval = setInterval(() => {
      const timestamp = new Date().getTime();

      setTempData((currentData) => {
        const base = 35; 
        const newData = [
          ...currentData,
          { x: timestamp, y: Math.floor(base + Math.random() * 10) },
        ];
        return newData.length > MAX_DATA_POINTS ? newData.slice(1) : newData;
      });

      setCorrentData((currentData) => {
        const base = 15;
        const newData = [
          ...currentData,
          { x: timestamp, y: (base + Math.random() * 10).toFixed(2) },
        ];
        return newData.length > MAX_DATA_POINTS ? newData.slice(1) : newData;
      });

      // RPM Gauge
      if (rpmPoint.current) {
        const base = 50;
        const randomValue = Math.floor(base + Math.random() * 10);
        rpmPoint.current.options({ y: randomValue });
      }

      // Nível de Óleo Gauge
      if (nOleoPoint.current) {
        const base = 60;
        const randomValue = Math.floor(base + Math.random() * 10);
        nOleoPoint.current.options({ y: randomValue });
      }
    }, 1000);


    return () => {
      clearInterval(dataInterval); // Para o intervalo ao desmontar o componente
      if (tempChart.current) tempChart.current.destroy();
      if (correntChart.current) correntChart.current.destroy();
      // A biblioteca JSCharting lida com a destruição automaticamente
      // quando os elementos do DOM são removidos.
    };
  }, []);

  // Efeito para sincronizar o estado 'tempData' com o gráfico de temperatura
  useEffect(() => {
    if (tempChart.current) {
      tempChart.current.updateSeries([{ data: tempData }]);
    }
  }, [tempData]);

  // Efeito para sincronizar o estado 'correntData' com o gráfico de corrente
  useEffect(() => {
    if (correntChart.current) {
      correntChart.current.updateSeries([{ data: correntData }]);
    }
  }, [correntData]);

  return (
    <div className="bg-gradient-to-b from-[#1a2a3a] to-[#90b6e4] text-white min-h-screen">
      <header className="flex justify-between items-center p-4 lg:p-6 relative z-10">
        <img src={logo} alt="Logo IoTurn" className="h-16" />
        <button
          onClick={() => setMenuOpen(!isMenuOpen)}
          className="text-white text-3xl"
        >
          &#9776;
        </button>
      </header>

      <Sidebar isOpen={isMenuOpen} onClose={() => setMenuOpen(false)} />

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

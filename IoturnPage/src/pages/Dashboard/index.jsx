import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import * as JSC from "jscharting";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import "./dashboard.css";

const MAX_DATA_POINTS = 60;

// Função para criar opções de gráfico de linha
const createChartOptions = (name, color) => ({
  chart: {
    type: "area",
    height: 350,
    zoom: { enabled: false },
    toolbar: { show: false },
    animations: { enabled: false },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3 },
  series: [{ name, data: [] }],
  colors: [color],
  fill: { type: "solid", opacity: 0.2 },
  markers: { size: 0, strokeWidth: 3, hover: { size: 7 } },
  xaxis: {
    type: "datetime",
    range: 30000,
    labels: { style: { colors: "#555" } },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    max: 100,
    tickAmount: 5,
    labels: { style: { colors: "#555" } },
  },
  grid: { show: true, borderColor: "#e0e0e0", strokeDashArray: 4 },
  tooltip: { theme: "light", x: { format: "HH:mm:ss" } },
});

// **NOVA FUNÇÃO PARA CRIAR GAUGES COM O DESIGN SOLICITADO**
const createGaugeOptions = (subtitle, pointRef) => ({
  debug: false,
  type: "gauge",
  chartArea: {
    background: { fill: "transparent", outline: { width: 0 } },
  },
  backgroundColor: "transparent",
  animation_duration: 1000,
  legend_visible: false,
  xAxis: { spacingPercentage: 0.25 },
  yAxis: {
    scale_range: [0, 100],
    visible: false,
    line: {
      width: 0,
      color: "smartPalette",
      breaks_gap: 0.06,
    },
  },
  palette: {
    pointValue: "{%value/100}",
    colors: ["#87CEFA", "#2d86e5", "#194869"],
  },
  defaultTooltip_enabled: false,
  defaultSeries: {
    angle: { sweep: 180 },
    shape: {
      innerSize: "70%",
      label: {
        text: `<span style="color:#333333; font-size:46px;">{%sum:n1}</span><br/><span style="color:#696969; font-size:20px;">${subtitle}</span>`,
        verticalAlign: "middle",
      },
    },
  },
  series: [
    {
      type: "column roundcaps",
      points: [{ id: "1", x: "speed", y: 0 }],
    },
  ],
  // Evento para capturar a referência do ponto e poder atualizá-lo
  events: {
    load: function () {
      pointRef.current = this.series(0).points(0);
    },
  },
});

const Dashboard = () => {
  const [tempData, setTempData] = useState([]);
  const [correntData, setCorrentData] = useState([]);

  const chartTempRef = useRef(null);
  const chartCorrentRef = useRef(null);
  const gaugeRPMRef = useRef(null);
  const gaugeNOleoRef = useRef(null);

  const tempChart = useRef(null);
  const correntChart = useRef(null);
  const rpmPoint = useRef(null);
  const nOleoPoint = useRef(null);

  useEffect(() => {
    // Renderiza gráficos de linha
    const optionsTemp = createChartOptions("Temperatura (°C)", "#008FFB");
    tempChart.current = new ApexCharts(chartTempRef.current, optionsTemp);
    tempChart.current.render();

    const optionsCorrent = createChartOptions("Corrente (A)", "#FF4560");
    correntChart.current = new ApexCharts(
      chartCorrentRef.current,
      optionsCorrent
    );
    correntChart.current.render();

    // Renderiza gauges usando a nova função
    JSC.chart(gaugeRPMRef.current, createGaugeOptions("RPM", rpmPoint));
    JSC.chart(
      gaugeNOleoRef.current,
      createGaugeOptions("Nível Óleo", nOleoPoint)
    );

    const dataInterval = setInterval(() => {
      const timestamp = new Date().getTime();
      setTempData((currentData) => {
        const newData = [
          ...currentData,
          { x: timestamp, y: Math.floor(35 + Math.random() * 10) },
        ];
        return newData.length > MAX_DATA_POINTS ? newData.slice(1) : newData;
      });
      setCorrentData((currentData) => {
        const newData = [
          ...currentData,
          { x: timestamp, y: parseFloat((15 + Math.random() * 10).toFixed(2)) },
        ];
        return newData.length > MAX_DATA_POINTS ? newData.slice(1) : newData;
      });

      if (rpmPoint.current) {
        rpmPoint.current.options({ y: Math.floor(50 + Math.random() * 10) });
      }
      if (nOleoPoint.current) {
        nOleoPoint.current.options({ y: Math.floor(60 + Math.random() * 10) });
      }
    }, 1000);

    return () => {
      clearInterval(dataInterval);
      if (tempChart.current) tempChart.current.destroy();
      if (correntChart.current) correntChart.current.destroy();
    };
  }, []);

  useEffect(() => {
    if (tempChart.current) {
      tempChart.current.updateSeries([{ data: tempData }]);
    }
  }, [tempData]);

  useEffect(() => {
    if (correntChart.current) {
      correntChart.current.updateSeries([{ data: correntData }]);
    }
  }, [correntData]);

  return (
    <div className="flex bg-blue-100 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 ml-20 flex flex-col">
        <Header />
        <main className=" h-full flex flex-col gap-y-4 p-4">
          <div className="h-1/3">aaaa</div>
          <div className="h-2/3 flex flex-row justify-center gap-6 mb-6 flex-nowrap">
            <div className="bg-white w-full rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Corrente
              </h3>
              <div ref={chartCorrentRef} className="echart-box"></div>
            </div>
            <div className="bg-white w-full rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">RPM</h3>
              <div ref={gaugeRPMRef} className="gauge-container"></div>
            </div>
            <div className="bg-white w-full rounded-2xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Temperatura
              </h3>
              <div ref={chartTempRef} className="echart-box"></div>
            </div>
            <div className="bg-white w-full rounded-2xl p-6 shadow-lg flex flex-col justify-center items-center">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Nível de Óleo
              </h3>
              <div ref={gaugeNOleoRef} className="gauge-container"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

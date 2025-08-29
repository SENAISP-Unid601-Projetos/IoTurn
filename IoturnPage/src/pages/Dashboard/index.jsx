import React, { useState, useEffect, useRef } from "react";
import ApexCharts from "apexcharts";
import * as JSC from "jscharting";
import mqtt from "mqtt";
import Sidebar from "../../components/Sidebar";
import Header from "../../components/Header";
import assetImage from "../../assets/GH-1440TZ.png";
import "./dashboard.css";

const machineData = {
  name: "TORMAX 30 NI",
  model: "944957",
  image: assetImage,
  fabricante: "TECHNO SAFE",
  numeracao: "0224191",
};

const MAX_DATA_POINTS = 60;

const createChartOptions = (name, color) => ({
  chart: {
    type: "area",
    height: 350,
    zoom: { enabled: false },
    toolbar: { show: false },
    animations: {
      enabled: true,
      easing: "linear",
      dynamicAnimation: { speed: 1000 },
    },
  },
  dataLabels: { enabled: false },
  stroke: { curve: "smooth", width: 3 },
  series: [{ name, data: [] }],
  colors: [color],
  fill: { type: "solid", opacity: 0 },
  markers: { size: 0, strokeWidth: 3, hover: { size: 7 } },
  xaxis: {
    type: "datetime",
    range: 30000,
    labels: {
      style: { colors: "#555" },
      datetimeUTC: false,
      format: "HH:mm:ss",
    },
    axisBorder: { show: false },
    axisTicks: { show: false },
  },
  yaxis: {
    type: "numeric",
    max: 100,
    tickAmount: 10,
    labels: {
      style: { colors: "#555" },
      formatter: (val) => Math.floor(val),
    },
  },
  grid: { show: true, borderColor: "#e0e0e0", strokeDashArray: 4 },
  tooltip: { theme: "light", x: { format: "HH:mm:ss" } },
});

// const createGaugeOptions = (subtitle, pointRef) => ({
//   debug: false,
//   type: "gauge",
//   chartArea: {
//     background: { fill: "transparent", outline: { width: 0 } },
//   },
//   backgroundColor: "transparent",
//   animation_duration: 1000,
//   legend_visible: false,
//   xAxis: { spacingPercentage: 0.25 },
//   yAxis: {
//     scale_range: [0, 100],
//     visible: false,
//     line: {
//       width: 0,
//       color: "smartPalette",
//       breaks_gap: 0.06,
//     },
//   },
//   palette: {
//     pointValue: "{%value/100}",
//     colors: ["#87CEFA", "#2d86e5", "#194869"],
//   },
//   defaultTooltip_enabled: false,
//   defaultSeries: {
//     angle: { sweep: 180 },
//     shape: {
//       innerSize: "70%",
//       label: {
//         text: `<span style="color:#333333; font-size:46px;">{%sum:n1}</span><br/><span style="color:#696969; font-size:20px;">${subtitle}</span>`,
//         verticalAlign: "middle",
//       },
//     },
//   },
//   series: [
//     {
//       type: "column roundcaps",
//       points: [{ id: "1", x: "speed", y: 0 }],
//     },
//   ],
//   events: {
//     load: function () {
//       pointRef.current = this.series(0).points(0);
//     },
//   },
// });

const Dashboard = () => {
  const [machine] = useState(machineData);
  const [tempData, setTempData] = useState([]);
  /* const [correntData, setCorrentData] = useState([]); */
  const chartTempRef = useRef(null);
  /* const chartCorrentRef = useRef(null);
  const gaugeRPMRef = useRef(null);
  const gaugeNOleoRef = useRef(null); */
  const tempChart = useRef(null);
  /* const correntChart = useRef(null);
  const rpmPoint = useRef(null);
  const nOleoPoint = useRef(null); */

  useEffect(() => {
    if (chartTempRef.current && !tempChart.current) {
      const optionsTemp = createChartOptions("Temperatura (°C)", "#008FFB");
      tempChart.current = new ApexCharts(chartTempRef.current, optionsTemp);
      tempChart.current.render();
    }
    /* if (chartCorrentRef.current && !correntChart.current) {
      const optionsCorrent = createChartOptions("Corrente (A)", "#FF4560");
      correntChart.current = new ApexCharts(
        chartCorrentRef.current,
        optionsCorrent
      );
      correntChart.current.render();
    }
    if (gaugeRPMRef.current) {
      JSC.chart(gaugeRPMRef.current, createGaugeOptions("RPM", rpmPoint));
    }
    if (gaugeNOleoRef.current) {
      JSC.chart(
        gaugeNOleoRef.current,
        createGaugeOptions("Nível Óleo", nOleoPoint)

      );
    } */

    // Conexão MQTT
    const client = mqtt.connect("ws://192.168.247.10:8080");
    client.on("connect", () => {
      console.log("Conectado ao broker MQTT!");
      client.subscribe(`ioturn/temp`);
      /* client.subscribe(`ioturn/corrente`);
      client.subscribe(`ioturn/rpm`);
      client.subscribe(`ioturn/nivelOleo`); */
    });

    client.on("message", (topic, message) => {
      try {
        let value = message.toString();
        let jsonDATA = JSON.parse(value);
        jsonDATA = jsonDATA.temp;
        const timestamp = new Date().getTime();

        if (topic === `ioturn/temp`) {
          let tickAmountChecker = 5;
          const tempValue = Math.round(jsonDATA);

          if (tempValue > tickAmountChecker) {
            tickAmountChecker = tempValue / 2;
            if (tempChart.current) {
              tempChart.current.updateOptions({
                yaxis: {
                  tickAmount: tickAmountChecker,
                },
              });
            }
          }

          setTempData((prev) => [
            ...prev.slice(-MAX_DATA_POINTS + 1),
            { x: timestamp, y: tempValue },
          ]);
        } /* else if (topic === `ioturn/corrente`) {
          setCorrentData((prev) => [
            ...prev.slice(-MAX_DATA_POINTS + 1),
            { x: timestamp, y: value },
          ]);
        } else if (topic === `ioturn/rpm`) {
          if (rpmPoint.current) rpmPoint.current.options({ y: value });
        } else if (topic === `ioturn/nivelOleo`) {
          if (nOleoPoint.current) nOleoPoint.current.options({ y: value });
        } */
      } catch (e) {
        console.error("Erro ao processar mensagem MQTT:", e);
      }
    });

    return () => {
      if (client) {
        client.end();
      }
      if (tempChart.current) {
        tempChart.current.destroy();
        tempChart.current = null;
      }
      /* if (correntChart.current) {
        correntChart.current.destroy();
        correntChart.current = null;
      }
      if (gaugeRPMRef.current) gaugeRPMRef.current.innerHTML = "";
      if (gaugeNOleoRef.current) gaugeNOleoRef.current.innerHTML = ""; */
    };
  }, []);

  useEffect(() => {
    if (tempChart.current && tempData.length > 0) {
      tempChart.current.updateSeries([{ data: tempData }]);
    }
  }, [tempData]);

  /* useEffect(() => {
    if (correntChart.current && correntData.length > 0) {
      correntChart.current.updateSeries([{ data: correntData }]);
    }
  }, [correntData]); */

  return (
    <div className="flex bg-gradient-to-b from-[#1a2a3a] to-[#90b6e4] text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 sm:ml-20 flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col gap-y-4 p-4">
          <div className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4 text-slate-800">
              Informações do Torno
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Nome:</p>
                <p className="text-lg font-medium text-slate-800">
                  {machine.name}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Modelo:</p>
                <p className="text-lg font-medium text-slate-800">
                  {machine.model}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Fabricante:</p>
                <p className="text-lg font-medium text-slate-800">
                  {machine.fabricante}
                </p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Numeração:</p>
                <p className="text-lg font-medium text-slate-800">
                  {machine.numeracao}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row flex-wrap gap-6 mb-6">
            {/* <div className="bg-white w-full rounded-2xl p-6 shadow-lg lg:flex-1">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Corrente
              </h3>
              <div ref={chartCorrentRef} className="echart-box"></div>
            </div> */}
            {/* <div className="bg-white w-full rounded-2xl p-6 shadow-lg lg:flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">RPM</h3>
              <div ref={gaugeRPMRef} className="gauge-container"></div>
            </div> */}
            <div className="bg-white w-full rounded-2xl p-6 shadow-lg lg:flex-1">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Temperatura
              </h3>
              <div ref={chartTempRef} className="echart-box"></div>
            </div>
            {/* <div className="bg-white w-full rounded-2xl p-6 shadow-lg lg:flex-1 flex flex-col justify-center">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Nível de Óleo
              </h3>
              <div ref={gaugeNOleoRef} className="gauge-container"></div>
            </div> */}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

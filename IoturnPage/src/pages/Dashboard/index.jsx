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
    background: "rgba(255, 255, 255, 0.2)",
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

const Dashboard = () => {
  const [machine] = useState(machineData);
  const [tempData, setTempData] = useState([]);
  const chartTempRef = useRef(null);
  const tempChart = useRef(null);
  const intervalIdRef = useRef(null);

  useEffect(() => {
    if (chartTempRef.current && !tempChart.current) {
      const optionsTemp = createChartOptions("Temperatura (°C)", "#008FFB");
      tempChart.current = new ApexCharts(chartTempRef.current, optionsTemp);
      tempChart.current.render();
    }

    const restartInterval = () => {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = setInterval(() => {
        setTempData((prevData) => {
          if (prevData.length === 0) return prevData;
          const lastPoint = prevData[prevData.length - 1];
          const newPoint = { x: new Date().getTime(), y: lastPoint.y };
          return [...prevData.slice(-MAX_DATA_POINTS + 1), newPoint];
        });
      }, 5000);
    };

    // Conexão MQTT
    //10.42.0.1:9001
    const client = mqtt.connect("ws://test.mosquitto.org:8080");
    client.on("connect", () => {
      console.log("Conectado ao broker MQTT!");
      client.subscribe(`ioturn/temp`);
    });

    client.on("message", (topic, message) => {
      try {
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
      
        const value = message.toString();
        const jsonDATA = JSON.parse(value);
        const tempValue = Math.round(jsonDATA.temp);

        if (tempValue !== -127) {
          const newPoint = {
            x: new Date().getTime(),
            y: tempValue,
          };
          setTempData((prevData) => [
            ...prevData.slice(-MAX_DATA_POINTS + 1),
            newPoint,
          ]);
          restartInterval();
        }
      } catch (e) {
        console.error("Erro ao processar mensagem MQTT:", e);
      }
    });

    restartInterval();

    return () => {
      clearInterval(intervalIdRef.current);
      if (client) client.end();
      if (tempChart.current) {
        tempChart.current.destroy();
        tempChart.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (tempChart.current && tempData.length > 0) {
      tempChart.current.updateSeries([{ data: tempData }]);
    }
  }, [tempData]);

  return (
    <div className="flex bg-[#1a2a3a] text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 sm:ml-20 flex flex-col">
        <Header />
        <main className="flex-grow flex flex-col gap-y-4 p-4">
          <div className="rounded-2xl p-6 shadow-lg mb-6">
            <h2 className="text-2xl font-semibold mb-4">
              Informações do Torno
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-slate-600">Nome:</p>
                <p className="text-lg font-medium">{machine.name}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Modelo:</p>
                <p className="text-lg font-medium">{machine.model}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Fabricante:</p>
                <p className="text-lg font-medium">{machine.fabricante}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600">Numeração:</p>
                <p className="text-lg font-medium">{machine.numeracao}</p>
              </div>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row flex-wrap gap-6 mb-6">
            <div className="bg-white w-full rounded-2xl p-6 shadow-lg lg:flex-1">
              <h3 className="text-xl font-semibold mb-4 text-slate-800">
                Temperatura
              </h3>
              <div ref={chartTempRef} className="echart-box"></div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

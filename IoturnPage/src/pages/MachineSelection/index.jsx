import React from "react";
import MachineCard from "../../components/MachineCard";
import assetImage from "../../assets/GH-1440TZ.png";
import optimumImage from "../../assets/bv20.png";
import yhdmImage from "../../assets/YHDM-1000.png";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./animations.css";

//Mapear dados do banco e pegar as máquinas por ID(esperar condições para fetch)

const machines = [
  { id: 1, numeração: 1, manufactor: "ASSET", name: "Torno ASSET", model: "GH-1440TZ", image: assetImage, status: "Ativa" },
  { id: 2, numeração: 2, manufactor: "Optimum", name: "Fresadora Optimum", model: "BV-20", image: optimumImage, status: "Em manutenção" },
  { id: 3, numeração: 3, manufactor: "YHDM", name: "Mandriladora YHDM", model: "YHDM-1000", image: yhdmImage, status: "Inativa" },
  { id: 4, numeração: 4, manufactor: "EHDM", name: "Mandriladora EHDM", model: "YHDM-1990", image: yhdmImage, status: "Inativa" },
  { id: 5, numeração: 5, manufactor: "WEILER", name: "Torno WEILER", model: "Condor VS2", image: yhdmImage, status: "Ativa" },
  { id: 6, numeração: 6, manufactor: "ROMI", name: "Torno ROMI", model: "C420", image: yhdmImage, status: "Ativa" },
  { id: 7, numeração: 7, manufactor: "Haas", name: "Centro de Usinagem Haas", model: "VF-2", image: yhdmImage, status: "Em manutenção" },
  { id: 8, numeração: 8, manufactor: "Makino", name: "Centro de Usinagem Makino", model: "PS95", image: yhdmImage, status: "Ativa" },
  { id: 9, numeração: 9, manufactor: "Mazak", name: "Torno CNC Mazak", model: "QT-200", image: yhdmImage, status: "Inativa" },
  { id: 10, numeração: 10, manufactor: "DMG MORI", name: "Fresadora CNC DMG", model: "DMU 50", image: yhdmImage, status: "Ativa" },
];

const MachineSelection = () => {
  return (
    <div className="min-h-screen bg-[#111111] text-white">
      <Header />
      <Sidebar />
      <main className="ml-20 p-5 flex justify-center min-h-screen" >
        <section className="flex flex-wrap gap-5 justify-center min-h-[calc(100vh-80px)] w-full ">
          {machines.map((machine, index) => (
            <MachineCard
              key={machine.model}
              machine={machine}
              className=" bg-[#222222] machine-card text-amber-50 w-3/7 rounded-3xl shadow-xl overflow-hidden flex flex-col text-decoration-none transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl hover:bg-[#1f2b39] border-2 border-transparent hover:border-blue-500 transform"
              style={{ animationDelay: `${index * 0.02}s` }}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default MachineSelection;
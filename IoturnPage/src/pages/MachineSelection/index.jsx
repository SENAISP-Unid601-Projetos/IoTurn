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
  { id: 1, name: "ASSET", model: "GH-1440TZ", image: assetImage },
  { id: 2, name: "Optimum", model: "BV-20", image: optimumImage },
  { id: 3, name: "YHDM", model: "YHDM-1000", image: yhdmImage },
];

const MachineSelection = () => {
  return (
    <div className="min-h-screen bg-[#1a2a3a] text-white">
      <Header />
      <Sidebar />
      <main className="flex-1 ml-20 p-8 text-center">
        <section className="flex flex-col gap-3 items-center">
          {machines.map((machine, index) => (
            <MachineCard
              key={machine.model}
              machine={machine}
              className="group machine-card bg-white/30 w-2/3 rounded-2xl shadow-lg overflow-hidden flex flex-col text-decoration-none transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default MachineSelection;
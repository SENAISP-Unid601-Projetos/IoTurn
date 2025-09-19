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
  { id: 1, name: "ASSET", model: "GH-1440TZ", image: assetImage, status: true },
  {
    id: 2,
    name: "Optimum",
    model: "BV-20",
    image: optimumImage,
    status: false,
  },
  { id: 3, name: "YHDM", model: "YHDM-1000", image: yhdmImage, status: true },
];

const MachineSelection = () => {
  //#080509
  return (
    <div className="min-h-screen bg-[#101820] text-white">
      <Header />
      <Sidebar />
      <main className="flex-1 ml-20 p-6 text-center">
        <section className="flex md:flex-col gap-3 items-center bg-red-500">
          {machines.map((machine, index) => (
            <MachineCard
              key={machine.model}
              machine={machine}
              className="bg-white/30 text-slate-400 rounded-2xl shadow-lg overflow-hidden flex flex-col text-decoration-none transition-all duration-300 ease-in-out w-full"
              style={{ animationDelay: `${index * 0.1}s` }}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default MachineSelection;

import React, { useState } from "react";
import { Link } from "react-router-dom";

import MachineCard from "../../components/MachineCard";
import assetImage from "../../assets/GH-1440TZ.png";
import optimumImage from "../../assets/bv20.png";
import yhdmImage from "../../assets/YHDM-1000.png";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./animations.css";

const machines = [
  { name: "ASSET", model: "GH-1440TZ", image: assetImage },
  { name: "Optimum", model: "BV-20", image: optimumImage },
  { name: "YHDM", model: "YHDM-1000", image: yhdmImage },
];

const UpdatedMachineCard = ({ machine, delay }) => (
  <Link
    to="/dashboard"
    className="group machine-card bg-white/20 rounded-2xl shadow-lg overflow-hidden flex flex-col text-decoration-none transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
    style={{ animationDelay: `${delay}s` }}
  >
    <div className="overflow-hidden">
      <img
        src={machine.image}
        alt={`Torno Mecânico ${machine.name}`}
        className="w-full aspect-video object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
      />
    </div>
    <div className="p-6 flex flex-col flex-grow">
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{machine.name}</h2>
      <p className="text-gray-600">
        Visualizar dados do modelo: {machine.model}
      </p>
    </div>
  </Link>
);

const MachineSelection = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1a2a3a] to-[#90b6e4] text-white">
      <Header />
      <Sidebar />
      <main className="flex-1 ml-20 p-8 text-center">
        <h1 className="text-4xl font-bold mb-8 text-white">
          Selecione um Torno
        </h1>
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {machines.map((machine, index) => (
            <UpdatedMachineCard
              key={machine.model}
              machine={machine}
              delay={index * 0.1}
            />
          ))}
        </section>
      </main>
    </div>
  );
};

export default MachineSelection;

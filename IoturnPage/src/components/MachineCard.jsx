import React, { useState } from "react";
import { Link } from "react-router-dom";

const MachineCard = ({ machine, className }) => {
  return (
    <Link to={`/dashboard`} title="dashboard" className={className}>
      <div className="bg-[#22384d] flex flex-col-reverse justify-around items-center text-left">
        <div className="w-full px-6 py-2">
          <div className="mb-2">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-sans font-bold text-slate-100">
                  {machine.name}
                </h2>
                <p className="text-xs font-sans">{machine.model}</p>
              </div>
              {machine.status ? (
                <p className="text-green-400">Online</p>
              ) : (
                <p className="text-red-400">Offline</p>
              )}
            </div>
          </div>
          <div className="mb-4">
            <p>dados</p>
            <p>mais dados</p>
          </div>
          <div>
            <div className="flex justify-between">
              <p>Eficiência</p>
              <p className="text-slate-100">94%</p>
            </div>
          </div>
        </div>

        <div className="w-full bg-white">
          <img
            src={machine.image}
            alt={`Torno Mecânico ${machine.name} ${machine.model}`}
            className="h-80 w-full object-cover"
          />
        </div>
      </div>
    </Link>
  );
};

export default MachineCard;

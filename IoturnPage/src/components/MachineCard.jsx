import React from "react";
import { Link } from "react-router-dom";

const MachineCard = ({ machine, className }) => {
  return (
    <Link to={`/dashboard`} title="dashboard" className={className}>
      <div className="w-1/2 max-w-[200px] mx-auto">
        <img
          src={machine.image}
          alt={`Torno Mecânico ${machine.name} ${machine.model}`}
          className="h-full w-full object-contain flex flex-row p-4"
        />
      </div>

      <div className="flex flex-row p-4 w-full h-full text-left bg-[#282838]">
        <div className="text-amber-50">
          <h2 className="text-2xl font-sans">
            {/*Nome*/}
            <span className="font-bold">{machine.name}</span>
          </h2>
          <p className="text-x1 font-sans">
            <div>
              {/*Modelo*/}
              <span className="text-1xl font-bold">{machine.model}</span>
            </div>
            <div>
              Status{" "}
              <span
                className={`font-bold ${
                  machine.status === "Ativa"
                    ? "text-green-500"
                    : machine.status === "Em manutenção"
                    ? "text-yellow-500"
                    : machine.status === "Inativa"
                    ? "text-red-500"
                    : "text-gray-500"
                }`}
              >
                {machine.status}
              </span>
            </div>
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MachineCard;

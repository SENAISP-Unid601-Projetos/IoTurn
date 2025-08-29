import React from "react";
import { Link } from "react-router-dom";

const MachineCard = ({ machine, className }) => {
  return (
    <Link
      to={`/dashboard`}
      title="dashboard"
      className={className}
    >
      <div className="flex flex-row justify-around items-center p-4 w-full h-full text-left">
        <div className="text-slate-800">
          <h2 className="text-2xl font-sans">
            Name: <span className="font-bold">{machine.name}</span>
          </h2>
          <p className="text-xl font-sans">
            model: <span className="font-bold">{machine.model}</span>
          </p>
        </div>

        <div className="w-1/2 max-w-[200px]">
          <img
            src={machine.image}
            alt={`Torno Mecânico ${machine.name} ${machine.model}`}
            className="h-full w-full object-contain"
          />
        </div>
      </div>
    </Link>
  );
};

export default MachineCard;

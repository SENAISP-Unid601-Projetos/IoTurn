import React from 'react';

const MachineCard = ({ machine, delay }) => {
  return (
    <a
      href="/dashboard" // Em um aplicativo React real, você usaria o componente <Link> do React Router
      className="group machine-card bg-white/20 rounded-2xl shadow-lg overflow-hidden flex flex-col text-decoration-none transition-all duration-300 ease-in-out hover:-translate-y-1 hover:shadow-xl"
      style={{ animationDelay: `${delay}s` }}
    >
      <div className="overflow-hidden">
        <img
          src={machine.image}
          alt={`Torno Mecânico ${machine.name} ${machine.model}`}
          className="w-full aspect-video object-cover transition-transform duration-300 ease-in-out group-hover:scale-105"
        />
      </div>
      <div className="p-6 flex flex-col flex-grow">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{machine.name}</h2>
        <p className="text-gray-600">Visualizar dados do modelo: {machine.model}</p>
      </div>
    </a>
  );
};

export default MachineCard;
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "../../assets/LogoSemBorda2.png";
import backgroundImage from "../../assets/Fundo.jpg";

export default function LandingPage() {
  return (
    <div
      className="relative min-h-screen bg-cover bg-center text-white overflow-x-hidden font-sans"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <motion.header
        className="absolute top-0 w-full flex justify-between items-center py-4 px-6 z-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
      >
        <img src={logo} alt="Logo IoTurn" className="h-16" />

        <Link to="/dashboard" title="Dah=dashboard">
          <button
          title="Login"
          className="bg-transparent borde-none cursor-pointer mr-12"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-10 w-10 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
        </button>
        </Link>
      </motion.header>

      <main className="min-h-screen flex items-center justify-end text-right pr-20">
        <div className="max-w-1/2">
          <p className="font-semibold text-2xl text-[#2d86e5]">
            IoTurn: Monitoramento Inteligente
          </p>
          <h1 className="text-6xl font-bold">
            Dados em tempo real para otimizar sua produção
          </h1>
          <p className="text-xl mt-2">
            A IoTurn utiliza IoT para monitorar máquinas em tempo real. Aumentando a
            produtividade com decisões baseadas em dados.
          </p>
        </div>
      </main>

      <footer className="absolute bottom-0 w-full text-center py-4">
        <p className="mb-0">© 2025 IoTurn. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

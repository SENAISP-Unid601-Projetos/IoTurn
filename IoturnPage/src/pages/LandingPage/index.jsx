import React, { useState } from "react";
import logo from "../../assets/LogoSemBorda2.png";
import backgroundImage from "../../assets/Fundo.jpg";
import "./landing.css";

export default function LandingPage() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const openSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <div
      className="hero-container"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <header className="header">
        <img src={logo} alt="Logo IoTurn" className="logo" />
        <button onClick={openSidebar} title="Login" className="login-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="user-icon"
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
      </header>

      <main className="main-content">
        <div className="hero-text">
          <p className="subtitle">
            IoTurn: Monitoramento Inteligente para Torneamento de Alta Precisão
          </p>
          <h1 className="title">
            Dados em tempo real para otimizar sua produção
          </h1>
          <p className="description">
            A IoTurn utiliza IoT para monitorar tornos mecânicos em tempo real,
            coletando dados como velocidade, temperatura e eficiência. Aumente a
            produtividade com decisões baseadas em dados.
          </p>
        </div>
      </main>

      <div
        className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
        <button onClick={closeSidebar} className="close-sidebar-button">
          &times;
        </button>
        <div className="sidebar-content">
          <form action="" className="formLogin">
            <h2>Login</h2>
            <div>
            <label htmlFor="email">Email:</label>
            <input type="text" id="emailInput" />
            </div>
            <div>
            <label htmlFor="password">Senha:</label>
            <input type="text" id="passwordInput" />
            </div>
          </form>
        </div>
      </aside>

      <footer className="footer">
        <p>© 2025 IoTurn. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

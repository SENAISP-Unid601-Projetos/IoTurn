import React from "react";
import "./App.css"; // Vamos manter o CSS para uma estilização básica

function App() {
  return (
    <div className="container">
      <header className="header">
        <h1>Bem-vindo ao Meu App com React e Docker!</h1>
      </header>
      <main className="main-content">
        <p>
          Esta é uma página simples criada com React e Vite, pronta para ser
          containerizada com Docker.
        </p>
        <a
          href="https://react.dev"
          target="_blank"
          rel="noopener noreferrer"
          className="link"
        >
          Aprenda mais sobre React
        </a>
      </main>
      <footer className="footer">
        <p>Desenvolvido com ❤️</p>
      </footer>
    </div>
  );
}

export default App;

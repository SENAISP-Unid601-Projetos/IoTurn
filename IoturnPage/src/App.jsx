import React from "react";
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MachineSelection from "./pages/MachineSelection";
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/selecao" element={<MachineSelection />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chatbot" element={<Chat />} />
    </Routes>
  );
}

export default App;

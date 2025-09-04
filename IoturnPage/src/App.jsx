import React from "react";
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MachineSelection from "./pages/MachineSelection";
import Chat from "./pages/Chat";
import LoginPage from "./pages/LoginPage"

function App() {
  return (
    <Routes>
      {/* <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/selecao" element={<MachineSelection />} />
      <Route path="/dashboard" element={<Dashboard />} />*/}
      <Route path="/chatbot" element={<Chat />} /> 
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}

export default App;
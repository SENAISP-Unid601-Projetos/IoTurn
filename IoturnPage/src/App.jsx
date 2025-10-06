import React from "react";
import { Routes, Route } from 'react-router-dom';
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Chat from "./pages/Chat";

import SidebarButton from "./components/atoms/SidebarButton";
import Sidebar from "./components/molecules/Sidebar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Sidebar></Sidebar>} />
      {/* <Route path="/" element={<LandingPage />} /> */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/chatbot" element={<Chat />} /> 
    </Routes>
  );
}

export default App;
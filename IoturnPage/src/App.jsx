import React from "react";
import { Routes, Route } from 'react-router-dom';
import DashboardSelector from "./pages/Dashbord/DashboardSelector";
import Home from "./pages/Initial";
import Login from "./pages/Login";
import MainLayout from './pages/MainLayout';
import MaquinasGerenciamentoPage from "./pages/Gerenciamento/GerenciamentoMaquinas";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<MainLayout />}>
        <Route index element={<MainLayout />} />
        <Route path="/main/maquinas" element={<DashboardSelector />} />
        <Route path="gerenciamento/maquinas" element={<MaquinasGerenciamentoPage />} />
      </Route>
    </Routes>
  );
}

export default App;
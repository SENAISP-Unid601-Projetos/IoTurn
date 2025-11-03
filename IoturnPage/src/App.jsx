import React from "react";
import { Routes, Route } from "react-router-dom";
import MainLayout from "./pages/MainLayout";
import DashboardSelector from "./pages/Dashbord/DashboardSelector";
import Home from "./pages/Initial";
import Login from "./pages/Login";
import MaquinasGerenciamentoPage from "./pages/Gerenciamento/GerenciamentoMaquinas";
import DispositivosGerenciamentoPage from "./pages/Gerenciamento/GerenciamentoDispositivos";
import GatewaysGerencimentoPage from "./pages/Gerenciamento/GerenciamentoGateways"
import GerenciamentoUsers from "./pages/Gerenciamento/GerenciamentoUsers";
import HermesAIPage from "./pages/Chat/HermesAiPage";
import MachineDashboard from "./pages/Dashbord/MachineDashboard";
import ClusterAnalysisPage from "./pages/Clusters/ClusterAnalysisPage";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/main" element={<MainLayout />}>
        <Route index element={<MainLayout />} />

        <Route path="/main/maquinas" element={<DashboardSelector />} />
        <Route path="dashboard/:machineId" element={<MachineDashboard />} />
        <Route path="/main/hermes" element={<HermesAIPage />} />
        <Route path="/main/clusters" element={<ClusterAnalysisPage />} />
        <Route path="gerenciamento/maquinas" element={<MaquinasGerenciamentoPage />} />
        <Route path="gerenciamento/dispositivos" element={<DispositivosGerenciamentoPage />} />
        <Route path="gerenciamento/gateways" element={<GatewaysGerencimentoPage />} />
        <Route path="gerenciamento/usuarios" element={<GerenciamentoUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
import React from "react";
import { Routes, Route } from 'react-router-dom';
import DashboardSelector from "./pages/Dashbord/DashboardSelector";
import Home from "./pages/Initial";
import Login from "./pages/Login";
import MainLayout from './pages/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/Login" element={<Login />} />
      <Route path="/main" element={<MainLayout />}>
        <Route index element={<DashboardSelector />} />
        <Route path="maquinas" element={<DashboardSelector />} />
      </Route>
    </Routes>
  );
}

export default App;


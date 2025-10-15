import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Initial";
import { Routes, Route } from 'react-router-dom';
import DashboardSelector from "./pages/Dashbord/DashboardSelector";
import MainLayout from './pages/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chatbot" element={<Chat />} />
      <Route path="/" element={<MainLayout />}>
        <Route index element={<MainLayout />} />
        <Route path="maquinas" element={<DashboardSelector />} />
      </Route>
    </Routes>
  );
}

export default App;


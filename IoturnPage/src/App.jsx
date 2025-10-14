import React from "react";
import { Routes, Route } from 'react-router-dom';
import Chat from "./pages/Chat";
import DashboardSelector from "./pages/Dashbord/DashboardSelector";
import MainLayout from './pages/MainLayout';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout/>} /> 
    </Routes>
  );
}

export default App;
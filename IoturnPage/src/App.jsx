import React from "react";
import { Routes, Route } from 'react-router-dom';
import Chat from "./pages/Chat";
import Sidebar from "./components/Sidebar";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Sidebar />} /> 
    </Routes>
  );
}

export default App;
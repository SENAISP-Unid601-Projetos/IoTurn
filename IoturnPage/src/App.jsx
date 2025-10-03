import React from "react";
import { Routes, Route } from 'react-router-dom';
import Chat from "./pages/Chat";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Chat />} /> 
    </Routes>
  );
}

export default App;
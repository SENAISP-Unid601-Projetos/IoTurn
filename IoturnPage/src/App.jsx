import React from "react";
import { Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Home from "./pages/Initial";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chatbot" element={<Chat />} />
    </Routes>
  );
}

export default App;


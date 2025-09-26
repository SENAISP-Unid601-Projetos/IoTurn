import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, LayoutDashboard, MessageCircle, LogOut } from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", icon: <Home />, text: "Página Inicial" },
    { to: "/dashboard", icon: <LayoutDashboard />, text: "Dashboard" },
    { to: "/chatbot", icon: <MessageCircle />, text: "Chatbot" },
  ];

  return (
    <aside className="bg-black text-white w-20 min-h-screen p-4 flex flex-col items-center fixed left-0 top-0">
      <nav className="flex flex-col flex-grow gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            title={link.text}
            className={`flex items-center justify-center p-4 rounded-lg transition-colors duration-200 ${
              location.pathname === link.to
                ? "bg-gray-700 text-white"
                : "hover:bg-gray-800"
            }`}
          >
            <span className="text-2xl">{link.icon}</span>
          </Link>
        ))}
      </nav>

      <div>
        <Link
          to="/"
          title="Sair"
          className="flex items-center justify-center p-4 rounded-lg transition-colors duration-200 hover:bg-gray-800"
        >
          <span className="text-2xl"><LogOut /></span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
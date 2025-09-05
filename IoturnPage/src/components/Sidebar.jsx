import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaHome, FaTachometerAlt, FaRobot, FaSignOutAlt } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();

  const navLinks = [
    { to: "/", icon: <FaHome />, text: "Página Inicial" },
    { to: "/dashboard", icon: <FaTachometerAlt />, text: "Dashboard" },
    // { to: "/chatbot", icon: <FaRobot />, text: "Chatbot" },
  ];

  return (
    <aside className="bg-black/30 backdrop-blur-md text-white w-20 min-h-screen p-4 flex flex-col items-center fixed left-0 top-0">
      <nav className="flex flex-col flex-grow gap-4">
        {navLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            title={link.text}
            className={`flex items-center justify-center p-4 rounded-lg transition-colors duration-200 ${
              location.pathname === link.to
                ? "bg-white/20 text-[#2d86e5]"
                : "hover:bg-white/10"
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
          className="flex items-center justify-center p-4 rounded-lg transition-colors duration-200 hover:bg-white/10"
        >
          <span className="text-2xl"><FaSignOutAlt /></span>
        </Link>
      </div>
    </aside>
  );
};

export default Sidebar;
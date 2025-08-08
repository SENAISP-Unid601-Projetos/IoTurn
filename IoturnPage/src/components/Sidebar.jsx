import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, onClose }) => {
  return (
    <>
      <div
        className={`fixed inset-0 bg-black/50 z-[99] transition-opacity duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      ></div>
      <nav
        className={`fixed top-0 h-full w-64 bg-black/30 backdrop-blur-md p-6 transition-transform duration-300 ease-in-out z-[100] ${
          isOpen ? "right-0" : "-right-full"
        }`}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white text-4xl bg-transparent border-none cursor-pointer"
        >
          &times;
        </button>
        <ul className="mt-20 list-none p-0">
          <li className="mb-4">
            <Link
              to="/selecao"
              className="text-white text-lg no-underline hover:text-[#2d86e5]"
            >
              Página Inicial
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/dashboard"
              className="text-white text-lg no-underline hover:text-[#2d86e5]"
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/chatbot"
              className="text-white text-lg no-underline hover:text-[#2d86e5]"
            >
              Chatbot
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Sidebar;

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/LogoSemBorda2.png';

const Header = () => {
  return (
    <header className="flex justify-between items-center p-4 lg:p-6">
      <Link to="/selecao">
        <img src={logo} alt="Logo IoTurn" className="h-16" />
      </Link>
    </header>
  );
};

export default Header;
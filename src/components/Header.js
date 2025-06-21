import React from 'react';
import { Link } from 'react-router-dom';


function Header() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">Concessionária</Link>
      <div className="navbar-nav">
        <Link className="nav-link" to="/motos">Motos</Link>
        <Link className="nav-link" to="/clientes">Clientes</Link>
        <Link className="nav-link" to="/encomendas">Encomendas</Link>
      </div>
    </nav>
  );
}

export default Header;
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-[#34375a] text-white px-6 py-3 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/" className="hover:underline">Dashboard</Link>
        <Link to="/incomes" className="hover:underline">Entradas</Link>
        <Link to="/expenses" className="hover:underline">Saídas</Link>
        <Link to="/employees" className="hover:underline">Funcionários</Link>
      </div>
      <button onClick={handleLogout} className="bg-black px-4 py-1 rounded hover:bg-gray-800">
        Sair
      </button>
    </nav>
  );
}

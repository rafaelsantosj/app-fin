import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiLogOut, FiHome, FiTrendingUp, FiTrendingDown, FiUsers } from 'react-icons/fi';

export default function Sidebar() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem('user'));

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate(0);
  };

  const menuItems = [
    { label: 'Dashboard', icon: <FiHome />, path: '/' },
    { label: 'Entradas', icon: <FiTrendingUp />, path: '/incomes' },
    { label: 'Saídas', icon: <FiTrendingDown />, path: '/expenses' },
    { label: 'Funcionários', icon: <FiUsers />, path: '/employees' },
  ];

  return (
    <aside className="w-60 bg-[#34375a] text-white p-6 flex flex-col justify-between min-h-screen">
      <div>
        <h2 className="text-xl font-bold mb-8">Dealle Arquitetura & Marcenaria Moderna LTDA</h2>
        <nav className="flex flex-col gap-4">
          {menuItems.map((item, idx) => (
            <button
              key={idx}
              onClick={() => navigate(item.path)}
              className="text-left flex items-center gap-2 hover:text-gray-300"
            >
              {item.icon} {item.label}
            </button>
          ))}
        </nav>
      </div>
      <div>
        {user && (
          <p className="text-sm mb-2">🔒 Logado como <strong>{user.name}</strong></p>
        )}
        <button
          onClick={handleLogout}
          className="bg-black text-white px-4 py-2 rounded flex items-center gap-2 justify-center"
        >
          <FiLogOut /> Sair
        </button>
      </div>
    </aside>
  );
}

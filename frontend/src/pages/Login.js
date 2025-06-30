import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return alert('Preencha todos os campos.');

    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      if (onLogin) onLogin(res.data.user);
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.message || 'E-mail ou senha inválidos');
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center flex flex-col items-center justify-center px-4"
      style={{ backgroundImage: 'url(/fundo-login.jpg)' }} // 🔁 ajuste o caminho conforme sua imagem
    >
      <div className="text-center mb-8">
        <h1 className="text-xl sm:text-2xl text-[#1d2c5e] font-light tracking-wide">DEALLE ARQUITETURA &</h1>
        <h2 className="text-2xl sm:text-4xl font-extrabold text-[#34375a]">MARCENARIA MODERNA LTDA</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#34375a] p-8 rounded-xl shadow-lg w-full max-w-sm text-white">
        <h3 className="text-xl font-semibold mb-4 text-center">Login</h3>
        <input
          type="email"
          placeholder="E-mail"
          className="w-full p-2 mb-3 rounded text-black"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          className="w-full p-2 mb-4 rounded text-black"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="bg-black hover:bg-gray-800 text-white py-2 rounded w-full">
          Entrar
        </button>
      </form>
    </div>
  );
}

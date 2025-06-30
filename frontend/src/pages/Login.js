import React, { useState } from 'react';
import api from '../services/api';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin(res.data.user);
    } catch (err) {
      setError('E-mail ou senha inválidos.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-[#34375a]">
      <div className="text-center mb-10">
        <h1 className="text-2xl sm:text-3xl font-light">DEALLE ARQUITETURA &</h1>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">MARCENARIA MODERNA LTDA</h2>
      </div>

      <form onSubmit={handleSubmit} className="bg-[#34375a] text-white p-8 rounded-lg shadow-lg w-80">
        <h3 className="text-xl font-bold mb-4 text-center">Login</h3>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-3 rounded text-black"
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded text-black"
        />
        {error && <div className="text-red-300 text-sm mb-2">{error}</div>}
        <button type="submit" className="bg-black text-white w-full py-2 rounded hover:opacity-90">
          Entrar
        </button>
      </form>
    </div>
  );
}

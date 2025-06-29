import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/');
    } catch (err) {
      setError('Erro ao registrar. Verifique os dados.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <form onSubmit={handleSubmit} className="bg-[#34375a] text-white p-8 rounded-xl w-full max-w-sm">
        <h1 className="text-xl mb-4 font-bold">Criar Conta</h1>

        <input type="text" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full p-2 mb-4 rounded text-black" />
        <input type="email" placeholder="E-mail" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="w-full p-2 mb-4 rounded text-black" />
        <input type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="w-full p-2 mb-4 rounded text-black" />

        {error && <p className="text-red-400 mb-2">{error}</p>}

        <button type="submit" className="bg-black text-white p-2 rounded w-full">Registrar</button>
        <p className="text-sm mt-4">Já tem uma conta? <span onClick={() => navigate('/')} className="underline cursor-pointer">Entrar</span></p>
      </form>
    </div>
  );
}
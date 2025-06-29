import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Expenses() {
  const user = JSON.parse(localStorage.getItem('user'));
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ id: null, description: '', category: '', amount: '', date: '' });
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get('/expenses');
    setList(res.data);
    const unique = [...new Set(res.data.map(i => i.category).filter(Boolean))];
    setCategories(unique);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const category = form.category === 'OUTRA' ? customCategory.trim() : form.category;

    if (!form.description || !form.amount || !form.date || !category) {
      alert('Preencha todos os campos.');
      return;
    }

    const payload = { ...form, category, userId: user?.id };

    if (form.id) {
      await api.put(`/expenses/${form.id}`, payload);
    } else {
      await api.post('/expenses', payload);
    }

    setForm({ id: null, description: '', category: '', amount: '', date: '' });
    setCustomCategory('');
    loadData();
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      description: item.description,
      category: item.category,
      amount: item.amount,
      date: item.date.slice(0, 10)
    });
    if (!categories.includes(item.category)) {
      setCustomCategory(item.category);
      setForm((prev) => ({ ...prev, category: 'OUTRA' }));
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta saída?')) {
      await api.delete(`/expenses/${id}`);
      loadData();
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white p-6 min-h-screen text-black">
        <h1 className="text-2xl font-bold text-[#34375a] mb-4">Saídas</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input type="text" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-2 border rounded" />

          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-2 border rounded"
          >
            <option value="">Selecione categoria</option>
            {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            <option value="OUTRA">Outra...</option>
          </select>

          {form.category === 'OUTRA' && (
            <input
              type="text"
              placeholder="Nova categoria"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="p-2 border rounded"
            />
          )}

          <input type="number" placeholder="Valor" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="p-2 border rounded" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-2 border rounded" />
          <button type="submit" className="bg-[#34375a] text-white p-2 rounded col-span-full">
            {form.id ? 'Atualizar' : 'Cadastrar'}
          </button>
        </form>

        <div className="overflow-x-auto">
          <table className="min-w-full border text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="py-2 px-4">Data</th>
                <th className="py-2 px-4">Descrição</th>
                <th className="py-2 px-4">Categoria</th>
                <th className="py-2 px-4">Valor</th>
                <th className="py-2 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <tr key={item.id} className="border-t">
                  <td className="py-2 px-4">{formatDate(item.date)}</td>
                  <td className="py-2 px-4">{item.description}</td>
                  <td className="py-2 px-4">{item.category}</td>
                  <td className="py-2 px-4">R$ {parseFloat(item.amount).toFixed(2)}</td>
                  <td className="py-2 px-4 flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="text-sm text-blue-600 underline"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="text-sm text-red-600 underline"
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

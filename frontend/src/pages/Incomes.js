import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Incomes() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({
    id: null,
    description: '',
    amount: '',
    date: '',
    payment_type: 'avista',
    installments: '',
    signal_date: '',
    end_date: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const res = await api.get('/incomes');
    setList(res.data);
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  if (!form.description || !form.amount || !form.date || !form.payment_type) {
    alert('Preencha todos os campos obrigatórios.');
    return;
  }

  const payload = {
    ...form,
    amount: parseFloat(form.amount),
    installments:
      form.payment_type === 'parcelado' ? parseInt(form.installments) || null : null,
    signal_date:
      form.payment_type === 'sinal_e_fim' && form.signal_date ? form.signal_date : null,
    end_date:
      form.payment_type === 'sinal_e_fim' && form.end_date ? form.end_date : null,
  };

  try {
    if (form.id) {
      await api.put(`/incomes/${form.id}`, payload);
    } else {
      await api.post('/incomes', payload);
    }

    setForm({
      id: null,
      description: '',
      amount: '',
      date: '',
      payment_type: 'avista',
      installments: '',
      signal_date: '',
      end_date: '',
    });

    loadData();
  } catch (err) {
    alert('Erro ao salvar entrada. Verifique os dados e tente novamente.');
    console.error(err);
  }
};

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date.slice(0, 10),
      payment_type: item.payment_type || 'avista',
      installments: item.installments || '',
      signal_date: item.signal_date || '',
      end_date: item.end_date || ''
    });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Deseja realmente excluir esta entrada?')) {
      await api.delete(`/incomes/${id}`);
      loadData();
    }
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1).toString().padStart(2, '0')}/${d.getFullYear()}`;
  };

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white p-6 min-h-screen text-black">
        <h1 className="text-2xl font-bold text-[#34375a] mb-4">Entradas</h1>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <input type="text" placeholder="Descrição" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Valor total" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="p-2 border rounded" />
          <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="p-2 border rounded" />
          <select value={form.payment_type} onChange={(e) => setForm({ ...form, payment_type: e.target.value })} className="p-2 border rounded">
            <option value="avista">À vista</option>
            <option value="parcelado">Parcelado</option>
            <option value="sinal_e_fim">Sinal e fim</option>
          </select>

          {form.payment_type === 'parcelado' && (
            <input type="number" placeholder="Parcelas" value={form.installments} onChange={(e) => setForm({ ...form, installments: e.target.value })} className="p-2 border rounded col-span-2" />
          )}

          {form.payment_type === 'sinal_e_fim' && (
            <>
              <input type="date" placeholder="Data do sinal" value={form.signal_date} onChange={(e) => setForm({ ...form, signal_date: e.target.value })} className="p-2 border rounded" />
              <input type="date" placeholder="Data final" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })} className="p-2 border rounded" />
            </>
          )}

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
                <th className="py-2 px-4">Valor</th>
                <th className="py-2 px-4">Ações</th>
              </tr>
            </thead>
            <tbody>
              {list.map(item => (
                <React.Fragment key={item.id}>
                  <tr className="border-t bg-white font-medium">
                    <td className="py-2 px-4">{formatDate(item.date)}</td>
                    <td className="py-2 px-4">
                      {item.description}
                      <div className="text-xs text-gray-500 italic">
                        {item.payment_type === 'parcelado' && `Parcelado em ${item.installments}x`}
                        {item.payment_type === 'sinal_e_fim' && `Sinal e fim`}
                        {item.payment_type === 'avista' && `À vista`}
                      </div>
                    </td>
                    <td className="py-2 px-4">R$ {parseFloat(item.amount).toFixed(2)}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-sm text-blue-600 underline">Editar</button>
                      <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 underline">Excluir</button>
                    </td>
                  </tr>

                  {item.IncomeParts && item.IncomeParts.map(part => (
                    <tr key={part.id} className="bg-gray-50 border-t">
                      <td className="py-1 px-4">{formatDate(part.date)}</td>
                      <td className="py-1 px-4 text-sm">{part.label}</td>
                      <td className="py-1 px-4 text-sm">R$ {parseFloat(part.amount).toFixed(2)}</td>
                      <td className="py-1 px-4 text-xs italic text-gray-500">Parcela</td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}
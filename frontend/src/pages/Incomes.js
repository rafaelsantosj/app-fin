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
    parts: [], // [{ amount, payment_type, parcelas, desconto_maquininha }]
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
    if (!form.description || !form.amount || !form.date) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    const payload = {
      ...form,
      amount: parseFloat(form.amount),
      parts: form.parts.map(p => ({
        ...p,
        amount: parseFloat(p.amount),
        parcelas: p.parcelas ? parseInt(p.parcelas) : null,
        desconto_maquininha: p.desconto_maquininha ? parseFloat(p.desconto_maquininha) : 0,
      }))
    };

    try {
      if (form.id) {
        await api.put(`/incomes/${form.id}`, payload);
      } else {
        await api.post('/incomes', payload);
      }

      setForm({ id: null, description: '', amount: '', date: '', parts: [] });
      loadData();
    } catch (err) {
      alert('Erro ao salvar entrada.');
      console.error(err);
    }
  };

  const handleAddPart = () => {
    setForm({
      ...form,
      parts: [...form.parts, { amount: '', payment_type: 'dinheiro', parcelas: '', desconto_maquininha: '' }]
    });
  };

  const handlePartChange = (index, field, value) => {
    const updatedParts = [...form.parts];
    updatedParts[index][field] = value;
    setForm({ ...form, parts: updatedParts });
  };

  const handleRemovePart = (index) => {
    const updatedParts = [...form.parts];
    updatedParts.splice(index, 1);
    setForm({ ...form, parts: updatedParts });
  };

  const handleEdit = (item) => {
    setForm({
      id: item.id,
      description: item.description,
      amount: item.amount,
      date: item.date.slice(0, 10),
      parts: item.IncomeParts?.map(p => ({
        amount: p.amount,
        payment_type: p.payment_type || '',
        parcelas: p.parcelas || '',
        desconto_maquininha: p.desconto_maquininha || ''
      })) || [],
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
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
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
        </form>

        <div className="mb-4">
          <h2 className="text-lg font-semibold">Formas de pagamento</h2>
          {form.parts.map((part, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-2">
              <input type="number" placeholder="Valor da parte" value={part.amount} onChange={(e) => handlePartChange(index, 'amount', e.target.value)} className="p-2 border rounded" />
              <select value={part.payment_type} onChange={(e) => handlePartChange(index, 'payment_type', e.target.value)} className="p-2 border rounded">
                <option value="dinheiro">Dinheiro</option>
                <option value="cartao_credito">Cartão Crédito</option>
                <option value="pix">Pix</option>
              </select>
              <input type="number" placeholder="Parcelas (opcional)" value={part.parcelas} onChange={(e) => handlePartChange(index, 'parcelas', e.target.value)} className="p-2 border rounded" />
              <input type="number" placeholder="Desconto maquininha" value={part.desconto_maquininha} onChange={(e) => handlePartChange(index, 'desconto_maquininha', e.target.value)} className="p-2 border rounded" />
              <button type="button" onClick={() => handleRemovePart(index)} className="text-red-600">Remover</button>
            </div>
          ))}
          <button type="button" onClick={handleAddPart} className="bg-green-600 text-white px-4 py-1 rounded">
            Adicionar forma de pagamento
          </button>
        </div>

        <button onClick={handleSubmit} className="bg-[#34375a] text-white px-4 py-2 rounded mb-6">
          {form.id ? 'Atualizar' : 'Cadastrar'}
        </button>

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
                    <td className="py-2 px-4">{item.description}</td>
                    <td className="py-2 px-4">R$ {parseFloat(item.amount).toFixed(2)}</td>
                    <td className="py-2 px-4 flex gap-2">
                      <button onClick={() => handleEdit(item)} className="text-sm text-blue-600 underline">Editar</button>
                      <button onClick={() => handleDelete(item.id)} className="text-sm text-red-600 underline">Excluir</button>
                    </td>
                  </tr>
                  {item.IncomeParts?.map(part => (
                    <tr key={part.id} className="bg-gray-50 border-t text-sm">
                      <td className="py-1 px-4">{formatDate(part.date)}</td>
                      <td className="py-1 px-4">{part.label} - {part.payment_type}</td>
                      <td className="py-1 px-4">
                        R$ {parseFloat(part.amount).toFixed(2)}<br />
                        <span className="text-xs text-gray-600">Líquido: R$ {(parseFloat(part.amount) - (parseFloat(part.desconto_maquininha || 0))).toFixed(2)}</span>
                      </td>
                      <td className="py-1 px-4 italic text-gray-500">Parte</td>
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

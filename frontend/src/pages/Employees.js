import React, { useState, useEffect } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';

export default function Employees() {
  const [form, setForm] = useState({ name: '', role: '', salary: '', admission_date: '' });
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const loadEmployees = async () => {
    const res = await api.get('/employees');
    setEmployees(res.data);
  };

  useEffect(() => {
    loadEmployees();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await api.put(`/employees/${editingId}`, form);
      setEditingId(null);
    } else {
      await api.post('/employees', form);
    }
    setForm({ name: '', role: '', salary: '', admission_date: '' });
    loadEmployees();
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp.id);
  };

const handleDelete = async (id) => {
  if (window.confirm('Deseja excluir este funcionário?')) {
    await api.delete(`/employees/${id}`);
    loadEmployees();
  }
};

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white p-6 min-h-screen text-black">
        <h1 className="text-2xl font-bold text-[#34375a] mb-4">Funcionários</h1>

        <form onSubmit={handleSubmit} className="grid gap-4 mb-6">
          <input type="text" placeholder="Nome" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="p-2 border rounded" />
          <input type="text" placeholder="Cargo" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} className="p-2 border rounded" />
          <input type="number" placeholder="Salário" value={form.salary} onChange={(e) => setForm({ ...form, salary: e.target.value })} className="p-2 border rounded" />
          <input type="date" value={form.admission_date} onChange={(e) => setForm({ ...form, admission_date: e.target.value })} className="p-2 border rounded" />
          <button type="submit" className="bg-[#34375a] text-white p-2 rounded">
            {editingId ? 'Atualizar' : 'Cadastrar'}
          </button>
        </form>

        <table className="w-full text-left border">
          <thead>
            <tr className="bg-[#34375a] text-white">
              <th className="p-2">Nome</th>
              <th className="p-2">Cargo</th>
              <th className="p-2">Salário</th>
              <th className="p-2">Admissão</th>
              <th className="p-2">Ações</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b">
                <td className="p-2">{emp.name}</td>
                <td className="p-2">{emp.role}</td>
                <td className="p-2">R$ {parseFloat(emp.salary).toFixed(2)}</td>
                <td className="p-2">{emp.admission_date}</td>
                <td className="p-2">
                  <button onClick={() => handleEdit(emp)} className="text-blue-600 hover:underline mr-2">Editar</button>
                  <button onClick={() => handleDelete(emp.id)} className="text-red-600 hover:underline">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

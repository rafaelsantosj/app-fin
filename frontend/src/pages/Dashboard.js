import React, { useEffect, useState } from 'react';
import api from '../services/api';
import Sidebar from '../components/Sidebar';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from 'recharts';

export default function Dashboard() {
  const [incomes, setIncomes] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [employees, setEmployees] = useState(0);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [chartData, setChartData] = useState([]);
  const [incomeCategories, setIncomeCategories] = useState([]);
  const [expenseCategories, setExpenseCategories] = useState([]);

  useEffect(() => {
    loadSummary();
  }, [startDate, endDate]);

  const loadSummary = async () => {
    try {
      const [incomeRes, expenseRes, employeeRes] = await Promise.all([
        api.get('/incomes'),
        api.get('/expenses'),
        api.get('/employees')
      ]);

      const filterByDate = (list) => {
        return list.filter(item => {
          const d = new Date(item.date);
          return (!startDate || new Date(startDate) <= d) && (!endDate || d <= new Date(endDate));
        });
      };

      const filteredIncomes = filterByDate(incomeRes.data);
      const filteredExpenses = filterByDate(expenseRes.data);

      const incomeTotal = filteredIncomes.reduce((sum, item) => sum + parseFloat(item.amount), 0);
      const expenseTotal = filteredExpenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

      const combinedData = [
        { name: 'Entradas', total: incomeTotal },
        { name: 'Saídas', total: expenseTotal }
      ];

      const incomeCategoryMap = {};
      filteredIncomes.forEach(item => {
        const key = item.category || 'Outros';
        if (!incomeCategoryMap[key]) incomeCategoryMap[key] = 0;
        incomeCategoryMap[key] += parseFloat(item.amount);
      });

      const incomePieData = Object.entries(incomeCategoryMap).map(([name, value]) => ({ name, value }));

      const expenseCategoryMap = {};
      filteredExpenses.forEach(item => {
        const key = item.category || 'Outros';
        if (!expenseCategoryMap[key]) expenseCategoryMap[key] = 0;
        expenseCategoryMap[key] += parseFloat(item.amount);
      });

      const expensePieData = Object.entries(expenseCategoryMap).map(([name, value]) => ({ name, value }));

      setIncomes(incomeTotal);
      setExpenses(expenseTotal);
      setEmployees(employeeRes.data.length);
      setChartData(combinedData);
      setIncomeCategories(incomePieData);
      setExpenseCategories(expensePieData);
    } catch (err) {
      console.error('Erro ao carregar dados do dashboard:', err);
    }
  };

  const COLORS = ['#34375a', '#007bff', '#00c49f', '#ffbb28', '#ff8042'];

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-white p-6 min-h-screen">
        <h1 className="text-2xl font-bold text-[#34375a] mb-6">Resumo Financeiro</h1>

        <div className="flex gap-4 mb-6">
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className="border p-2 rounded" />
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className="border p-2 rounded" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white shadow rounded-xl p-4 border">
            <p className="text-gray-600">Entradas</p>
            <p className="text-green-600 text-xl font-bold">R$ {incomes.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4 border">
            <p className="text-gray-600">Saídas</p>
            <p className="text-red-600 text-xl font-bold">R$ {expenses.toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4 border">
            <p className="text-gray-600">Saldo</p>
            <p className="text-blue-600 text-xl font-bold">R$ {(incomes - expenses).toFixed(2)}</p>
          </div>
          <div className="bg-white shadow rounded-xl p-4 border">
            <p className="text-gray-600">Funcionários</p>
            <p className="text-black text-xl font-bold">{employees}</p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-[#34375a] mb-2">Entradas vs Saídas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => `R$ ${parseFloat(value).toFixed(2)}`} />
            <Legend />
            <Bar dataKey="total" fill="#34375a" />
          </BarChart>
        </ResponsiveContainer>

        <h2 className="text-xl font-bold text-[#34375a] mt-10 mb-2">Categorias de Saídas</h2>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie data={expenseCategories} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100} label>
              {expenseCategories.map((entry, index) => (
                <Cell key={`cell-exp-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => `R$ ${parseFloat(value).toFixed(2)}`} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </main>
    </div>
  );
}

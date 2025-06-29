const express = require('express');
const router = express.Router();
const Expense = require('../models/Expense');

router.get('/', async (req, res) => {
  try {
    const expenses = await Expense.findAll({ where: { user_id: req.user.id } });
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar despesas', error: err });
  }
});

router.post('/', async (req, res) => {
  const { description, amount, category, date, employee_id } = req.body;
  try {
    const expense = await Expense.create({
      description,
      amount,
      category,
      date,
      employee_id,
      user_id: req.user.id
    });
    res.status(201).json(expense);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar despesa', error: err });
  }
});

module.exports = router;

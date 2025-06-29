const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const Expense = require('../models/Expense');

router.get('/', async (req, res) => {
  try {
    const incomes = await Income.sum('amount', { where: { user_id: req.user.id } });
    const expenses = await Expense.sum('amount', { where: { user_id: req.user.id } });

    res.json({
      income: incomes || 0,
      expense: expenses || 0
    });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar resumo financeiro', error: err });
  }
});

module.exports = router;

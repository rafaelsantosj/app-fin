const express = require('express');
const router = express.Router();
const Income = require('../models/Income');
const IncomePart = require('../models/IncomePart');
const { Op } = require('sequelize');

// GET - todas as parcelas (parts) relacionadas ao usuário
router.get('/', async (req, res) => {
  try {
    const incomes = await Income.findAll({ where: { user_id: req.user.id } });
    const incomeIds = incomes.map(i => i.id);
    const parts = await IncomePart.findAll({
      where: { income_id: { [Op.in]: incomeIds } },
      include: [{ model: Income }],
      order: [['date', 'ASC']]
    });
    res.json(parts);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar entradas', error: err });
  }
});

// POST - criar entrada e gerar parcelas
router.post('/', async (req, res) => {
  const { description, amount, date, payment_type, installments, sinal, fim, user_id } = {
    ...req.body,
    user_id: req.user.id
  };

  try {
    const income = await Income.create({
      description,
      amount,
      date,
      payment_type,
      installments,
      user_id
    });

    const parts = [];

    if (payment_type === 'avista') {
      parts.push({
        income_id: income.id,
        amount,
        date,
        label: 'À vista'
      });
    }

    else if (payment_type === 'parcelado') {
      const valorParcela = parseFloat(amount) / parseInt(installments);
      const baseDate = new Date(date);
      for (let i = 0; i < installments; i++) {
        const parcelaDate = new Date(baseDate);
        parcelaDate.setDate(baseDate.getDate() + i * 30);
        parts.push({
          income_id: income.id,
          amount: valorParcela.toFixed(2),
          date: parcelaDate,
          label: `Parcela ${i + 1}`
        });
      }
    }

    else if (payment_type === 'sinal_e_fim') {
      parts.push({
        income_id: income.id,
        amount: sinal.amount,
        date: sinal.date,
        label: 'Sinal'
      });
      parts.push({
        income_id: income.id,
        amount: fim.amount,
        date: fim.date,
        label: 'Fim'
      });
    }

    await IncomePart.bulkCreate(parts);
    res.status(201).json({ message: 'Entrada registrada com sucesso', income });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao salvar entrada', error: err });
  }
});

module.exports = router;

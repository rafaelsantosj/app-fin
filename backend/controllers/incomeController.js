const Income = require('../models/Income');
const IncomePart = require('../models/IncomePart');

exports.index = async (req, res) => {
  try {
    const list = await Income.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']],
      include: [{ model: IncomePart }],
    });
    res.json(list);
  } catch (error) {
    console.error('Erro ao listar incomes:', error);
    res.status(500).json({ message: 'Erro ao buscar entradas', error });
  }
};

exports.create = async (req, res) => {
  try {
    const {
      description,
      amount,
      date,
      payment_type,
      installments,
      signal_date,
      end_date
    } = req.body;

    const newIncome = await Income.create({
      description,
      amount,
      date,
      payment_type,
      installments: payment_type === 'parcelado' ? installments : null,
      signal_date: payment_type === 'sinal_e_fim' ? signal_date : null,
      end_date: payment_type === 'sinal_e_fim' ? end_date : null,
      user_id: req.user.id
    });

    if (payment_type === 'parcelado' && installments > 1) {
      const parts = [];
      const parcelaValue = amount / installments;
      for (let i = 0; i < installments; i++) {
        const partDate = new Date(date);
        partDate.setMonth(partDate.getMonth() + i);
        parts.push({
          income_id: newIncome.id,
          amount: parcelaValue,
          date: partDate.toISOString().split('T')[0],
          label: `${i + 1}ª parcela`
        });
      }
      await IncomePart.bulkCreate(parts);
    }

    if (payment_type === 'sinal_e_fim') {
      const parts = [
        {
          income_id: newIncome.id,
          amount: amount / 2,
          date: signal_date,
          label: 'Sinal'
        },
        {
          income_id: newIncome.id,
          amount: amount / 2,
          date: end_date,
          label: 'Fim'
        }
      ];
      await IncomePart.bulkCreate(parts);
    }

    res.status(201).json(newIncome);
  } catch (error) {
    console.error('Erro ao criar income:', error);
    res.status(500).json({ message: 'Erro ao criar entrada', error });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await Income.findOne({ where: { id, user_id: req.user.id } });

    if (!existing) {
      return res.status(404).json({ message: 'Entrada não encontrada' });
    }

    await Income.update(req.body, { where: { id } });

    res.json({ message: 'Atualizado com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar income:', error);
    res.status(500).json({ message: 'Erro ao atualizar entrada', error });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    await IncomePart.destroy({ where: { income_id: id } });
    await Income.destroy({ where: { id, user_id: req.user.id } });
    res.json({ message: 'Removido com sucesso' });
  } catch (error) {
    console.error('Erro ao remover income:', error);
    res.status(500).json({ message: 'Erro ao remover entrada', error });
  }
};

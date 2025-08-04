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
      date,
      parts // [{ amount, payment_type, parcelas, desconto_maquininha, date, label }]
    } = req.body;

    if (!Array.isArray(parts) || parts.length === 0) {
      return res.status(400).json({ message: 'É necessário informar ao menos uma forma de pagamento.' });
    }

    const totalAmount = parts.reduce((acc, part) => acc + Number(part.amount), 0);

    const newIncome = await Income.create({
      description,
      amount: totalAmount,
      date,
      user_id: req.user.id
    });

    const partsToInsert = parts.map((part) => ({
      income_id: newIncome.id,
      amount: part.amount,
      date: part.date || date,
      label: part.label || null,
      payment_type: part.payment_type,
      parcelas: part.parcelas || null,
      desconto_maquininha: part.desconto_maquininha || null
    }));

    await IncomePart.bulkCreate(partsToInsert);

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

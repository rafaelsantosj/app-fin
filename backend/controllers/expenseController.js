const Expense = require('../models/Expense');

exports.index = async (req, res) => {
  try {
    const data = await Expense.findAll({ order: [['date', 'DESC']] });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao listar despesas', error });
  }
};

exports.create = async (req, res) => {
  try {
    const item = await Expense.create(req.body);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar despesa', error });
  }
};

exports.update = async (req, res) => {
  try {
    const item = await Expense.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Despesa não encontrada' });

    await item.update(req.body);
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar despesa', error });
  }
};

exports.remove = async (req, res) => {
  try {
    const item = await Expense.findByPk(req.params.id);
    if (!item) return res.status(404).json({ message: 'Despesa não encontrada' });

    await item.destroy();
    res.json({ message: 'Despesa removida' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao excluir despesa', error });
  }
};

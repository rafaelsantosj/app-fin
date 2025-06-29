const express = require('express');
const router = express.Router();
const Employee = require('../models/Employee');

// GET - listar
router.get('/', async (req, res) => {
  try {
    const employees = await Employee.findAll();
    res.json(employees);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao buscar funcionários', error: err });
  }
});

// POST - cadastrar
router.post('/', async (req, res) => {
  const { name, role, salary, admission_date } = req.body;
  try {
    const employee = await Employee.create({ name, role, salary, admission_date });
    res.status(201).json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao criar funcionário', error: err });
  }
});

// PUT - editar
router.put('/:id', async (req, res) => {
  const { name, role, salary, admission_date } = req.body;
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Funcionário não encontrado' });

    await employee.update({ name, role, salary, admission_date });
    res.json(employee);
  } catch (err) {
    res.status(500).json({ message: 'Erro ao atualizar funcionário', error: err });
  }
});

// DELETE - remover
router.delete('/:id', async (req, res) => {
  try {
    const employee = await Employee.findByPk(req.params.id);
    if (!employee) return res.status(404).json({ message: 'Funcionário não encontrado' });

    await employee.destroy();
    res.json({ message: 'Funcionário excluído com sucesso' });
  } catch (err) {
    res.status(500).json({ message: 'Erro ao excluir funcionário', error: err });
  }
});

module.exports = router;

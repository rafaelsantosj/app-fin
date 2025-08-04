const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IncomePart = sequelize.define('income_parts', {
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  payment_type: {
    type: DataTypes.STRING,
    allowNull: false // Ex: 'dinheiro', 'cartao_credito', 'pix'
  },
  parcelas: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  desconto_maquininha: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true
  },
  income_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'incomes',
      key: 'id'
    },
    onDelete: 'CASCADE'
  }
});

module.exports = IncomePart;

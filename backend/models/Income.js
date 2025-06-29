const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Income = sequelize.define('Income', {
  description: DataTypes.STRING,
  amount: DataTypes.FLOAT,
  date: DataTypes.DATEONLY,
  payment_type: DataTypes.STRING,
  installments: DataTypes.INTEGER,
  signal_date: DataTypes.DATEONLY,
  end_date: DataTypes.DATEONLY,
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'incomes',
  underscored: true,
});

module.exports = Income;

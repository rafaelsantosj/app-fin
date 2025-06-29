const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const IncomePart = sequelize.define('IncomePart', {
  amount: DataTypes.DECIMAL(10, 2),
  date: DataTypes.DATE,
  label: DataTypes.STRING,
  income_id: DataTypes.INTEGER
}, {
  tableName: 'income_parts',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = IncomePart;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  name: { type: DataTypes.STRING, allowNull: false },
  role: DataTypes.STRING,
  salary: DataTypes.DECIMAL(10, 2),
  admission_date: DataTypes.DATE
}, {
  tableName: 'employees',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = Employee;

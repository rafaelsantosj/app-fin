const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const Income = require('./models/Income');
const IncomePart = require('./models/IncomePart');
const PORT = process.env.PORT || 8080;

console.log('Inicializando aplicação...');
console.log('PORT:', PORT);

Income.hasMany(IncomePart, { foreignKey: 'income_id' });
IncomePart.belongsTo(Income, { foreignKey: 'income_id' });

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Models
require('./models/User');
require('./models/Employee');
require('./models/Expense');

// Rotas
const authRoutes = require('./routes/auth');
const incomesRoutes = require('./routes/incomes.js');
const expensesRoutes = require('./routes/expenses');
const employeeRoutes = require('./routes/employee');
const dashboardRoutes = require('./routes/dashboard');
const authMiddleware = require('./middlewares/authMiddleware');

app.use('/api/auth', authRoutes);
app.use('/api/incomes', authMiddleware, incomesRoutes);
app.use('/api/expenses', authMiddleware, expensesRoutes);
app.use('/api/employees', authMiddleware, employeeRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.get('/', (req, res) => res.send('API Online 🚀'));

sequelize.sync()
  .then(() => {
    console.log('Banco sincronizado com Sequelize!');
    app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
  })
  .catch(err => {
    console.error('Erro ao sincronizar banco:', err.message);
    app.listen(PORT, () => console.log(`App iniciado mesmo com erro de banco, porta ${PORT}`));
  });

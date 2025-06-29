const express = require('express');
const cors = require('cors');
require('dotenv').config();
const sequelize = require('./config/database');
const Income = require('./models/Income');
const IncomePart = require('./models/IncomePart');

Income.hasMany(IncomePart, { foreignKey: 'income_id' });
IncomePart.belongsTo(Income, { foreignKey: 'income_id' });

// Inicializa app primeiro!
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

// Rotas públicas
app.use('/api/auth', authRoutes);

// Rotas protegidas
app.use('/api/incomes', authMiddleware, incomesRoutes);
app.use('/api/expenses', authMiddleware, expensesRoutes);
app.use('/api/employees', authMiddleware, employeeRoutes);
app.use('/api/dashboard', authMiddleware, dashboardRoutes);

app.get('/', (req, res) => res.send('API Online 🚀'));

// Sincroniza com banco e inicia servidor
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Banco sincronizado com Sequelize!');
    app.listen(3001, () => console.log('Servidor rodando em http://localhost:3001'));
  })
  .catch(err => console.error('Erro ao conectar no banco:', err));

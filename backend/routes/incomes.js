const express = require('express');
const router = express.Router();
const incomeController = require('../controllers/incomeController');

router.get('/', incomeController.index);
router.post('/', incomeController.create);
router.put('/:id', incomeController.update);
router.delete('/:id', incomeController.remove);

module.exports = router;
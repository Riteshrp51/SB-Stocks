const express = require('express');
const { getPortfolio, getTransactions } = require('../controllers/portfolio');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getPortfolio);
router.get('/transactions', protect, getTransactions);

module.exports = router;

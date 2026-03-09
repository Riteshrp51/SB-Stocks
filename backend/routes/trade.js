const express = require('express');
const { buyStock, sellStock } = require('../controllers/trade');
const { protect } = require('../middleware/auth');
const { validateTrade } = require('../middleware/validation');

const router = express.Router();

router.post('/buy', protect, validateTrade, buyStock);
router.post('/sell', protect, validateTrade, sellStock);

module.exports = router;

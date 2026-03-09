const express = require('express');
const { getStock, searchStocks } = require('../controllers/stocks');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/:symbol', protect, getStock);
router.get('/search/:query', protect, searchStocks);

module.exports = router;

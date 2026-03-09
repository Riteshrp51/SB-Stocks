const express = require('express');
const { getWatchlist, addToWatchlist, removeFromWatchlist } = require('../controllers/watchlist');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getWatchlist);
router.post('/add', protect, addToWatchlist);
router.delete('/remove/:symbol', protect, removeFromWatchlist);

module.exports = router;

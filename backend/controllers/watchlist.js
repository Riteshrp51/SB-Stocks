const Watchlist = require('../models/Watchlist');

// @desc    Get user watchlist
// @route   GET /api/watchlist
// @access  Private
exports.getWatchlist = async (req, res) => {
  try {
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user.id, stockSymbols: [] });
    }
    res.json({
      success: true,
      data: watchlist.stockSymbols,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add stock to watchlist
// @route   POST /api/watchlist/add
// @access  Private
exports.addToWatchlist = async (req, res) => {
  try {
    const { symbol } = req.body;
    let watchlist = await Watchlist.findOne({ user: req.user.id });
    if (!watchlist) {
      watchlist = await Watchlist.create({ user: req.user.id, stockSymbols: [symbol.toUpperCase()] });
    } else {
      if (!watchlist.stockSymbols.includes(symbol.toUpperCase())) {
        watchlist.stockSymbols.push(symbol.toUpperCase());
        await watchlist.save();
      }
    }
    res.json({
      success: true,
      data: watchlist.stockSymbols,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Remove stock from watchlist
// @route   DELETE /api/watchlist/remove/:symbol
// @access  Private
exports.removeFromWatchlist = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();
    const watchlist = await Watchlist.findOne({ user: req.user.id });
    if (watchlist) {
      watchlist.stockSymbols = watchlist.stockSymbols.filter(s => s !== symbol);
      await watchlist.save();
    }
    res.json({
      success: true,
      data: watchlist ? watchlist.stockSymbols : [],
    });
  } catch (error) {
    console.error('WATCHLIST_REMOVE_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

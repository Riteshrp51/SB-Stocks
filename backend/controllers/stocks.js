const Stock = require('../models/Stock');
const stockService = require('../services/stockService');

// @desc    Get stock price and data
// @route   GET /api/stocks/:symbol
// @access  Private
exports.getStock = async (req, res) => {
  try {
    const symbol = req.params.symbol.toUpperCase();

    // GET LIVE DATA
    const quoteData = await stockService.getLiveQuote(symbol);
    const profileData = await stockService.getLiveProfile(symbol);
    const candlesData = await stockService.getLiveCandles(symbol);

    const stockData = {
      symbol,
      companyName: profileData.name,
      currentPrice: quoteData.c,
      high: quoteData.h,
      low: quoteData.l,
      open: quoteData.o,
      previousClose: quoteData.pc,
      change: quoteData.d,
      percentChange: quoteData.dp,
      history: candlesData.c,
      timestamps: candlesData.t,
    };

    // Update or create stock in our DB
    await Stock.findOneAndUpdate(
      { symbol },
      {
        symbol,
        companyName: stockData.companyName,
        currentPrice: stockData.currentPrice,
        marketData: stockData,
        lastUpdated: Date.now(),
      },
      { upsert: true, returnDocument: 'after' }
    );


    res.json({
      success: true,
      data: stockData,
    });
  } catch (error) {
    console.error('STOCKS_FETCH_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Search stocks
// @route   GET /api/stocks/search/:query
// @access  Private
exports.searchStocks = async (req, res) => {
  try {
    const query = req.params.query;
    const results = await stockService.searchLiveStocks(query);

    res.json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error('STOCKS_SEARCH_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

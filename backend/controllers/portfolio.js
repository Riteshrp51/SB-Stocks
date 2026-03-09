const Portfolio = require('../models/Portfolio');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const stockService = require('../services/stockService');

// @desc    Get user portfolio
// @route   GET /api/portfolio
// @access  Private
exports.getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.find({ user: req.user.id });
    const user = await User.findById(req.user.id);

    // Get current prices for all symbols in portfolio
    const portfolioWithPrices = await Promise.all(
      portfolio.map(async (item) => {
        try {
          const quote = await stockService.getLiveQuote(item.stockSymbol);
          const currentPrice = quote.c;
          const totalValue = currentPrice * item.quantity;
          const profitLoss = (currentPrice - item.averagePrice) * item.quantity;
          const profitLossPercentage = ((currentPrice - item.averagePrice) / item.averagePrice) * 100;

          return {
            ...item._doc,
            currentPrice,
            totalValue,
            profitLoss,
            profitLossPercentage,
          };
        } catch (err) {
          console.error(`PORTFOLIO_ITEM_PRICE_ERROR (${item.stockSymbol}):`, err);
          return {
            ...item._doc,
            currentPrice: item.averagePrice,
            totalValue: item.averagePrice * item.quantity,
            profitLoss: 0,
            profitLossPercentage: 0,
          };
        }
      })
    );

    const totalPortfolioValue = portfolioWithPrices.reduce(
      (acc, item) => acc + item.totalValue,
      0
    );

    res.json({
      success: true,
      data: {
        holdings: portfolioWithPrices,
        balance: user.balance,
        totalPortfolioValue,
        netWorth: user.balance + totalPortfolioValue,
      },
    });
  } catch (error) {
    console.error('PORTFOLIO_FETCH_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get trade history
// @route   GET /api/portfolio/transactions
// @access  Private
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('TRANSACTIONS_FETCH_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Portfolio = require('../models/Portfolio');
const mongoose = require('mongoose');
const stockService = require('../services/stockService');

// @desc    Buy stock
// @route   POST /api/trade/buy
// @access  Private
exports.buyStock = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { symbol, quantity } = req.body;
    const userId = req.user.id;

    console.log(`BUY_REQUEST: User ${userId} buying ${quantity} of ${symbol}`);

    if (!symbol) {
      throw new Error('Symbol is required');
    }

    // Get current price from stock service
    const quote = await stockService.getLiveQuote(symbol);
    const currentPrice = quote.c;

    if (!currentPrice || currentPrice === 0) {
      throw new Error(`Price unavailable for symbol: ${symbol}`);
    }

    const totalCost = currentPrice * quantity;

    // Check user balance
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }

    if (user.balance < totalCost) {
      throw new Error(`Insufficient balance. Required: ${totalCost}, Available: ${user.balance}`);
    }

    // Update user balance
    user.balance -= totalCost;
    await user.save({ session });

    // Create transaction
    await Transaction.create([{
      user: userId,
      stockSymbol: symbol.toUpperCase(),
      type: 'buy',
      quantity,
      price: currentPrice,
      totalAmount: totalCost,
    }], { session });

    // Update or create portfolio entry
    let portfolioEntry = await Portfolio.findOne({ user: userId, stockSymbol: symbol.toUpperCase() }).session(session);

    if (portfolioEntry) {
      const newTotalQuantity = portfolioEntry.quantity + quantity;
      const newAveragePrice = (portfolioEntry.averagePrice * portfolioEntry.quantity + totalCost) / newTotalQuantity;

      portfolioEntry.quantity = newTotalQuantity;
      portfolioEntry.averagePrice = newAveragePrice;
      portfolioEntry.updatedAt = Date.now();
      await portfolioEntry.save({ session });
    } else {
      await Portfolio.create([{
        user: userId,
        stockSymbol: symbol.toUpperCase(),
        quantity,
        averagePrice: currentPrice,
      }], { session });
    }

    await session.commitTransaction();
    res.json({
      success: true,
      message: 'Stock bought successfully',
      balance: user.balance,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error('BUY_STOCK_ERROR:', error.message);
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

// @desc    Sell stock
// @route   POST /api/trade/sell
// @access  Private
exports.sellStock = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const { symbol, quantity } = req.body;
    const userId = req.user.id;

    console.log(`SELL_REQUEST: User ${userId} selling ${quantity} of ${symbol}`);

    if (!symbol) {
      throw new Error('Symbol is required');
    }

    // Check if user owns enough stock
    const portfolioEntry = await Portfolio.findOne({ user: userId, stockSymbol: symbol.toUpperCase() }).session(session);
    if (!portfolioEntry || portfolioEntry.quantity < quantity) {
      throw new Error('Not enough shares to sell');
    }

    // Get current price from stock service
    const quote = await stockService.getLiveQuote(symbol);
    const currentPrice = quote.c;

    if (!currentPrice || currentPrice === 0) {
      throw new Error(`Price unavailable for symbol: ${symbol}`);
    }

    const totalProceeds = currentPrice * quantity;

    // Update user balance
    const user = await User.findById(userId).session(session);
    if (!user) {
      throw new Error('User not found');
    }
    
    user.balance += totalProceeds;
    await user.save({ session });

    // Create transaction
    await Transaction.create([{
      user: userId,
      stockSymbol: symbol.toUpperCase(),
      type: 'sell',
      quantity,
      price: currentPrice,
      totalAmount: totalProceeds,
    }], { session });

    // Update portfolio
    portfolioEntry.quantity -= quantity;
    if (portfolioEntry.quantity === 0) {
      await portfolioEntry.deleteOne({ session });
    } else {
      portfolioEntry.updatedAt = Date.now();
      await portfolioEntry.save({ session });
    }

    await session.commitTransaction();
    res.json({
      success: true,
      message: 'Stock sold successfully',
      balance: user.balance,
    });
  } catch (error) {
    if (session.inTransaction()) {
      await session.abortTransaction();
    }
    console.error('SELL_STOCK_ERROR:', error.message);
    res.status(400).json({ success: false, message: error.message });
  } finally {
    session.endSession();
  }
};

const User = require('../models/User');
const Transaction = require('../models/Transaction');
const Stock = require('../models/Stock');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: users,
    });
  } catch (error) {
    console.error('ADMIN_GET_USERS_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/user/:id
// @access  Private/Admin
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Prevent deleting self
    if (user._id.toString() === req.user.id) {
      return res.status(400).json({ success: false, message: 'Admin cannot decommission own node' });
    }

    await user.deleteOne();
    res.json({
      success: true,
      message: 'Operator node decommissioned successfully',
    });
  } catch (error) {
    console.error('ADMIN_DELETE_USER_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};


// @desc    Get all transactions
// @route   GET /api/admin/transactions
// @access  Private/Admin
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('user', 'name email').sort({ date: -1 });
    res.json({
      success: true,
      data: transactions,
    });
  } catch (error) {
    console.error('ADMIN_GET_TRANSACTIONS_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Add or update stock data
// @route   POST /api/admin/stock
// @access  Private/Admin
exports.upsertStock = async (req, res) => {
  try {
    const { symbol, companyName, currentPrice } = req.body;
    const stock = await Stock.findOneAndUpdate(
      { symbol: symbol.toUpperCase() },
      { symbol: symbol.toUpperCase(), companyName, currentPrice, lastUpdated: Date.now() },
      { upsert: true, returnDocument: 'after' }
    );
    res.json({
      success: true,
      data: stock,
    });
  } catch (error) {
    console.error('ADMIN_UPSERT_STOCK_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Get all managed stocks
// @route   GET /api/admin/stocks
// @access  Private/Admin
exports.getAllStocks = async (req, res) => {
  try {
    const stocks = await Stock.find().sort({ symbol: 1 });
    res.json({
      success: true,
      data: stocks,
    });
  } catch (error) {
    console.error('ADMIN_GET_STOCKS_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete a stock
// @route   DELETE /api/admin/stock/:symbol
// @access  Private/Admin
exports.deleteStock = async (req, res) => {
  try {
    const { symbol } = req.params;
    await Stock.findOneAndDelete({ symbol: symbol.toUpperCase() });
    res.json({
      success: true,
      message: 'Stock deleted successfully',
    });
  } catch (error) {
    console.error('ADMIN_DELETE_STOCK_ERROR:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};


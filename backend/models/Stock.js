const mongoose = require('mongoose');

const stockSchema = new mongoose.Schema({
  symbol: {
    type: String,
    required: [true, 'Please add a stock symbol'],
    unique: true,
    uppercase: true,
  },
  companyName: {
    type: String,
    required: [true, 'Please add a company name'],
  },
  currentPrice: {
    type: Number,
    required: true,
  },
  marketData: {
    type: Object,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Stock', stockSchema);

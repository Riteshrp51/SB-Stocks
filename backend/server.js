const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');

// Route files
const auth = require('./routes/auth');
const stocks = require('./routes/stocks');
const trade = require('./routes/trade');
const portfolio = require('./routes/portfolio');
const watchlist = require('./routes/watchlist');
const admin = require('./routes/admin');

const http = require('http');
const { initSocket } = require('./services/socketService');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();
const server = http.createServer(app);

// Initialize Socket.io
initSocket(server);

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Mount routers
app.use('/api/auth', auth);
app.use('/api/stocks', stocks);
app.use('/api/trade', trade);
app.use('/api/portfolio', portfolio);
app.use('/api/watchlist', watchlist);
app.use('/api/admin', admin);

// Basic Route
app.get('/', (req, res) => {
  res.send('SB Stocks API is running...');
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

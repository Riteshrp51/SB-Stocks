/**
 * Mock Data Service
 * Generates realistic stock data without requiring external API keys.
 */

const COMPANY_NAMES = {
    'AAPL': 'Apple Inc.',
    'MSFT': 'Microsoft Corporation',
    'GOOGL': 'Alphabet Inc.',
    'AMZN': 'Amazon.com Inc.',
    'TSLA': 'Tesla, Inc.',
    'META': 'Meta Platforms, Inc.',
    'NVDA': 'NVIDIA Corporation',
    'NFLX': 'Netflix, Inc.',
    'AMD': 'Advanced Micro Devices, Inc.',
    'PYPL': 'PayPal Holdings, Inc.',
    'INTC': 'Intel Corporation',
    'ORCL': 'Oracle Corporation',
    'CRM': 'Salesforce, Inc.',
    'ADBE': 'Adobe Inc.',
    'CSCO': 'Cisco Systems, Inc.',
    'BABA': 'Alibaba Group Holding Limited',
    'V': 'Visa Inc.',
    'MA': 'Mastercard Incorporated',
    'JPM': 'JPMorgan Chase & Co.',
    'DIS': 'The Walt Disney Company',
    'WMT': 'Walmart Inc.',
    'KO': 'The Coca-Cola Company',
    'PEP': 'PepsiCo, Inc.',
    'PFE': 'Pfizer Inc.',
    'JNJ': 'Johnson & Johnson',
    'XOM': 'Exxon Mobil Corporation',
    'BAC': 'Bank of America Corporation',
    'T': 'AT&T Inc.',
    'VZ': 'Verizon Communications Inc.',
    'NKE': 'NIKE, Inc.',
};

// Base prices for common stocks to keep it realistic
const BASE_PRICES = {
    'AAPL': 185.20,
    'MSFT': 415.50,
    'GOOGL': 150.30,
    'AMZN': 175.40,
    'TSLA': 170.10,
    'META': 505.20,
    'NVDA': 920.40,
    'NFLX': 610.15,
    'AMD': 180.50,
    'PYPL': 65.20,
    'INTC': 42.10,
    'ORCL': 125.40,
    'CRM': 305.10,
    'ADBE': 550.20,
    'CSCO': 48.50,
    'BABA': 75.30,
    'V': 280.10,
    'MA': 475.40,
    'JPM': 190.20,
    'DIS': 115.50,
    'WMT': 60.10,
    'KO': 60.50,
    'PEP': 170.20,
    'PFE': 28.40,
    'JNJ': 155.30,
    'XOM': 115.10,
    'BAC': 35.20,
    'T': 17.10,
    'VZ': 40.20,
    'NKE': 95.40,
};

/**
 * Generates a mock quote for a symbol
 */
exports.getMockQuote = (symbol) => {
    const basePrice = BASE_PRICES[symbol.toUpperCase()] || 100.00;

    // Simulate volatility (-2% to +2%)
    const volatility = (Math.random() * 0.04) - 0.02;
    const currentPrice = basePrice * (1 + volatility);
    const prevClose = basePrice;
    const change = currentPrice - prevClose;
    const percentChange = (change / prevClose) * 100;

    return {
        c: parseFloat(currentPrice.toFixed(2)),
        h: parseFloat((currentPrice * 1.01).toFixed(2)),
        l: parseFloat((currentPrice * 0.99).toFixed(2)),
        o: parseFloat(basePrice.toFixed(2)),
        pc: parseFloat(prevClose.toFixed(2)),
        d: parseFloat(change.toFixed(2)),
        dp: parseFloat(percentChange.toFixed(2))
    };
};

/**
 * Generates mock company profile
 */
exports.getMockProfile = (symbol) => {
    return {
        name: COMPANY_NAMES[symbol.toUpperCase()] || `${symbol.toUpperCase()} Corporation`,
        ticker: symbol.toUpperCase(),
        exchange: 'NASDAQ',
        currency: 'USD',
        industry: 'Technology',
    };
};

/**
 * Generates mock candle data (30 days)
 */
exports.getMockCandles = (symbol) => {
    const basePrice = BASE_PRICES[symbol.toUpperCase()] || 100.00;
    const count = 30;
    const prices = [];
    const timestamps = [];

    let current = basePrice * 0.9; // Start a bit lower
    const now = Math.floor(Date.now() / 1000);

    for (let i = 0; i < count; i++) {
        const volatility = (Math.random() * 0.06) - 0.03;
        current = current * (1 + volatility);
        prices.push(parseFloat(current.toFixed(2)));
        timestamps.push(now - (count - i) * 86400);
    }

    return {
        s: 'ok',
        c: prices,
        t: timestamps
    };
};

/**
 * Mock Search Results
 */
exports.mockSearch = (query) => {
    const symbols = Object.keys(COMPANY_NAMES);
    const filtered = symbols.filter(s =>
        s.includes(query.toUpperCase()) ||
        COMPANY_NAMES[s].toUpperCase().includes(query.toUpperCase())
    );

    return filtered.map(s => ({
        symbol: s,
        description: COMPANY_NAMES[s],
        type: 'Common Stock'
    }));
};

const mockData = require('./mockDataService');

/**
 * Fetches real-time stock quote
 */
exports.getLiveQuote = async (symbol) => {
    try {
        // Exclusively use mock data as requested
        return mockData.getMockQuote(symbol);
    } catch (error) {
        console.error(`Error in getLiveQuote for ${symbol}:`, error.message);
        throw error;
    }
};

/**
 * Fetches company profile/summary
 */
exports.getLiveProfile = async (symbol) => {
    try {
        return mockData.getMockProfile(symbol);
    } catch (error) {
        console.error(`Error in getLiveProfile for ${symbol}:`, error.message);
        throw error;
    }
};

/**
 * Fetches historical candle data
 */
exports.getLiveCandles = async (symbol) => {
    try {
        return mockData.getMockCandles(symbol);
    } catch (error) {
        console.error(`Error in getLiveCandles for ${symbol}:`, error.message);
        throw error;
    }
};

/**
 * Search for stocks
 */
exports.searchLiveStocks = async (query) => {
    try {
        return mockData.mockSearch(query);
    } catch (error) {
        console.error(`Error in searchLiveStocks for ${query}:`, error.message);
        throw error;
    }
};


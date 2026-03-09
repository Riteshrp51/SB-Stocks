const { Server } = require('socket.io');
const stockService = require('./stockService');

let io;
let clients = new Set();
let activeSymbols = new Set(['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX']);

/**
 * Initializes Socket.io
 */
exports.initSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on('connection', (socket) => {
        console.log('CLIENT_CONNECTED:', socket.id);
        clients.add(socket.id);

        // Initial burst of data
        emitStockUpdates();

        socket.on('subscribe', (symbol) => {
            if (symbol) {
                activeSymbols.add(symbol.toUpperCase());
                console.log(`SUBSCRIBED_TO: ${symbol}`);
            }
        });

        socket.on('disconnect', () => {
            console.log('CLIENT_DISCONNECTED:', socket.id);
            clients.delete(socket.id);
        });
    });

    // Start background updates every 10 seconds (market simulation feel)
    setInterval(emitStockUpdates, 10000);

    return io;
};

/**
 * Periodically emit updates for active symbols
 */
async function emitStockUpdates() {
    if (clients.size === 0) return;

    try {
        const updates = await Promise.all(
            Array.from(activeSymbols).map(async (symbol) => {
                const quote = await stockService.getLiveQuote(symbol);
                return {
                    symbol,
                    currentPrice: quote.c,
                    change: quote.d,
                    percentChange: quote.dp,
                    high: quote.h,
                    low: quote.l,
                    open: quote.o,
                    previousClose: quote.pc
                };
            })
        );

        io.emit('stock_update', updates);
    } catch (error) {
        console.error('SOCKET_UPDATE_ERROR:', error.message);
    }
}

exports.getIO = () => io;

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Search, TrendingUp, TrendingDown, Activity, Loader2, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [trendingStocks, setTrendingStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { stockUpdates } = useSocket();

  const popularSymbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'NFLX'];

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const stocks = await Promise.all(
          popularSymbols.map(async (symbol) => {
            const res = await API.get(`/stocks/${symbol}`);
            return res.data.data;
          })
        );
        setTrendingStocks(stocks);
      } catch (error) {
        console.error('Error fetching trending stocks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, []);

  // Sync trending stocks with socket updates
  useEffect(() => {
    setTrendingStocks(prev => prev.map(stock => {
      const update = stockUpdates[stock.symbol];
      if (update) {
        const isUp = update.currentPrice > stock.currentPrice;
        const isDown = update.currentPrice < stock.currentPrice;

        return {
          ...stock,
          currentPrice: update.currentPrice,
          change: update.change,
          percentChange: update.percentChange,
          flash: isUp ? 'up' : isDown ? 'down' : null
        };
      }
      return stock;
    }));

    // Clear flash after 1s
    const timer = setTimeout(() => {
      setTrendingStocks(prev => prev.map(s => ({ ...s, flash: null })));
    }, 1000);

    return () => clearTimeout(timer);
  }, [stockUpdates]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery) return;
    setSearching(true);
    try {
      const res = await API.get(`/stocks/search/${searchQuery}`);
      setSearchResults(res.data.data.filter(item => item.type === 'Common Stock').slice(0, 5));
    } catch (error) {
      toast.error('Search system failure');
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-16 pb-20 animate-fade-in bg-slate-50 min-h-screen">
      {/* Header & Search Section */}
      <div className="flex flex-col items-center space-y-10 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <h1 className="text-6xl font-black tracking-tighter text-slate-900">
            TRADING <span className="text-primary-600">DASHBOARD</span>
          </h1>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-xs">
            Real-Time Market Surveillance & Intelligence
          </p>
        </motion.div>

        <div className="relative w-full max-w-3xl px-4">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-primary-500/10 blur-2xl rounded-[32px] group-focus-within:bg-primary-500/20 transition-all" />
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary-400 transition-colors" size={24} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Inject Symbol or Entity Name..."
              className="w-full bg-white border border-slate-200 rounded-[32px] py-8 pl-18 pr-40 focus:outline-none focus:border-primary-500/50 text-xl font-bold text-slate-900 shadow-xl transition-all placeholder:text-slate-400"
            />
            <button
              type="submit"
              className="absolute right-4 top-1/2 -translate-y-1/2 btn-primary py-4 px-10 rounded-2xl"
            >
              {searching ? <Loader2 className="animate-spin" size={20} /> : 'EXECUTE'}
            </button>
          </form>

          {/* Search Results Dropdown */}
          <AnimatePresence>
            {searchResults.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute top-full left-0 right-0 mt-6 glass-card rounded-[32px] shadow-[0_30px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden border-primary-500/10"
              >
                {searchResults.map((stock) => (
                  <Link
                    key={stock.symbol}
                    to={`/stock/${stock.symbol}`}
                    className="flex items-center justify-between p-8 hover:bg-primary-500/5 transition-all border-b border-slate-800/50 last:border-0 group"
                  >
                    <div className="flex items-center space-x-6">
                      <div className="bg-slate-800/50 p-3 rounded-xl font-black text-primary-400 text-sm border border-slate-700/50 group-hover:scale-110 transition-transform">
                        {stock.symbol}
                      </div>
                      <div>
                        <div className="font-bold text-slate-100 group-hover:text-primary-400 transition-colors text-lg">{stock.description}</div>
                        <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest mt-1">Asset Class: Common Equity</div>
                      </div>
                    </div>
                    <ArrowRight size={20} className="text-slate-600 group-hover:text-white group-hover:translate-x-2 transition-all" />
                  </Link>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Market Overview */}
      <div className="max-w-7xl mx-auto px-4 space-y-10">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-black text-slate-900 flex items-center space-x-4 tracking-tighter">
            <div className="p-3 bg-primary-500/10 rounded-2xl border border-primary-500/20">
              <Activity className="text-primary-600" size={24} />
            </div>
            <span>TRENDING SECTOR</span>
          </h2>
          <div className="flex items-center space-x-3 text-[10px] font-black text-slate-400 uppercase tracking-[0.25em] bg-slate-900/40 backdrop-blur-md px-6 py-3 rounded-full border border-slate-800/50 animate-pulse-slow shadow-xl">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>Real-time Stream Active</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white border border-slate-200 rounded-[40px] p-10 h-52 animate-pulse shadow-sm" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trendingStocks.map((stock, index) => (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.5 }}
              >
                <Link
                  to={`/stock/${stock.symbol}`}
                  className={cn(
                    "glass-card rounded-[40px] p-10 block group relative overflow-hidden h-full transition-all duration-300",
                    stock.flash === 'up' && "bg-primary-500/20 border-primary-500/50 scale-[1.02]",
                    stock.flash === 'down' && "bg-red-500/20 border-red-500/50 scale-[1.02]"
                  )}
                >
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/5 blur-[80px] -z-10 group-hover:bg-primary-500/10 transition-all duration-700" />

                  <div className="flex justify-between items-start mb-8">
                    <div className="space-y-2">
                      <div className="bg-slate-100 px-3 py-1.5 rounded-xl font-black text-primary-600 text-[10px] inline-block border border-slate-200 tracking-widest">
                        {stock.symbol}
                      </div>
                      <div className="font-bold text-slate-800 truncate max-w-[160px] group-hover:text-primary-600 transition-colors text-lg">
                        {stock.companyName}
                      </div>
                    </div>
                    <div className={cn(
                      "flex items-center space-x-1 px-4 py-2 rounded-2xl text-[10px] font-black tracking-widest border",
                      stock.percentChange >= 0 ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                    )}>
                      {stock.percentChange >= 0 ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                      <span>{Math.abs(stock.percentChange).toFixed(2)}%</span>
                    </div>
                  </div>

                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1 ml-1 leading-none">Market Price</div>
                      <div className="text-4xl font-black text-slate-900 group-hover:scale-105 transition-transform origin-left tracking-tighter">
                        ${stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </div>
                    </div>
                    <div className={cn(
                      "text-sm font-black flex items-center space-x-1",
                      stock.change >= 0 ? 'text-primary-500' : 'text-red-500'
                    )}>
                      <span>{stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Dashboard;

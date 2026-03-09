import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion} from 'framer-motion';
import API from '../services/api';
import { useSocket } from '../context/SocketContext';
import {
  Star,
  TrendingUp,
  TrendingDown,
  Trash2,
  ArrowRight,
  Loader2,
  ExternalLink,
  Shield,
  Activity,
  Eye,
  ChevronRight
} from 'lucide-react';

const Watchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [stocksData, setStocksData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { stockUpdates, subscribeToSymbol } = useSocket();

  const fetchWatchlistData = useCallback(async () => {
    try {
      const res = await API.get('/watchlist');
      const symbols = res.data.data;
      setWatchlist(symbols);

      const data = await Promise.all(
        symbols.map(async (symbol) => {
          try {
            const stockRes = await API.get(`/stocks/${symbol}`);
            subscribeToSymbol(symbol); // Subscribe to updates
            return stockRes.data.data;
          } catch (err) {
            return { symbol, currentPrice: 0, change: 0, percentChange: 0, companyName: 'N/A' };
          }
        })
      );
      setStocksData(data);
    } catch (error) {
      console.error('Watchlist retrieval failed');
    } finally {
      setLoading(false);
    }
  }, [subscribeToSymbol]);

  useEffect(() => {
    fetchWatchlistData();
  }, [fetchWatchlistData]);

  // Sync with socket updates
  useEffect(() => {
    setStocksData(prev => prev.map(stock => {
      const update = stockUpdates[stock.symbol];
      if (update) {
        return {
          ...stock,
          currentPrice: update.currentPrice,
          change: update.change,
          percentChange: update.percentChange
        };
      }
      return stock;
    }));
  }, [stockUpdates]);

  const handleRemove = async (symbol) => {
    try {
      await API.delete(`/watchlist/remove/${symbol}`);
      toast.info(`${symbol} surveillance terminated`);
      fetchWatchlistData();
    } catch (error) {
      toast.error('Watchlist update failed');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full animate-pulse" />
          <Loader2 className="animate-spin text-primary-500 relative" size={64} strokeWidth={1} />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Surveillance Nodes...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-fade-in pt-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-10">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] flex items-center space-x-3">
            <Eye size={18} />
            <span>Active Asset Surveillance</span>
          </h3>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
            WATCH <span className="text-slate-800 text-outline">TERMINAL</span>
          </h1>
        </div>

        <div className="hidden sm:flex items-center space-x-3 bg-slate-900/40 border border-slate-800/50 px-8 py-4 rounded-[28px] backdrop-blur-xl shadow-2xl">
          <Shield size={18} className="text-primary-500" />
          <span className="text-slate-100 font-black text-xs uppercase tracking-widest">{watchlist.length} ACTIVE TARGETS</span>
        </div>
      </div>

      {stocksData.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-[48px] p-32 text-center space-y-10 relative overflow-hidden group border-primary-500/5"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[100px] -z-10" />
          <div className="bg-slate-950 w-24 h-24 rounded-[32px] flex items-center justify-center mx-auto text-slate-800 border border-slate-800 shadow-inner group-hover:scale-110 transition-transform">
            <Activity size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-3xl font-black text-white tracking-tight uppercase">Surveillance Matrix Empty</h2>
            <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] max-w-sm mx-auto leading-relaxed opacity-60">
              Initialize monitoring on global securities to receive priority market data and performance vectors.
            </p>
          </div>
          <Link to="/dashboard" className="btn-primary inline-flex items-center space-x-4 px-12 py-5 rounded-[24px]">
            <span className="font-black text-xs uppercase tracking-widest">Access Market</span>
            <ChevronRight size={18} />
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {stocksData.map((stock, index) => {
            const isPos = stock.change >= 0;
            return (
              <motion.div
                key={stock.symbol}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-[48px] p-10 group relative overflow-hidden border-primary-500/5 hover:border-primary-500/20 transition-all shadow-2xl"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -z-10 group-hover:bg-primary-500/10 transition-colors" />

                <div className="flex justify-between items-start mb-10">
                  <div className="flex items-center space-x-6">
                    <div className="bg-slate-950 p-5 rounded-[24px] border border-slate-800/50 font-black text-primary-500 text-sm group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-2xl">
                      {stock.symbol}
                    </div>
                    <div>
                      <div className="font-black text-white text-xl tracking-tight truncate max-w-[120px]">{stock.companyName}</div>
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-1">Live Feed</div>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(stock.symbol)}
                    className="text-slate-600 hover:text-red-500 hover:bg-red-500/10 transition-all p-4 rounded-2xl active:scale-90 border border-transparent hover:border-red-500/20 backdrop-blur-md"
                    title="Terminate Surveillance"
                  >
                    <Trash2 size={22} />
                  </button>
                </div>

                <div className="flex items-end justify-between">
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Procurement Value</div>
                    <div className="text-4xl font-black text-white tracking-tighter">${stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                  </div>
                  <div className={`flex flex-col items-end px-4 py-2 rounded-2xl border ${isPos ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                    <div className="flex items-center space-x-1 font-black text-sm tracking-widest">
                      {isPos ? <TrendingUp size={18} /> : <TrendingDown size={18} />}
                      <span>{Math.abs(stock.percentChange).toFixed(2)}%</span>
                    </div>
                    <div className="text-[10px] font-black opacity-50 mt-1">
                      {isPos ? '+' : ''}{stock.change.toFixed(2)}
                    </div>
                  </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-800/30 flex justify-between items-center">
                  <Link
                    to={`/stock/${stock.symbol}`}
                    className="text-primary-500 hover:text-primary-400 font-black text-[10px] uppercase tracking-[0.25em] flex items-center space-x-3 group/link"
                  >
                    <span>Inspect Terminal</span>
                    <ExternalLink size={14} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                  </Link>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 rounded-full bg-primary-500 animate-pulse shadow-[0_0_10px_rgba(14,165,233,0.5)]" />
                    <span className="text-[10px] text-slate-600 font-black uppercase tracking-widest">Link Active</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Watchlist;

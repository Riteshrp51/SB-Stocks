import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import {
  TrendingUp,
  TrendingDown,
  Plus,
  Minus,
  ShoppingCart,
  Tag,
  Star,
  ChevronLeft,
  Loader2,
  Briefcase,
  Activity,
  Zap,
  BarChart3,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { motion, AnimatePresence } from 'framer-motion';
import { useSocket } from '../context/SocketContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const StockDetails = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [trading, setTrading] = useState(false);
  const [isWatched, setIsWatched] = useState(false);
  const [portfolioEntry, setPortfolioEntry] = useState(null);
  const { stockUpdates, subscribeToSymbol } = useSocket();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [stockRes, watchlistRes, portfolioRes] = await Promise.all([
          API.get(`/stocks/${symbol}`),
          API.get('/watchlist'),
          API.get('/portfolio')
        ]);

        setStock(stockRes.data.data);
        setIsWatched(watchlistRes.data.data.includes(symbol.toUpperCase()));

        const entry = portfolioRes.data.data.holdings.find(h => h.stockSymbol === symbol.toUpperCase());
        setPortfolioEntry(entry);

        // Subscribe to socket updates
        subscribeToSymbol(symbol);
      } catch (error) {
        toast.error('Data retrieval failed');
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [symbol, navigate]);

  // Sync with socket updates
  useEffect(() => {
    const update = stockUpdates[symbol.toUpperCase()];
    if (update && stock) {
      const isUp = update.currentPrice > stock.currentPrice;
      const isDown = update.currentPrice < stock.currentPrice;

      setStock(prev => ({
        ...prev,
        currentPrice: update.currentPrice,
        change: update.change,
        percentChange: update.percentChange,
        high: update.high,
        low: update.low,
        open: update.open,
        previousClose: update.previousClose,
        flash: isUp ? 'up' : isDown ? 'down' : null
      }));

      const timer = setTimeout(() => {
        setStock(prev => ({ ...prev, flash: null }));
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [stockUpdates, symbol]);

  const handleTrade = async (type) => {
    if (quantity <= 0) return toast.error('Minimum order volume: 1 unit');

    setTrading(true);
    try {
      const res = await API.post(`/trade/${type}`, { symbol, quantity });
      toast.success(res.data.message);

      const userRes = await API.get('/auth/me');
      setUser(userRes.data.user);

      const portfolioRes = await API.get('/portfolio');
      const entry = portfolioRes.data.data.holdings.find(h => h.stockSymbol === symbol.toUpperCase());
      setPortfolioEntry(entry);
    } catch (error) {
      const errorMsg = error.response?.data?.message ||
        (error.response?.data?.errors && error.response.data.errors[0]?.msg) ||
        'Transaction command aborted';
      toast.error(errorMsg);
    } finally {
      setTrading(false);
    }
  };

  const toggleWatchlist = async () => {
    try {
      if (isWatched) {
        await API.delete(`/watchlist/remove/${symbol}`);
        setIsWatched(false);
        toast.info(`${symbol} surveillance deactivated`);
      } else {
        await API.post('/watchlist/add', { symbol });
        setIsWatched(true);
        toast.success(`${symbol} under active surveillance`);
      }
    } catch (error) {
      toast.error('Surveillance system error');
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-8 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/20 blur-[100px] rounded-full animate-pulse" />
          <Loader2 className="animate-spin text-primary-500 relative" size={80} strokeWidth={1} />
        </div>
        <div className="text-center space-y-3">
          <p className="text-slate-900 font-black text-3xl tracking-tighter">ACCESSING CORE DATA</p>
          <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Security {symbol} v4.0</p>
        </div>
      </div>
    );
  }

  const isPositive = stock.change >= 0;

  return (
    <div className="space-y-10 pb-20 animate-fade-in pt-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-3 text-slate-500 hover:text-slate-900 transition-all font-black uppercase tracking-[0.2em] text-[10px] group bg-white px-6 py-3 rounded-2xl border border-slate-200 shadow-sm"
        >
          <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Return to Terminal</span>
        </button>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
            <Clock size={14} className="text-primary-500" />
            <span>Market Status: Active</span>
          </div>
          <div className="flex items-center space-x-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] bg-white px-6 py-3 rounded-full border border-slate-200 shadow-sm">
            <Zap size={14} className="text-yellow-500 fill-yellow-500" />
            <span>Low Latency Node 82</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Main Sector */}
        <div className="lg:col-span-2 space-y-10">
          {/* Executive Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card rounded-[48px] p-12 relative overflow-hidden group border-primary-500/10 shadow-[0_40px_80px_rgba(0,0,0,0.4)]"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-primary-500/5 blur-[120px] -z-10 group-hover:bg-primary-500/10 transition-all duration-1000" />

            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
              <div className="flex items-center space-x-10">
                <div className="bg-slate-50 p-8 rounded-[36px] border border-slate-200 group-hover:rotate-6 transition-all duration-700 shadow-sm relative">
                  <div className="absolute inset-0 bg-primary-500/5 blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                  <Tag size={48} className="text-primary-500 relative" />
                </div>
                <div>
                  <div className="flex items-center space-x-4 mb-3">
                    <h1 className="text-6xl font-black text-slate-900 tracking-tighter">{stock.symbol}</h1>
                    <span className="bg-primary-500/10 px-4 py-1.5 rounded-xl text-[10px] font-black text-primary-600 uppercase tracking-[0.2em] border border-primary-500/20">Executive Tier</span>
                  </div>
                  <p className="text-slate-500 text-2xl font-bold tracking-tight">{stock.companyName}</p>
                </div>
              </div>

              <div className="flex flex-col items-end">
                <div className={cn(
                  "text-6xl font-black text-slate-900 tracking-tighter mb-4 transition-all duration-300 rounded-xl px-2",
                  stock.flash === 'up' && "bg-emerald-500/10 text-emerald-600 scale-110",
                  stock.flash === 'down' && "bg-red-500/10 text-red-600 scale-110"
                )}>
                  ${stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </div>
                <div className={cn(
                  "flex items-center space-x-3 px-6 py-3 rounded-2xl font-black text-sm tracking-widest border",
                  isPositive ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'
                )}>
                  {isPositive ? <TrendingUp size={24} /> : <TrendingDown size={24} />}
                  <span>{isPositive ? '+' : ''}{stock.change.toFixed(2)} ({Math.abs(stock.percentChange).toFixed(2)}%)</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Visualization Sector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card rounded-[48px] p-12 h-[550px] relative overflow-hidden border-primary-500/5"
          >
            <div className="flex items-center justify-between mb-12">
              <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em] flex items-center space-x-3">
                <Activity size={18} className="text-primary-500" />
                <span>30-Day Performance Matrix</span>
              </h3>
              <div className="flex items-center space-x-8">
                <div className="flex items-center space-x-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary-500 animate-pulse" />
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.25em]">Execution Value</span>
                </div>
              </div>
            </div>

            <div className="h-[400px]">
              {stock.history && stock.history.length > 0 ? (
                <Line
                  data={{
                    labels: stock.timestamps.map(t => new Date(t * 1000).toLocaleDateString()),
                    datasets: [{
                      label: 'Price',
                      data: stock.history,
                      borderColor: isPositive ? '#0ea5e9' : '#ef4444',
                      borderWidth: 5,
                      pointRadius: 0,
                      pointHoverRadius: 8,
                      pointHoverBackgroundColor: '#fff',
                      pointHoverBorderColor: isPositive ? '#0ea5e9' : '#ef4444',
                      pointHoverBorderWidth: 4,
                      fill: true,
                      backgroundColor: (context) => {
                        const ctx = context.chart.ctx;
                        const gradient = ctx.createLinearGradient(0, 0, 0, 400);
                        gradient.addColorStop(0, isPositive ? 'rgba(14, 165, 233, 0.2)' : 'rgba(239, 68, 68, 0.2)');
                        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                        return gradient;
                      },
                      tension: 0.4,
                    }]
                  }}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: { display: false },
                      tooltip: {
                        mode: 'index',
                        intersect: false,
                        backgroundColor: '#fff',
                        titleColor: '#64748b',
                        titleFont: { weight: 'black', size: 10, family: 'Outfit' },
                        bodyColor: '#0f172a',
                        bodyFont: { weight: 'black', size: 20, family: 'Outfit' },
                        borderColor: '#e2e8f0',
                        borderWidth: 1,
                        padding: 20,
                        displayColors: false,
                        callbacks: {
                          label: (context) => `$${context.parsed.y.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
                        }
                      }
                    },
                    interaction: {
                      mode: 'nearest',
                      axis: 'x',
                      intersect: false
                    },
                    scales: {
                      x: { display: false },
                      y: {
                        grid: { color: 'rgba(226, 232, 240, 0.5)', drawBorder: false },
                        ticks: {
                          color: '#94a3b8',
                          font: { weight: 'black', size: 10, family: 'Outfit' },
                          callback: (value) => `$${value}`
                        }
                      }
                    }
                  }}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-8">
                  <div className="bg-slate-900 shadow-inner p-10 rounded-full border border-slate-800">
                    <BarChart3 size={80} className="opacity-10" />
                  </div>
                  <p className="font-black uppercase tracking-[0.3em] text-[10px]">Data Stream Temporarily Off-line</p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Metric Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
            <StatCard label="High Point 24h" value={`$${stock.high.toLocaleString()}`} icon={<ArrowUpRight size={14} className="text-primary-400" />} />
            <StatCard label="Low Point 24h" value={`$${stock.low.toLocaleString()}`} icon={<ArrowDownRight size={14} className="text-red-400" />} />
            <StatCard label="Entry Value" value={`$${stock.open.toLocaleString()}`} />
            <StatCard label="Sector Close" value={`$${stock.previousClose.toLocaleString()}`} />
          </div>
        </div>

        {/* Tactical Sector */}
        <div className="space-y-10">
          {/* Action Hub */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[48px] p-12 shadow-[0_50px_100px_rgba(0,0,0,0.5)] relative overflow-hidden group border-primary-500/10"
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-primary-500/5 blur-[80px] -z-10" />

            <div className="flex justify-between items-center mb-12">
              <h2 className="text-2xl font-black text-slate-900 flex items-center space-x-4 tracking-tighter">
                <div className="p-2 bg-emerald-500/10 rounded-xl">
                  <ShoppingCart size={24} className="text-emerald-600" />
                </div>
                <span>TRADE TERMINAL</span>
              </h2>
              <button
                onClick={toggleWatchlist}
                className={cn(
                  "p-4 rounded-[24px] transition-all active:scale-90 shadow-sm border",
                  isWatched ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 'bg-slate-50 text-slate-400 hover:text-slate-900 border-slate-200'
                )}
              >
                <Star size={24} fill={isWatched ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <div className="flex justify-between items-end ml-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Unit Volume</label>
                  {portfolioEntry && (
                    <button
                      onClick={() => setQuantity(portfolioEntry.quantity)}
                      className="text-[10px] font-black text-primary-500 uppercase tracking-[0.2em] hover:text-primary-600 transition-colors"
                    >
                      Max: {portfolioEntry.quantity}
                    </button>
                  )}
                </div>
                <div className="flex items-center bg-slate-50 border border-slate-200 rounded-[28px] p-3 group-focus-within:border-emerald-500/50 transition-all shadow-sm">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                  >
                    <Minus size={28} />
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                    className="bg-transparent text-center w-full font-black text-4xl text-slate-900 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none tracking-tighter"
                  />
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="p-5 text-slate-400 hover:text-slate-900 hover:bg-white rounded-2xl transition-all shadow-sm border border-transparent hover:border-slate-100"
                  >
                    <Plus size={28} />
                  </button>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[36px] p-8 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Execution Price</span>
                  <span className="text-slate-900 font-black tracking-tight text-lg">${stock.currentPrice.toLocaleString()}</span>
                </div>
                <div className="h-[1px] bg-slate-200 w-full" />
                <div className="flex flex-col space-y-2">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em]">Contract Value</span>
                  <span className="text-5xl font-black text-emerald-600 tracking-tighter">${(stock.currentPrice * quantity).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6">
                <button
                  onClick={() => handleTrade('buy')}
                  disabled={trading}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white py-6 rounded-[32px] font-black text-lg shadow-[0_20px_40px_rgba(16,185,129,0.2)] transition-all active:scale-[0.98] flex items-center justify-center space-x-4 disabled:opacity-50 relative overflow-hidden group/btn"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
                  {trading ? <Loader2 className="animate-spin" size={28} strokeWidth={3} /> : (
                    <>
                      <Zap size={22} fill="currentColor" />
                      <span className="tracking-[0.1em]">BUY STOCK</span>
                    </>
                  )}
                </button>
                {portfolioEntry && (
                  <div className="space-y-4">
                    <button
                      onClick={() => handleTrade('sell')}
                      disabled={trading || quantity > portfolioEntry.quantity}
                      className="w-full bg-red-600 hover:bg-red-500 text-white py-6 rounded-[32px] font-black text-lg shadow-[0_20px_40px_rgba(239,68,68,0.2)] transition-all active:scale-[0.98] flex items-center justify-center space-x-4 disabled:opacity-50 disabled:cursor-not-allowed group/sell"
                    >
                      {trading ? <Loader2 className="animate-spin" size={28} strokeWidth={3} /> : (
                        <>
                          <TrendingDown size={22} className="group-hover/sell:-translate-y-1 transition-transform" />
                          <span className="tracking-[0.1em]">SELL STOCK</span>
                        </>
                      )}
                    </button>
                    {quantity > portfolioEntry.quantity && (
                      <p className="text-red-500 text-[10px] font-black uppercase tracking-widest text-center animate-pulse">
                        Insufficient Volume: Only {portfolioEntry.quantity} units available
                      </p>
                    )}
                  </div>
                )}
              </div>

              <div className="text-center bg-white p-6 rounded-[32px] border border-slate-200 shadow-sm">
                <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mb-2">Operational Balance</div>
                <div className="text-3xl font-black text-slate-900 tracking-tighter flex items-center justify-center space-x-3">
                  <span className="text-emerald-600 opacity-50">$</span>
                  <span>{user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Position Matrix */}
          <AnimatePresence>
            {portfolioEntry && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className="bg-primary-500/5 border border-primary-500/20 rounded-[48px] p-12 space-y-10 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 blur-[60px]" />
                <div className="flex items-center space-x-6">
                  <div className="bg-primary-500/20 p-5 rounded-[24px] shadow-[0_10px_30px_rgba(14,165,233,0.2)]">
                    <Briefcase className="text-primary-500" size={32} />
                  </div>
                  <div>
                    <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-1 leading-none">Intelligence Position</div>
                    <div className="text-4xl font-black text-slate-900 tracking-tighter">{portfolioEntry.quantity} Units</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-10 pt-10 border-t border-primary-500/10">
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Basis Average</div>
                    <div className="text-2xl font-black text-slate-900 tracking-tighter font-mono">${portfolioEntry.averagePrice.toFixed(2)}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">Sector Result</div>
                    <div className={cn(
                      "text-2xl font-black tracking-tighter font-mono",
                      portfolioEntry.profitLoss >= 0 ? 'text-emerald-600' : 'text-red-600'
                    )}>
                      {portfolioEntry.profitLoss >= 0 ? '+' : ''}{portfolioEntry.profitLoss.toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ label, value, icon }) => (
  <div className="glass-card p-10 rounded-[40px] group border-primary-500/5">
    <div className="flex items-center justify-between mb-3">
      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] group-hover:text-primary-400 transition-colors">{label}</div>
      {icon}
    </div>
    <div className="text-3xl font-black text-slate-900 tracking-tighter">{value}</div>
  </div>
);

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default StockDetails;

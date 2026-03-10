import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import {
  Briefcase,
  TrendingUp,
  TrendingDown,
  PieChart as PieChartIcon,
  ArrowUpRight,
  ArrowDownRight,
  Loader2,
  Wallet,
  Activity,
  ChevronRight,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Portfolio = () => {
  const [data, setData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('holdings');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [portfolioRes, transactionsRes] = await Promise.all([
          API.get('/portfolio'),
          API.get('/portfolio/transactions')
        ]);
        setData(portfolioRes.data.data);
        setTransactions(transactionsRes.data.data);
      } catch (error) {
        console.error('Portfolio data retrieval error');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 animate-fade-in">
        <div className="relative">
          <div className="absolute inset-0 bg-primary-500/20 blur-3xl rounded-full animate-pulse" />
          <Loader2 className="animate-spin text-primary-500 relative" size={64} strokeWidth={1} />
        </div>
        <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">Synchronizing Holdings...</p>
      </div>
    );
  }

  const totalPL = data.holdings.reduce((acc, h) => acc + h.profitLoss, 0);
  const totalPLPercent = data.totalPortfolioValue > 0
    ? (totalPL / (data.totalPortfolioValue - totalPL)) * 100
    : 0;

  return (
    <div className="space-y-12 pb-20 animate-fade-in pt-6">
      {/* Portfolio Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-8">
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-primary-500 uppercase tracking-[0.4em] flex items-center space-x-3">
            <Activity size={18} />
            <span>Executive Portfolio Overview</span>
          </h3>
          <h1 className="text-7xl font-black text-white tracking-tighter leading-none">
            ASSET MATRIX
          </h1>
        </div>

        <div className="flex items-center bg-white p-3 rounded-[32px] border border-slate-200 shadow-sm">
          <div className="flex flex-col items-end px-6">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Valuation</span>
            <div className="text-3xl font-black text-slate-900 tracking-tighter flex items-center space-x-3">
              <span className="text-primary-600 opacity-50">$</span>
              <span>{data.netWorth.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
            </div>
          </div>
          <div className="h-12 w-[1px] bg-slate-800"></div>
          <div className="flex items-center bg-slate-950/40 p-1.5 rounded-2xl border border-slate-800/50 ml-4">
            {['holdings', 'history'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                  activeTab === tab
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-500/20"
                    : "text-slate-500 hover:text-white"
                )}
              >
                {tab === 'holdings' ? 'Inventory' : 'Logs'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        {/* Performance Sidebar */}
        <div className="lg:col-span-1 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-card rounded-[48px] p-10 relative overflow-hidden border-primary-500/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-[60px]" />
            <div className="space-y-10">
              <div className="bg-slate-950/50 p-6 rounded-[28px] border border-slate-800/50 inline-block">
                <PieChartIcon size={32} className="text-primary-500" />
              </div>
              <div>
                <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Net Portfolio Return</div>
                <div className={`text-4xl font-black tracking-tighter flex items-center space-x-2 ${totalPL >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
                  {totalPL >= 0 ? <ArrowUpRight size={32} /> : <ArrowDownRight size={32} />}
                  <span>${Math.abs(totalPL).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
              <div className="pt-8 border-t border-slate-800/50 space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Growth Factor</span>
                  <span className={`text-sm font-black ${totalPL >= 0 ? 'text-primary-400' : 'text-red-400'}`}>
                    {totalPL >= 0 ? '+' : '-'}{Math.abs(totalPLPercent).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Assets</span>
                  <span className="text-sm font-black text-slate-900">{data.holdings.length} Positions</span>
                </div>
              </div>
            </div>
          </motion.div>

          <StatCard
            label="Liquid Capital"
            value={`$${data.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
            icon={<Wallet size={16} className="text-primary-500" />}
          />
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeTab === 'holdings' ? (
              <motion.div
                key="holdings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-[48px] overflow-hidden border-primary-500/5 shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
              >
                <div className="px-10 py-10 bg-slate-950/30 border-b border-slate-800/50 flex justify-between items-center">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-4">
                    <div className="p-2 bg-primary-500/10 rounded-xl">
                      <Briefcase size={20} className="text-primary-600" />
                    </div>
                    <span>Holdings Catalog</span>
                  </h2>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800/50">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Security</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Volume</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Avg Cost</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Value</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Performance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {data.holdings.map((holding) => {
                        const isPos = holding.profitLoss >= 0;
                        return (
                          <tr key={holding.stockSymbol} className="group hover:bg-primary-500/[0.02] transition-colors">
                            <td className="px-10 py-10">
                              <Link to={`/stock/${holding.stockSymbol}`} className="flex items-center space-x-6">
                                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 group-hover:border-primary-500/50 transition-all font-black text-xs text-primary-500 shadow-xl group-hover:scale-110">
                                  {holding.stockSymbol}
                                </div>
                                <span className="font-bold text-slate-200 group-hover:text-white transition-colors">Terminal Access</span>
                              </Link>
                            </td>
                            <td className="px-10 py-10 font-black text-slate-300 text-lg">{holding.quantity}</td>
                            <td className="px-10 py-10 font-bold text-slate-400">${holding.averagePrice.toFixed(2)}</td>
                            <td className="px-10 py-10 font-black text-white text-lg">${holding.totalValue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                            <td className="px-10 py-10 text-right">
                              <div className={`inline-flex flex-col items-end px-4 py-2 rounded-2xl border ${isPos ? 'bg-primary-500/10 text-primary-400 border-primary-500/20' : 'bg-red-500/10 text-red-400 border-red-500/20'
                                }`}>
                                <div className="flex items-center space-x-1 font-black text-xs tracking-widest">
                                  {isPos ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                  <span>${Math.abs(holding.profitLoss).toFixed(2)}</span>
                                </div>
                                <span className="text-[10px] font-black opacity-50">({holding.profitLossPercentage.toFixed(2)}%)</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  {data.holdings.length === 0 && <EmptyState icon={<Briefcase size={80} />} label="No Active Holdings Detected" />}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="history"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="glass-card rounded-[48px] overflow-hidden border-primary-500/5 shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
              >
                <div className="px-10 py-10 bg-slate-950/30 border-b border-slate-800/50">
                  <h2 className="text-xl font-black text-slate-900 tracking-tight flex items-center space-x-4">
                    <div className="p-2 bg-primary-500/10 rounded-xl">
                      <History size={20} className="text-primary-600" />
                    </div>
                    <span>Transaction Logs</span>
                  </h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-800/50">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Asset</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Type</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Amount</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Total Net</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/30">
                      {transactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-primary-500/[0.02] transition-colors">
                          <td className="px-10 py-8 text-[10px] font-black text-slate-500 font-mono">{new Date(tx.date).toLocaleString()}</td>
                          <td className="px-10 py-8">
                            <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800 font-black text-[10px] text-primary-500 inline-block uppercase tracking-widest">
                              {tx.stockSymbol}
                            </div>
                          </td>
                          <td className="px-10 py-8 text-center">
                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border ${tx.type === 'buy' ? 'bg-primary-500/10 text-primary-500 border-primary-500/20' : 'bg-red-500/10 text-red-500 border-red-500/20'}`}>
                              {tx.type}
                            </span>
                          </td>
                          <td className="px-10 py-8 font-black text-white">{tx.quantity} <span className="text-slate-500 text-[10px] ml-1">@ ${tx.price.toFixed(2)}</span></td>
                          <td className="px-10 py-8 text-right font-black text-white tracking-tighter text-lg">${tx.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {transactions.length === 0 && <EmptyState icon={<History size={80} />} label="No Transactional Data Found" />}
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
  <div className="glass-card p-8 rounded-[36px] group border-primary-500/5">
    <div className="flex items-center justify-between mb-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
      <span>{label}</span>
      <div className="group-hover:rotate-12 transition-transform">{icon}</div>
    </div>
    <div className="text-3xl font-black text-white tracking-tighter group-hover:text-primary-400 transition-colors">{value}</div>
  </div>
);

const EmptyState = ({ icon, label }) => (
  <div className="flex flex-col items-center justify-center py-32 space-y-8 grayscale opacity-20">
    <div className="bg-slate-900 p-10 rounded-full border border-slate-800/50">
      {icon}
    </div>
    <p className="text-slate-500 font-black uppercase tracking-[0.4em] text-[10px]">{label}</p>
  </div>
);

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Portfolio;

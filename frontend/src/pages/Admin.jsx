import { useState, useEffect } from 'react';
import API from '../services/api';
import {
  ShieldCheck,
  Users,
  History,
  Settings,
  Loader2,
  Mail,
  User as UserIcon,
  Calendar,
  Wallet,
  Activity,
  ArrowRight,
  Database
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Admin = () => {
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('users');

  // Stock form state
  const [stockForm, setStockForm] = useState({ symbol: '', companyName: '', currentPrice: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const fetchAdminData = async () => {
    try {
      const [usersRes, txRes, stocksRes] = await Promise.all([
        API.get('/admin/users'),
        API.get('/admin/transactions'),
        API.get('/admin/stocks')
      ]);
      setUsers(usersRes.data.data);
      setTransactions(txRes.data.data);
      setStocks(stocksRes.data.data);
    } catch (error) {
      console.error('Security clearance failure');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpsertStock = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      await API.post('/admin/stock', stockForm);
      setStockForm({ symbol: '', companyName: '', currentPrice: '' });
      setIsEditing(false);
      fetchAdminData();
    } catch (error) {
      alert('Failed to save stock: ' + error.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteStock = async (symbol) => {
    if (!window.confirm(`Are you sure you want to decommission ${symbol}?`)) return;
    try {
      await API.delete(`/admin/stock/${symbol}`);
      fetchAdminData();
    } catch (error) {
      alert('Failed to delete stock');
    }
  };

  const startEdit = (stock) => {
    setStockForm({
      symbol: stock.symbol,
      companyName: stock.companyName,
      currentPrice: stock.currentPrice
    });
    setIsEditing(true);
    setActiveTab('stock-form');
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <Loader2 className="animate-spin text-primary-500" size={64} />
        <div className="text-center">
          <p className="text-white font-black text-2xl tracking-tight uppercase">Security Clearance in Progress</p>
          <p className="text-slate-500 font-bold uppercase tracking-[0.3em] text-xs">Accessing Encrypted Admin Terminal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20 animate-fade-in">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8">
        <div className="space-y-2">
          <h1 className="text-5xl font-black text-white tracking-tighter flex items-center space-x-4">
            <div className="bg-primary-600 p-3 rounded-2xl shadow-xl">
              <ShieldCheck size={32} className="text-white" />
            </div>
            <span>ADMIN TERMINAL</span>
          </h1>
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm ml-1">Central Oversight & Node Surveillance</p>
        </div>

        <div className="flex flex-wrap items-center bg-slate-900/50 p-1.5 rounded-[24px] border border-slate-800/50 backdrop-blur-xl">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center space-x-2",
              activeTab === 'users' ? 'bg-primary-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
            )}
          >
            <Users size={14} />
            <span>Operators</span>
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={cn(
              "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center space-x-2",
              activeTab === 'transactions' ? 'bg-primary-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
            )}
          >
            <Database size={14} />
            <span>Ledger</span>
          </button>
          <button
            onClick={() => setActiveTab('stocks')}
            className={cn(
              "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center space-x-2",
              activeTab === 'stocks' ? 'bg-primary-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
            )}
          >
            <Settings size={14} />
            <span>Assets</span>
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setStockForm({ symbol: '', companyName: '', currentPrice: '' });
              setActiveTab('stock-form');
            }}
            className={cn(
              "px-6 py-3 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all duration-300 flex items-center space-x-2",
              activeTab === 'stock-form' ? 'bg-primary-600 text-white shadow-xl' : 'text-slate-500 hover:text-white'
            )}
          >
            <Activity size={14} />
            <span>Deploy</span>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'users' && (
          <motion.div
            key="users"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {users.map((user, index) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card rounded-[40px] p-10 space-y-8 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/5 blur-3xl -z-10 group-hover:bg-primary-500/10 transition-colors" />

                <div className="flex justify-between items-start">
                  <div className="bg-slate-800 p-4 rounded-[20px] shadow-2xl group-hover:rotate-3 transition-transform">
                    <UserIcon size={28} className="text-primary-500" />
                  </div>
                  <div className="flex flex-col items-end space-y-4">
                    <span className={cn(
                      "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                      user.role === 'admin' ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' : 'bg-slate-800 text-slate-500'
                    )}>
                      {user.role}
                    </span>
                    {user.role !== 'admin' && (
                      <button
                        onClick={async () => {
                          if (window.confirm(`Decommission Operator ${user.name}?`)) {
                            try {
                              await API.delete(`/admin/user/${user._id}`);
                              fetchAdminData();
                            } catch (e) {
                              alert('Decommissioning failed');
                            }
                          }
                        }}
                        className="p-2 rounded-xl bg-slate-800 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                        title="Decommission Operator"
                      >
                        <ShieldCheck size={16} />
                      </button>
                    )}
                  </div>
                </div>


                <div className="space-y-6">
                  <div>
                    <h3 className="font-black text-2xl text-white tracking-tight">{user.name}</h3>
                    <div className="flex items-center space-x-2 text-slate-500 font-medium text-sm mt-1">
                      <Mail size={14} />
                      <span>{user.email}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6 pt-6 border-t border-slate-800/50">
                    <div className="space-y-1">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Liquid Assets</div>
                      <div className="font-black text-primary-500 text-xl tracking-tighter">${user.balance.toLocaleString()}</div>
                    </div>
                    <div className="space-y-1 text-right">
                      <div className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">Authorized</div>
                      <div className="font-bold text-slate-300 text-sm">{new Date(user.createdAt).toLocaleDateString()}</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}

        {activeTab === 'transactions' && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-[40px] overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Operator</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Asset</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Operation</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Units</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Execution Net</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Timestamp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {transactions.map((tx) => (
                    <tr key={tx._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="font-black text-white tracking-tight text-sm">{tx.user?.name || 'Anonymous'}</div>
                        <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{tx.user?.email}</div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <div className="bg-slate-800 px-3 py-1.5 rounded-lg font-black text-xs text-primary-500 inline-block">
                          {tx.stockSymbol}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-center">
                        <span className={cn(
                          "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em]",
                          tx.type === 'buy' ? 'bg-primary-500/10 text-primary-500 border border-primary-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'
                        )}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-center font-black text-slate-100 text-sm">{tx.quantity}</td>
                      <td className="px-8 py-6 text-right font-black text-slate-100 tracking-tighter">
                        ${tx.totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-6 text-right text-slate-500 text-[10px] font-bold font-mono">
                        {new Date(tx.date).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'stocks' && (
          <motion.div
            key="stocks"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="glass-card rounded-[40px] overflow-hidden shadow-2xl"
          >
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-900/50 border-b border-slate-800">
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Node Symbol</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Entity Name</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Base Valuation</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-right">Synchronization</th>
                    <th className="px-8 py-6 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/30">
                  {stocks.map((stock) => (
                    <tr key={stock._id} className="hover:bg-slate-800/30 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="bg-primary-500/10 text-primary-500 px-3 py-1.5 rounded-lg font-black text-xs inline-block">
                          {stock.symbol}
                        </div>
                      </td>
                      <td className="px-8 py-6 font-bold text-white tracking-tight">{stock.companyName}</td>
                      <td className="px-8 py-6 text-right font-black text-white tracking-tighter">
                        ${stock.currentPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                      </td>
                      <td className="px-8 py-6 text-right text-slate-500 text-[10px] font-bold">
                        {new Date(stock.lastUpdated).toLocaleString()}
                      </td>
                      <td className="px-8 py-6 text-center space-x-2">
                        <button
                          onClick={() => startEdit(stock)}
                          className="p-2 rounded-xl bg-slate-800 text-primary-500 hover:bg-primary-600 hover:text-white transition-all shadow-lg"
                        >
                          <Settings size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteStock(stock.symbol)}
                          className="p-2 rounded-xl bg-slate-800 text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-lg"
                        >
                          <ShieldCheck size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {stocks.length === 0 && (
                    <tr>
                      <td colSpan="5" className="px-8 py-20 text-center">
                        <div className="flex flex-col items-center space-y-4 text-slate-500">
                          <Database size={48} className="opacity-20" />
                          <p className="font-black uppercase tracking-widest text-xs">No active asset nodes detected in sector</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === 'stock-form' && (
          <motion.div
            key="stock-form"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex justify-center"
          >
            <div className="glass-card rounded-[40px] p-12 w-full max-w-2xl space-y-10">
              <div className="space-y-2">
                <h2 className="text-3xl font-black text-white tracking-tight">
                  {isEditing ? 'RECONFIGURE ASSET' : 'DEPLOY NEW NODE'}
                </h2>
                <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">
                  {isEditing ? `Modifying Parameters for ${stockForm.symbol}` : 'Enter global market initialization parameters'}
                </p>
              </div>

              <form onSubmit={handleUpsertStock} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Node Ticker</label>
                    <input
                      type="text"
                      placeholder="e.g. BTC, NVDA"
                      value={stockForm.symbol}
                      onChange={(e) => setStockForm({ ...stockForm, symbol: e.target.value })}
                      required
                      className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white font-black focus:border-primary-500 focus:outline-none transition-all placeholder:text-slate-700 uppercase"
                      disabled={isEditing && false} // Allow symbol update to upsert if needed, but usually symbol is key
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Base Price (USD)</label>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      value={stockForm.currentPrice}
                      onChange={(e) => setStockForm({ ...stockForm, currentPrice: e.target.value })}
                      required
                      className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white font-black focus:border-primary-500 focus:outline-none transition-all placeholder:text-slate-700"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 ml-1">Entity Name</label>
                  <input
                    type="text"
                    placeholder="Full Corporate Designation"
                    value={stockForm.companyName}
                    onChange={(e) => setStockForm({ ...stockForm, companyName: e.target.value })}
                    required
                    className="w-full bg-slate-900/50 border-2 border-slate-800 rounded-2xl px-6 py-4 text-white font-black focus:border-primary-500 focus:outline-none transition-all placeholder:text-slate-700"
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 bg-primary-600 hover:bg-primary-500 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition-all flex items-center justify-center space-x-3 disabled:opacity-50"
                  >
                    {formLoading ? <Loader2 className="animate-spin" size={16} /> : <ShieldCheck size={16} />}
                    <span>{isEditing ? 'COMMIT CHANGES' : 'INITIALIZE NODE'}</span>
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setStockForm({ symbol: '', companyName: '', currentPrice: '' });
                        setActiveTab('stocks');
                      }}
                      className="px-8 bg-slate-800 hover:bg-slate-700 text-white font-black uppercase tracking-widest text-xs py-5 rounded-2xl transition-all"
                    >
                      ABORT
                    </button>
                  )}
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

function cn(...inputs) {
  return inputs.filter(Boolean).join(' ');
}

export default Admin;

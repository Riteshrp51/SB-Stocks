import { Link } from 'react-router-dom';
import { TrendingUp, BarChart2, Shield, Wallet, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="relative overflow-hidden min-h-[calc(100vh-80px)] flex flex-col items-center">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-grid-pattern -z-10 opacity-30" />
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-500/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full -z-10" />

      {/* Hero Section */}
      <div className="w-full max-w-7xl px-4 pt-20 pb-32 flex flex-col lg:flex-row items-center gap-16">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex-1 text-center lg:text-left space-y-8"
        >
          <div className="inline-flex items-center space-x-2 bg-primary-500/10 border border-primary-500/20 px-4 py-2 rounded-full text-primary-400 font-black text-xs uppercase tracking-widest animate-pulse-slow">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
            </span>
            <span>Market Simulation Active</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-white">
            PRACTICE STOCK <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">TRADING</span> <br />
            WITHOUT RISK.
          </h1>

          <p className="text-xl text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium">
            Learn and test strategies using virtual money. Build your confidence before trading with real capital.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
            {user ? (
              <Link to="/dashboard" className="btn-primary group px-10 py-5 text-lg flex items-center space-x-3">
                <span>Enter Trading Floor</span>
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary group px-10 py-5 text-lg flex items-center space-x-3">
                  <span>Start Trading</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link to="/login" className="btn-secondary px-10 py-5 text-lg flex items-center space-x-2">
                  <Play size={18} fill="currentColor" />
                  <span>Explore Market</span>
                </Link>
              </>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-8 text-slate-500 font-bold text-sm uppercase tracking-widest">
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={18} className="text-primary-500" />
              <span>Real-time Data</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={18} className="text-primary-500" />
              <span>Global Stocks</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle2 size={18} className="text-primary-500" />
              <span>Mobile Ready</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="flex-1 relative hidden lg:block"
        >
          <div className="absolute inset-0 bg-primary-500/20 blur-[100px] -z-10 rounded-full" />
          <div className="glass-card rounded-[40px] p-8 shadow-2xl shadow-primary-500/10 border-primary-500/20 rotate-3 translate-x-10 hover:rotate-0 hover:translate-x-0 transition-all duration-700 group cursor-default">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-primary-500 p-3 rounded-2xl">
                  <TrendingUp size={24} className="text-white" />
                </div>
                <div>
                  <div className="font-black text-2xl text-white">AAPL</div>
                  <div className="text-xs font-bold text-slate-500 tracking-widest uppercase">Apple Inc.</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-white">$182.52</div>
                <div className="text-primary-500 font-bold">+2.45%</div>
              </div>
            </div>

            <div className="h-48 flex items-end justify-between gap-1">
              {[40, 70, 45, 90, 65, 80, 55, 95, 85, 100, 75, 90].map((h, i) => (
                <motion.div
                  key={i}
                  initial={{ height: 0 }}
                  animate={{ height: `${h}%` }}
                  transition={{ delay: i * 0.05, duration: 1 }}
                  className="w-full bg-gradient-to-t from-primary-600/20 to-primary-500 rounded-t-md group-hover:from-primary-500 group-hover:to-primary-400 transition-all duration-500"
                />
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="w-full max-w-7xl px-4 py-32 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        <FeatureCard
          icon={<TrendingUp className="text-primary-500" size={32} />}
          title="Market Pulse"
          description="Instant execution with professional-grade market data streaming."
          delay={0.1}
        />
        <FeatureCard
          icon={<Wallet className="text-primary-500" size={32} />}
          title="Virtual Wealth"
          description="Test your financial instincts with $10k in simulated capital."
          delay={0.2}
        />
        <FeatureCard
          icon={<BarChart2 className="text-primary-500" size={32} />}
          title="Deep Analytics"
          description="Sophisticated charting tools for high-precision strategy testing."
          delay={0.3}
        />
        <FeatureCard
          icon={<Shield className="text-primary-500" size={32} />}
          title="Safe Harbor"
          description="The ultimate playground for risk-free high-stakes learning."
          delay={0.4}
        />
      </div>

      {/* Stats Section */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="w-full max-w-5xl px-4 pb-40"
      >
        <div className="glass-card rounded-[40px] p-16 text-center space-y-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 blur-[80px] -z-10 group-hover:bg-primary-500/10 transition-colors" />
          <h2 className="text-4xl font-black text-white tracking-tight">ELEVATE YOUR TRADING GAME</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12">
            <div>
              <div className="text-6xl font-black text-primary-500 mb-2">100%</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Risk Immunity</div>
            </div>
            <div>
              <div className="text-6xl font-black text-primary-500 mb-2">Real</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Market Dynamics</div>
            </div>
            <div>
              <div className="text-6xl font-black text-primary-500 mb-2">∞</div>
              <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">Learning Curve</div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6 }}
    viewport={{ once: true }}
    className="glass-card p-10 rounded-[32px] space-y-6 group hover:-translate-y-2 transition-all duration-500"
  >
    <div className="bg-slate-800 w-20 h-20 rounded-2xl flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-500 group-hover:rotate-6 shadow-xl">
      <div className="group-hover:text-white transition-colors duration-500">
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-black text-white">{title}</h3>
    <p className="text-slate-400 leading-relaxed font-medium">
      {description}
    </p>
  </motion.div>
);

export default Home;

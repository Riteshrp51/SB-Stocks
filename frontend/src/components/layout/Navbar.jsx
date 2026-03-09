import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { TrendingUp, User, LogOut, LayoutDashboard, Briefcase, List, ShieldCheck, Wallet } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Market', icon: LayoutDashboard },
    { to: '/portfolio', label: 'Portfolio', icon: Briefcase },
    { to: '/watchlist', label: 'Watchlist', icon: List },
  ];

  if (user?.role === 'admin') {
    navLinks.push({ to: '/admin', label: 'Admin', icon: ShieldCheck });
  }

  return (
    <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-7xl">
      <div className="bg-white/80 backdrop-blur-md rounded-[32px] px-8 py-4 flex items-center justify-between border border-slate-200 shadow-[0_15px_35px_-5px_rgb(0,0,0,0.05)]">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="bg-primary-600 p-2.5 rounded-xl group-hover:rotate-12 transition-all duration-500 shadow-md">
            <TrendingUp size={20} className="text-white" />
          </div>
          <span className="text-xl font-black tracking-tighter text-slate-900">SB <span className="text-primary-600">STOCKS</span></span>
        </Link>

        <div className="hidden md:flex items-center bg-slate-50 p-1.5 rounded-2xl border border-slate-200">
          {user && navLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={`flex items-center space-x-2 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all duration-300 ${location.pathname === to
                ? "bg-white text-primary-600 shadow-sm border border-slate-100"
                : "text-slate-500 hover:text-slate-900"
                }`}
            >
              <Icon size={16} />
              <span>{label}</span>
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-6">
          {user ? (
            <div className="flex items-center space-x-6">
              <div className="hidden sm:flex flex-col items-end">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Portfolio Value</span>
                <div className="flex items-center space-x-2 text-primary-600 font-black text-lg tracking-tighter">
                  <Wallet size={16} />
                  <span>${user.balance?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>

              <div className="h-8 w-[1px] bg-slate-200 hidden sm:block"></div>

              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-3 bg-slate-50 px-4 py-2 rounded-2xl border border-slate-200">
                  <div className="bg-primary-50 px-1.5 py-1.5 rounded-lg border border-primary-100">
                    <User size={16} className="text-primary-600" />
                  </div>
                  <span className="font-black text-xs uppercase tracking-widest text-slate-700 hidden lg:inline">{user.name}</span>
                </div>

                <button
                  onClick={handleLogout}
                  className="p-3 text-slate-500 hover:text-red-400 hover:bg-red-400/10 rounded-2xl transition-all duration-300 group"
                  title="Logout"
                >
                  <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-4">
              <Link to="/login" className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
                Login
              </Link>
              <Link to="/register" className="btn-primary py-3 px-6">
                Terminal Access
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

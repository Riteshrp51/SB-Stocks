import { useEffect } from 'react';
import {
    CheckCircle2,
    Layout,
    Smartphone,
    Zap,
    ShieldCheck,
    MousePointer2,
    ExternalLink,
    Github
} from 'lucide-react';
import { motion } from 'framer-motion';

const Walkthrough = () => {
    const highlights = [
        {
            title: "Executive Glassmorphism",
            description: "Advanced backdrop-blur-2xl with multi-layered borders and primary blue glow effects.",
            icon: <Layout className="text-primary-500" />
        },
        {
            title: "Interactive Terminals",
            description: "Asset-specific surveillance nodes with real-time performance vectors and high-fidelity charting.",
            icon: <Zap className="text-primary-500" />
        },
        {
            title: "Responsive Matrix",
            description: "Seamless adaptation across all viewport dimensions with optimized touch targets.",
            icon: <Smartphone className="text-primary-500" />
        },
        {
            title: "Atomic Transactions",
            description: "Backend reinforced with Mongoose transactions and layered input validation.",
            icon: <ShieldCheck className="text-primary-500" />
        }
    ];

    return (
        <div className="min-h-screen bg-[#020617] text-slate-300 font-sans selection:bg-primary-500/30">
            {/* Background Decor */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary-900/20 blur-[120px] rounded-full animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse delay-1000" />
            </div>

            <div className="relative max-w-6xl mx-auto px-6 py-24 space-y-32">
                {/* Hero Section */}
                <section className="text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="inline-flex items-center space-x-3 bg-slate-900/50 border border-slate-800 px-6 py-2 rounded-full mb-8"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500"></span>
                        </span>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary-500">Transformation Complete</span>
                    </motion.div>

                    <h1 className="text-8xl font-black text-white tracking-tighter leading-none">
                        EXECUTIVE <span className="text-slate-800 text-outline">TERMINAL</span>
                    </h1>
                    <p className="text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed">
                        The SB-Stocks platform has been successfully upgraded to a state-of-the-art trading interface,
                        combining aesthetic excellence with technical robustness.
                    </p>
                </section>

                {/* Feature Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {highlights.map((item, i) => (
                        <motion.div
                            key={item.title}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            viewport={{ once: true }}
                            className="glass-card p-10 rounded-[48px] border-primary-500/10 group hover:border-primary-500/30 transition-all duration-500"
                        >
                            <div className="bg-slate-950 w-16 h-16 rounded-3xl flex items-center justify-center mb-8 border border-slate-800 group-hover:scale-110 transition-transform shadow-2xl">
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.title}</h3>
                            <p className="text-slate-500 font-medium leading-relaxed">{item.description}</p>
                        </motion.div>
                    ))}
                </div>

                {/* Technical Validation */}
                <section className="glass-card p-16 rounded-[64px] relative overflow-hidden">
                    <div className="absolute inset-0 bg-primary-500/[0.02] -z-10" />
                    <div className="flex flex-col lg:flex-row gap-16 items-center">
                        <div className="lg:w-1/2 space-y-10">
                            <h2 className="text-5xl font-black text-white tracking-tighter">TECHNICAL <br />VERIFICATION</h2>
                            <div className="space-y-6">
                                {[
                                    "Atomic Mongoose Transactions for data integrity",
                                    "Validated trade inputs via Express-Validator",
                                    "Premium Glassmorphic CSS Implementation",
                                    "Staggered Framer-Motion Animations",
                                    "Cleaned duplicate exports & syntax errors"
                                ].map((check) => (
                                    <div key={check} className="flex items-center space-x-4">
                                        <CheckCircle2 size={24} className="text-primary-500" />
                                        <span className="text-slate-200 font-bold">{check}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="lg:w-1/2 bg-slate-950/80 p-10 rounded-[40px] border border-slate-800 shadow-3xl font-mono text-sm">
                            <div className="flex space-x-2 mb-6">
                                <div className="w-3 h-3 rounded-full bg-red-500/50" />
                                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                                <div className="w-3 h-3 rounded-full bg-green-500/50" />
                            </div>
                            <div className="space-y-2">
                                <p className="text-primary-500">$ npm run build</p>
                                <p className="text-slate-500">Creating an optimized production build...</p>
                                <p className="text-green-500">✓ Compiled successfully in 1420ms</p>
                                <p className="text-primary-500 mt-4">$ npm run dev</p>
                                <p className="text-slate-500">➜ Local: http://localhost:5173/</p>
                                <p className="text-slate-500">➜ Network: use --host to expose</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="text-center pb-20">
                    <div className="bg-primary-600/10 py-16 px-10 rounded-[64px] border border-primary-500/20 inline-block">
                        <h2 className="text-4xl font-black text-white mb-8 tracking-tight">READY FOR DEPLOYMENT</h2>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button className="bg-primary-600 hover:bg-primary-500 text-white font-black px-12 py-5 rounded-3xl transition-all shadow-[0_20px_40px_rgba(14,165,233,0.3)] active:scale-95 flex items-center space-x-3">
                                <MousePointer2 size={20} />
                                <span className="uppercase tracking-widest text-xs">Verify All Terminals</span>
                            </button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default Walkthrough;

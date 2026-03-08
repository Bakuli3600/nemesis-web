import { motion } from 'framer-motion';
import { Database, Zap, Search, Lock, ShieldAlert, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function BreachIntelInfo() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#ef4444] selection:text-white overflow-x-hidden">
      <div className="mesh-bg opacity-30" />
      
      <div className="container-responsive py-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#ef4444] transition-all mb-16 uppercase font-black text-[10px] tracking-[0.3em] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
        </Link>

        <header className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-[#ef4444] font-black uppercase tracking-[0.4em] text-[10px] mb-8"
          >
            <Database size={16} /> Leak Correlation Engine
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none"
          >
            Breach <br />
            <span className="text-[#ef4444] drop-shadow-[0_0_30px_rgba(239,68,68,0.3)]">INTEL.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium"
          >
            Deep-web cross-referencing of 360MB+ indexed leak datasets. Identifying credential exposure and data theft signatures before they are weaponized.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {[
            { icon: Search, title: "Vector Search", desc: "Instantly scan across 2M+ rows of verified breach metadata using elastic neural indexing." },
            { icon: Lock, title: "Hash Correlation", desc: "Matching anonymized email and password hashes against active darknet marketplace listings." },
            { icon: ShieldAlert, title: "Exposure Scoring", desc: "Automated risk assessment based on actor reputation and data freshness indices." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass p-10 border-white/5 bg-white/[0.02]"
            >
              <item.icon className="text-[#ef4444] mb-8" size={32} />
              <h3 className="text-lg font-black uppercase mb-4 tracking-wider">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="liquid-glass p-16 border-[#ef4444]/20 bg-[#ef4444]/5 mb-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <Database size={300} className="text-[#ef4444]" />
           </div>
           <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase italic">Intelligence Lake</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-12 font-medium">
                NEMESIS maintains a real-time synchronized index of the most critical global data leaks. Our engine doesn't just find your data; it predicts the likely attack vectors based on the nature of the exposure, providing you with a defensive roadmap to secure your perimeter.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-4 px-10 py-4 bg-[#ef4444] rounded-2xl text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl">
                Scan Data Lake <Zap size={18} fill="currentColor" />
              </Link>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

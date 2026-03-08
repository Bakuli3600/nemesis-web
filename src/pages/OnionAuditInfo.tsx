import { motion } from 'framer-motion';
import { Network, Zap, EyeOff, Globe, Shield, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function OnionAuditInfo() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#f3d36b] selection:text-black overflow-x-hidden">
      <div className="mesh-bg opacity-30" />
      
      <div className="container-responsive py-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#f3d36b] transition-all mb-16 uppercase font-black text-[10px] tracking-[0.3em] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
        </Link>

        <header className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-[#f3d36b] font-black uppercase tracking-[0.4em] text-[10px] mb-8"
          >
            <Network size={16} /> Tor Content Intelligence
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none"
          >
            Hidden <br />
            <span className="text-[#f3d36b] drop-shadow-[0_0_30px_rgba(243,211,107,0.3)]">SERVICE.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium"
          >
            Passive deep-content extraction from the Tor network. Automated auditing of .onion v3 services using decentralized SOCKS5h routing.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {[
            { icon: EyeOff, title: "Stealth Recon", desc: "Non-invasive auditing of hidden services without revealing the operative's digital footprint." },
            { icon: Globe, title: "Multi-Node Mesh", desc: "Routing requests through dynamic Tor circuits to bypass geolocation and IP-based blocking." },
            { icon: Shield, title: "Risk Profiling", desc: "Using local AI to identify impersonation attempts and malicious metadata in hidden service clusters." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass p-10 border-white/5 bg-white/[0.02]"
            >
              <item.icon className="text-[#f3d36b] mb-8" size={32} />
              <h3 className="text-lg font-black uppercase mb-4 tracking-wider">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="liquid-glass p-16 border-[#f3d36b]/20 bg-[#f3d36b]/5 mb-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <Network size={300} className="text-[#f3d36b]" />
           </div>
           <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase italic">The Darknet Perimeter</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-12 font-medium">
                Standard search engines stop where the darknet begins. NEMESIS pushes the perimeter forward, using automated crawlers to index and analyze hidden services that traditional security tools can't see. We provide clarity in the deep-web fog.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-4 px-10 py-4 bg-[#f3d36b] rounded-2xl text-black font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl">
                Enter Darknet Grid <Zap size={18} fill="currentColor" />
              </Link>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

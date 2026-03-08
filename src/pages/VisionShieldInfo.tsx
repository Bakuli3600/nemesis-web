import { motion } from 'framer-motion';
import { Shield, Zap, Cpu, Search, Activity, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

export default function VisionShieldInfo() {
  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#a855f7] selection:text-white overflow-x-hidden">
      <div className="mesh-bg opacity-30" />
      
      <div className="container-responsive py-12 relative z-10">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-[#a855f7] transition-all mb-16 uppercase font-black text-[10px] tracking-[0.3em] group">
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Nexus
        </Link>

        <header className="mb-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 text-[#a855f7] font-black uppercase tracking-[0.4em] text-[10px] mb-8"
          >
            <Shield size={16} /> Neural Vision Pipeline
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl md:text-8xl font-black mb-12 tracking-tighter leading-none"
          >
            Deepfake <br />
            <span className="text-[#a855f7] drop-shadow-[0_0_30px_rgba(168,85,247,0.3)]">SHIELD.</span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-gray-400 max-w-3xl leading-relaxed font-medium"
          >
            Elite dual-layer interrogation utilizing Vision Transformers (ViT) and temporal consistency checks to neutralize synthetic visual threats in real-time.
          </motion.p>
        </header>

        <div className="grid md:grid-cols-3 gap-12 mb-32">
          {[
            { icon: Cpu, title: "ViT-B/16 Core", desc: "Utilizing 12-layer attention mechanisms to detect micro-anomalies in spatial frequency." },
            { icon: Search, title: "Forensic Audit", desc: "Analyzing JPEG ghosting and temporal blinking artifacts invisible to the human eye." },
            { icon: Activity, title: "Real-time Sync", desc: "Optimized for sub-500ms inference using decentralized edge-node orchestration." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="liquid-glass p-10 border-white/5 bg-white/[0.02]"
            >
              <item.icon className="text-[#a855f7] mb-8" size={32} />
              <h3 className="text-lg font-black uppercase mb-4 tracking-wider">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed font-medium">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="liquid-glass p-16 border-[#a855f7]/20 bg-[#a855f7]/5 mb-32 relative overflow-hidden">
           <div className="absolute top-0 right-0 p-10 opacity-5">
              <Shield size={300} className="text-[#a855f7]" />
           </div>
           <div className="relative z-10 max-w-3xl">
              <h2 className="text-3xl md:text-4xl font-black mb-8 uppercase italic">Defensive Protocol</h2>
              <p className="text-gray-300 text-lg leading-relaxed mb-12 font-medium">
                The Deepfake Shield isn't just a filter; it's an adversarial neural network. It cross-references spatial artifacts with temporal flows to ensure that every frame of your video or every pixel of your image carries the fingerprint of authentic reality.
              </p>
              <Link to="/dashboard" className="inline-flex items-center gap-4 px-10 py-4 bg-[#a855f7] rounded-2xl text-white font-black text-sm uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl">
                Initialize Shield <Zap size={18} fill="currentColor" />
              </Link>
           </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Shield, ArrowRight, EyeOff, Activity, LayoutDashboard, Database, Zap, Binary, Wifi, Cpu, Globe, Server, Lock, Fingerprint, Network, Terminal, Code, MessageSquare, Radar } from 'lucide-react';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/firebaseConfig';
import logo from '../assets/logo.png';
import Footer from '../components/Footer';
import TargetCursor from '../components/TargetCursor';
import DecryptedText from '../components/DecryptedText';
import CurvedLoop from '../components/CurvedLoop';
import Login from './Login';
import Signup from './Signup';

export default function LandingPage() {
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard');
    });
    return () => unsubscribe();
  }, [navigate]);

  const systemStats = [
    { label: "Active Nodes", val: "1,204", icon: Globe, color: "#f3d36b" },
    { label: "Threats Blocked", val: "842K", icon: Shield, color: "#3b82f6" },
    { label: "Uptime", val: "99.99%", icon: Server, color: "#10b981" },
    { label: "Neural Latency", val: "42ms", icon: Zap, color: "#a855f7" }
  ];

  const systemGroups = [
    {
      category: "AI AUTHENTICATION",
      icon: Shield,
      color: "#a855f7",
      modules: [
        {
          icon: Shield,
          title: "Deepfake Shield",
          subtitle: "RESNEXT50 + LSTM",
          desc: "Elite dual-layer analysis detecting temporal inconsistencies and spatial artifacts in video streams.",
          metrics: ["Accuracy: 87%", "Frames: 20/seq"],
          accent: "#a855f7",
          link: "/deepfakeshield"
        },
        {
          icon: MessageSquare,
          title: "NLP Intent Engine",
          subtitle: "LINGUISTIC ANALYSIS",
          desc: "Advanced intent extraction and linguistic threat profiling for secure communication streams.",
          metrics: ["Model: Nemesis-v2", "Latency: 420ms"],
          accent: "#ec4899",
          link: "/comm-analysis"
        }
      ]
    },
    {
      category: "INTELLIGENCE OPS",
      icon: Radar,
      color: "#3b82f6",
      modules: [
        {
          icon: Database,
          title: "Breach Intelligence",
          subtitle: "LEAK DATA CORRELATION",
          desc: "Cross-referencing 360MB+ of indexed leak databases to detect credential exposure and data theft.",
          metrics: ["Intel: 2M+ Rows", "Mode: Real-time"],
          accent: "#10b981",
          link: "/breaches"
        },
        {
          icon: EyeOff,
          title: "Hidden Service Audit",
          subtitle: "TOR CONTENT ANALYSIS",
          desc: "Passive deep-content intelligence retrieving and analyzing onion services via local LLM orchestration.",
          metrics: ["Type: v3-Audit", "Mode: Passive"],
          accent: "#f3d36b",
          link: "/onion-audit"
        }
      ]
    },
    {
      category: "DARK WEB & NETWORK",
      icon: Network,
      color: "#10b981",
      modules: [
        {
          icon: Wifi,
          title: "Packet Flow Analysis",
          subtitle: "L3/L4 INSPECTION",
          desc: "Passive inspection of packet metadata to detect DGA patterns and C2 communication links.",
          metrics: ["Protocol: TCP/UDP", "Real-time: YES"],
          accent: "#10b981",
          link: "/network"
        },
        {
          icon: Database,
          title: "Threat Ledger",
          subtitle: "BLOCKCHAIN PROOF",
          desc: "Tamper-proof anchoring of every threat detection to the Polygon network for immutable proof.",
          metrics: ["Chain: Polygon", "Status: Sync"],
          accent: "#ffffff",
          link: "/dashboard"
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans selection:bg-[#f3d36b] selection:text-black overflow-x-hidden relative safe-area-bottom">
      <TargetCursor targetSelector=".cursor-target" spinDuration={2} hideDefaultCursor parallaxOn hoverDuration={0.2} />
      
      {/* Auth Overlays */}
      <AnimatePresence>
        {showLogin && (
          <Login 
            onClose={() => setShowLogin(false)} 
            onSwitchToSignup={() => { setShowLogin(false); setShowSignup(true); }}
          />
        )}
        {showSignup && (
          <Signup 
            onClose={() => setShowSignup(false)} 
            onSwitchToLogin={() => { setShowSignup(false); setShowLogin(true); }}
          />
        )}
      </AnimatePresence>

      {/* Visual Layers */}
      <div className="mesh-bg" />
      <div className="grid-dots" />
      <div className="glow-beam left-[10%] opacity-20" style={{ animationDelay: '0s' }} />
      <div className="glow-beam left-[40%] opacity-10" style={{ animationDelay: '2s' }} />
      <div className="glow-beam left-[80%] opacity-20" style={{ animationDelay: '1s' }} />

      <div className="container-responsive py-8 md:py-12 relative z-10">
        <motion.nav 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="flex justify-between items-center mb-16 md:mb-32 liquid-glass p-3 md:p-4 px-6 md:px-8 rounded-full border-white/5"
        >
          <div className="text-xl md:text-2xl font-black tracking-tight flex items-center gap-2 md:gap-3">
            <img src={logo} alt="Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain drop-shadow-[0_0_10px_rgba(243,211,107,0.3)]" />
            <span className="tracking-[0.2em] text-[10px] md:text-sm font-black text-white">NEMESIS</span>
          </div>
          <div className="hidden lg:flex gap-12 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
            <Link to="/dashboard" className="hover:text-white transition-colors cursor-target">Dashboard</Link>
            <Link to="/deepfakeshield" className="hover:text-white transition-colors cursor-target">Shield</Link>
            <Link to="/breaches" className="hover:text-white transition-colors cursor-target">Breaches</Link>
            <Link to="/onion-audit" className="hover:text-white transition-colors cursor-target">Hidden Service Audit</Link>
          </div>
          <button 
            onClick={() => setShowLogin(true)}
            className="liquid-accent-btn px-4 md:px-8 py-2 md:py-2.5 text-[8px] md:text-[10px] tracking-widest cursor-target whitespace-nowrap"
          >
            Launch Link
          </button>
        </motion.nav>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="max-w-3xl text-center lg:text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[#f3d36b] text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] mb-8 md:mb-12 shadow-2xl"
            >
              <Cpu size={12} className="animate-pulse" /> System v1.0.4 Operational
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-4 justify-center lg:justify-start"
            >
              <div className="h-px w-12 bg-[#f3d36b]" />
              <span className="text-[14px] font-black tracking-[0.5em] text-[#f3d36b] uppercase">NEMESIS PROACTIVE DEFENSE</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-6xl md:text-8xl lg:text-[10rem] font-black mb-8 md:mb-12 tracking-tighter leading-[0.8]"
            >
              ANTICIPATE. <br />
              <span className="text-gradient-gold drop-shadow-[0_0_20px_rgba(243,211,107,0.2)]">DISRUPT.</span>
            </motion.h1>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-lg md:text-xl lg:text-2xl text-gray-400 mb-12 md:mb-16 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              <DecryptedText 
                text="Elite intelligence orchestration combining predictive OSINT, Vision Transformers, and On-Chain Ledgering to secure the decentralized digital frontier."
                animateOn="view"
                speed={10}
                sequential={true}
                revealDirection="start"
                className="text-gray-400"
                encryptedClassName="text-[#f3d36b] opacity-50"
              />
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col md:flex-row items-center gap-6 lg:gap-8 justify-center lg:justify-start"
            >
              <button 
                onClick={() => setShowLogin(true)}
                className="w-full md:w-auto inline-flex items-center justify-center gap-4 px-10 md:px-12 py-4 md:py-5 bg-[#f3d36b] rounded-2xl text-black font-black text-base md:text-lg hover:shadow-[0_20px_40px_rgba(243,211,107,0.3)] hover:-translate-y-1 transition-all cursor-target shimmer"
              >
                Launch Protocol <ArrowRight size={24} strokeWidth={3} />
              </button>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-4 text-[9px] md:text-[10px] font-black text-gray-600 uppercase tracking-[0.3em]">
                    <span className="flex items-center gap-2 md:gap-3"><Binary size={14} className="text-[#f3d36b]" /> Neural Scan</span>
                    <span className="h-4 w-px bg-white/10" />
                    <span className="flex items-center gap-2 md:gap-3"><Database size={14} className="text-white" /> Ledger</span>
                </div>
                <div className="text-[7px] md:text-[8px] font-mono text-gray-700 uppercase tracking-widest text-center md:text-left text-white">Hash: 0x4F2A...882BC1</div>
              </div>
            </motion.div>
          </div>

          {/* Sexy Right Panel: System Metadata */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block liquid-glass p-1 w-full aspect-square max-w-[500px] ml-auto rounded-[3rem]"
          >
            <div className="w-full h-full bg-[#020617]/80 rounded-[2.8rem] p-10 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5 text-white">
                    <Network size={200} className="text-[#f3d36b]" />
                </div>
                
                <div className="flex justify-between items-start">
                    <div>
                        <h4 className="text-xs font-black text-[#f3d36b] uppercase tracking-[0.3em] mb-2">Node Distribution</h4>
                        <p className="text-[10px] text-gray-500 font-mono text-white">STATION: BRAVO_01</p>
                    </div>
                    <div className="w-10 h-10 rounded-xl bg-[#f3d36b]/10 border border-[#f3d36b]/20 flex items-center justify-center">
                        <Fingerprint className="text-[#f3d36b]" size={20} />
                    </div>
                </div>

                <div className="space-y-6">
                    {systemStats.map((stat, i) => (
                        <div key={i} className="flex items-center gap-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors cursor-target">
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-white/5">
                                <stat.icon size={18} style={{ color: stat.color }} />
                            </div>
                            <div className="flex-1">
                                <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">{stat.label}</p>
                                <p className="text-xl font-black text-white leading-none mt-1">{stat.val}</p>
                            </div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        </div>
                    ))}
                </div>

                <div className="pt-6 border-t border-white/5">
                    <div className="flex justify-between text-[9px] font-black text-gray-600 uppercase tracking-[0.2em] mb-4">
                        <span>Integrity Link</span>
                        <span>100%</span>
                    </div>
                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: '100%' }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className="h-full bg-gradient-to-r from-[#3b82f6] to-[#f3d36b]"
                        />
                    </div>
                </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* CURVED LOOP MARQUEE */}
      <div className="mt-4 md:mt-6 overflow-hidden">
        <CurvedLoop 
          marqueeText="✦ PROACTIVE ✦ INTELLIGENCE ✦ DECENTRALIZED ✦ DEFENSE ✦ SECURE ✦ OSINT ✦ NEURAL ✦"
          speed={1.5}
          curveAmount={80}
          className="curved-loop-text-glow"
        />
      </div>

      <div className="container-responsive relative z-10">
        {/* Feature Grid Briefing */}
        <div className="mt-32 md:mt-64 relative">
           <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[800px] h-[200px] md:h-[400px] bg-[#f3d36b]/5 blur-[120px] rounded-full pointer-events-none -z-10" />
           
           <div className="text-center mb-16 md:mb-24 px-4">
              <h2 className="text-3xl md:text-5xl font-black tracking-tighter mb-4 md:mb-6">Defense Infrastructure</h2>
              <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[8px] md:text-[10px]">6-Layer Proactive Interdiction Grid</p>
              <div className="h-1 w-16 md:w-24 bg-gradient-to-r from-[#3b82f6] to-[#f3d36b] mx-auto rounded-full mt-6 md:mt-8" />
           </div>

           <div className="space-y-32">
             {systemGroups.map((group, groupIdx) => (
               <div key={groupIdx} className="relative">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="w-px h-12 bg-gradient-to-b from-transparent via-white/20 to-transparent" />
                    <div className="flex items-center gap-4">
                        <group.icon size={20} style={{ color: group.color }} />
                        <h3 className="text-sm font-black tracking-[0.4em] uppercase" style={{ color: group.color }}>{group.category}</h3>
                    </div>
                    <div className="flex-1 h-px bg-white/5" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                    {group.modules.map((module, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        className="liquid-card p-8 md:p-10 group relative overflow-hidden cursor-target"
                      >
                        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity text-white">
                            <module.icon size={120} />
                        </div>
                        
                        <div className="flex justify-between items-start mb-8 md:mb-10">
                            <div 
                              className="w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border border-white/10 shadow-2xl" 
                              style={{ backgroundColor: `${module.accent}10` }}
                            >
                                <module.icon style={{ color: module.accent }} size={24} />
                            </div>
                            <div className="text-right">
                                <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest block mb-1">Grid_Status</span>
                                <span className="text-[9px] md:text-[10px] font-black text-green-500 uppercase tracking-widest">Linked</span>
                            </div>
                        </div>

                        <div className="mb-8 md:mb-10">
                            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em]" style={{ color: module.accent }}>{module.subtitle}</span>
                            <h3 className="text-xl md:text-2xl font-black mb-3 md:mb-4 tracking-tight text-white group-hover:text-white transition-colors">{module.title}</h3>
                            <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-medium">{module.desc}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4 mb-8 md:mb-10">
                            {module.metrics.map((metric, i) => (
                                <div key={i} className="px-3 py-2 rounded-xl bg-white/5 border border-white/5 text-[8px] md:text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                                    {metric}
                                </div>
                            ))}
                        </div>

                        <Link to={module.link} className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 text-gray-500 group-hover:text-white transition-colors cursor-target">
                            Initialize Engine <ArrowRight size={14} strokeWidth={3} className="group-hover:translate-x-1 transition-transform" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
               </div>
             ))}
           </div>
        </div>

        {/* Tactical Tactical Briefing */}
        <div className="mt-32 md:mt-64 mb-32 grid lg:grid-cols-2 gap-16 lg:gap-32 items-center">
            <div className="space-y-8 md:space-y-12 text-center lg:text-left px-4">
                <div className="inline-flex items-center gap-3 text-[#f3d36b] font-black uppercase tracking-[0.4em] text-[10px]">
                    <Lock size={12} /> Encrypted Infrastructure
                </div>
                <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                    Immune to the <br />
                    <span className="text-gradient-gold uppercase">Unseen.</span>
                </h2>
                <div className="space-y-8 md:space-y-10">
                    {[
                        { title: "Quantum-Safe Ledger", desc: "Hash anchors utilizing SHA-256 with decentralized verification." },
                        { title: "Passive Flow Sniffing", desc: "Non-invasive L3/L4 packet inspection for DGA pattern matching." },
                        { title: "Synthetic Artifact Hub", desc: "Real-time ViT analysis detecting deepfake micro-anomalies." }
                    ].map((item, i) => (
                        <div key={i} className="flex flex-col md:flex-row gap-6 md:gap-8 group cursor-target items-center md:items-start">
                            <div className="flex-shrink-0 w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-white group-hover:bg-[#f3d36b] group-hover:text-black transition-all">0{i+1}</div>
                            <div>
                                <h4 className="font-black text-base md:text-lg mb-2 uppercase tracking-tight">{item.title}</h4>
                                <p className="text-xs md:text-sm text-gray-500 font-medium leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="relative px-4">
                <div className="absolute inset-0 bg-[#3b82f6]/10 rounded-[3rem] blur-[100px] pointer-events-none" />
                <div className="liquid-glass p-1 rounded-[3rem]">
                    <div className="bg-[#020617] rounded-[2.8rem] p-6 md:p-10 font-mono overflow-hidden relative">
                        <div className="flex items-center justify-between mb-8 md:mb-10 border-b border-white/5 pb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-2 md:w-3 h-2 md:h-3 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[8px] md:text-[10px] font-black text-red-500 uppercase tracking-widest">Critical Alert Stream</span>
                            </div>
                            <span className="text-[8px] md:text-[9px] text-gray-700 uppercase tracking-widest font-black">Link: STABLE</span>
                        </div>
                        <div className="space-y-4 md:space-y-6 text-[9px] md:text-[11px] leading-relaxed">
                            <div className="flex gap-3 md:gap-4">
                                <span className="text-blue-500 font-bold">[SYS]</span>
                                <span className="text-gray-400">Initializing OSINT 4-Layer Pipeline...</span>
                            </div>
                            <div className="flex gap-3 md:gap-4">
                                <span className="text-[#f3d36b] font-bold">[ML]</span>
                                <span className="text-gray-400">XGBoost Weights: 0.894 Loaded.</span>
                            </div>
                            <div className="flex gap-3 md:gap-4 p-3 md:p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                                <span className="text-red-500 font-bold shrink-0">[THRT]</span>
                                <span className="text-red-400 break-all">DGA Pattern Detected: 0x2f...a1 [87.4%]</span>
                            </div>
                            <div className="flex gap-3 md:gap-4">
                                <span className="text-green-500 font-bold">[BC]</span>
                                <span className="text-gray-400">Anchor Verified: TX_4829...9281BC</span>
                            </div>
                            <div className="flex gap-3 md:gap-4">
                                <span className="text-blue-500 font-bold">[SYS]</span>
                                <span className="text-gray-400 italic">Disruption Protocol: STANDBY</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#020617] to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>

        {/* BOTTOM TECH CHIPS */}
        <div className="mt-32 flex flex-wrap justify-center gap-4 md:gap-8 opacity-40">
            {[
                { icon: Terminal, label: "Neural Bash" },
                { icon: Code, label: "Core v2.1" },
                { icon: Lock, label: "AES-256" },
                { icon: Server, label: "Edge Node" },
                { icon: Zap, label: "CUDA Link" }
            ].map((chip, i) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5">
                    <chip.icon size={12} className="text-[#f3d36b]" />
                    <span className="text-[8px] font-black uppercase tracking-[0.2em]">{chip.label}</span>
                </div>
            ))}
        </div>
      </div>

      <div className="mt-12 md:mt-24">
        <CurvedLoop 
          marqueeText="✦ DEFENSE ✦ GRID ✦ ACTIVE ✦ SECURED ✦ BY ✦ NEMESIS ✦"
          speed={1}
          curveAmount={-100}
          direction="right"
          className="curved-loop-text-outline"
        />
      </div>

      <Footer />
    </div>
  );
}

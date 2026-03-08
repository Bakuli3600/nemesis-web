import { motion } from 'framer-motion';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip } from 'recharts';
import { ShieldAlert, Activity, AlertTriangle, History, TrendingUp, Zap, Database, Fingerprint, Network, Search, Lock } from 'lucide-react';
import { useNemesisStore } from '../../store/useNemesisStore';

const mockAttackProbabilities = [
  { subject: 'Phishing', A: 78, fullMark: 100 },
  { subject: 'Credential Abuse', A: 45, fullMark: 100 },
  { subject: 'Deepfake Auth', A: 85, fullMark: 100 },
  { subject: 'Onion Intelligence', A: 92, fullMark: 100 },
  { subject: 'Domain Spoofing', A: 60, fullMark: 100 },
];

export default function OverviewTab() {
  const { activities, globalRiskScore, totalScans, threatsDetected, blockchainAnchors } = useNemesisStore();

  const stats = [
    { label: "Total Interrogations", val: totalScans, icon: Search, color: "#f3d36b" },
    { label: "Threats Neutralized", val: threatsDetected, icon: ShieldAlert, color: "#ef4444" },
    { label: "Blockchain Anchors", val: blockchainAnchors, icon: Database, color: "#3b82f6" },
    { label: "System Integrity", val: "99.9%", icon: Lock, color: "#10b981" }
  ];

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="h-px w-8 bg-[#f3d36b]" />
            <span className="text-[10px] font-black tracking-[0.4em] text-[#f3d36b] uppercase">NEMESIS COMMAND CENTRE</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase italic">Operational Oversight</h1>
          <p className="text-[#a0a0a0] font-medium mt-2 text-sm">Real-time neural telemetry and cryptographic proof-of-threat.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 scale-90">
            <div className="px-6 py-3 liquid-glass flex items-center gap-3 text-xs font-black uppercase tracking-widest border-white/5">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                Station: Bravo_01
            </div>
            <div className="px-6 py-3 liquid-glass flex items-center gap-3 text-xs font-black uppercase tracking-widest border-white/5 text-[#f3d36b]">
                <Zap size={14} /> Neural Link: Stable
            </div>
        </div>
      </header>

      {/* TOP STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
            <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="liquid-glass p-6 flex items-center gap-4 group cursor-target overflow-hidden"
            >
                <div className="w-10 h-10 shrink-0 rounded-2xl flex items-center justify-center bg-white/5 border border-white/10 group-hover:scale-110 transition-transform">
                    <stat.icon size={18} style={{ color: stat.color }} />
                </div>
                <div className="min-w-0">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-1 truncate">{stat.label}</p>
                    <p className="text-xl font-black text-white truncate">{stat.val}</p>
                </div>
            </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Global Risk Index */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass p-10 flex flex-col items-center justify-center relative min-h-[450px]"
        >
          <h2 className="text-xs font-black text-[#a0a0a0] mb-12 uppercase tracking-[0.3em]">Neural Threat Index</h2>
          <div className="relative w-56 h-56 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="50%" cy="50%" r="45%" className="stroke-white/5" strokeWidth="8" fill="none" />
              <motion.circle 
                cx="50%" cy="50%" r="45%" 
                className={`transition-all duration-1000 ${globalRiskScore > 70 ? 'stroke-red-500' : 'stroke-[#f3d36b]'}`} 
                strokeWidth="8" fill="none"
                strokeDasharray="283"
                initial={{ strokeDashoffset: 283 }}
                animate={{ strokeDashoffset: 283 - (283 * globalRiskScore) / 100 }}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-7xl font-black text-white">{globalRiskScore}</span>
              <div className="flex items-center gap-2 mt-2">
                <TrendingUp size={16} className={globalRiskScore > 70 ? 'text-red-400' : 'text-[#f3d36b]'} />
                <span className={`text-[10px] font-black uppercase tracking-widest ${globalRiskScore > 70 ? 'text-red-400' : 'text-[#f3d36b]'}`}>
                  {globalRiskScore > 70 ? 'CRITICAL' : 'ELEVATED'}
                </span>
              </div>
            </div>
          </div>
          <div className="mt-12 p-4 bg-white/[0.02] border border-white/5 rounded-2xl w-full text-center">
             <p className="text-[9px] text-gray-600 font-black uppercase tracking-widest leading-relaxed">
                Aggregated neural telemetry from {totalScans} unique interrogation vectors.
             </p>
          </div>
        </motion.div>

        {/* Tactical Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 liquid-glass p-10 flex flex-col h-[450px]"
        >
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-4">
                <History className="text-[#f3d36b]" size={20} />
                <h2 className="text-xs font-black text-[#a0a0a0] uppercase tracking-[0.3em]">Tactical Activity Buffer</h2>
            </div>
            <div className="px-3 py-1 bg-[#f3d36b]/10 border border-[#f3d36b]/20 rounded-full text-[9px] font-black text-[#f3d36b] uppercase tracking-[0.4em] animate-pulse">
                Neural_Stream
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-4 space-y-4 custom-scrollbar">
            {activities.length > 0 ? activities.map((item) => (
              <motion.div 
                key={item.id} 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex gap-6 p-6 liquid-card group cursor-target"
              >
                <div className="mt-1 shrink-0">
                  {item.type === 'threat' && <AlertTriangle className="w-5 h-5 text-red-500" />}
                  {item.type === 'blockchain' && <Database className="w-5 h-5 text-blue-400" />}
                  {item.type === 'honeypot' && <Fingerprint className="w-5 h-5 text-[#f3d36b]" />}
                  {item.type === 'scan' && <Zap className="w-5 h-5 text-green-500" />}
                  {item.type === 'intel' && <Activity className="w-5 h-5 text-purple-400" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-[#a0a0a0]">
                      [{item.type}]
                    </span>
                    <span className="text-[9px] text-gray-600 font-mono font-black uppercase">
                      {new Date(item.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-200 font-bold leading-relaxed">{item.msg}</p>
                </div>
              </motion.div>
            )) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-800">
                    <Activity className="w-16 h-16 mb-6 opacity-10 animate-pulse" />
                    <p className="text-xs font-black tracking-[0.4em] uppercase opacity-20">Interrogating Node Stream...</p>
                </div>
            )}
          </div>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
        {/* Deception Grid Monitor */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="liquid-glass p-10"
        >
          <div className="flex justify-between items-center mb-12">
            <div className="flex items-center gap-4">
                <Network className="text-[#f3d36b]" size={20} />
                <h2 className="text-xs font-black text-[#a0a0a0] uppercase tracking-[0.3em]">Neural Deception Grid</h2>
            </div>
            <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="w-2 h-2 rounded-full bg-white/10" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
             {[
                { label: 'Honey Persona: Exec-01', status: 'Standby', type: 'Email Decoy', risk: 12 },
                { label: 'Honey Persona: Admin-X', status: 'Active', type: 'LDAP Trap', risk: 84 },
                { label: 'Fake API Endpoint', status: 'Monitoring', type: 'Gateway Trap', risk: 42 },
                { label: 'Onion Mirror Trap', status: 'Intact', type: 'Hidden Service Decoy', risk: 5 }
             ].map((asset, i) => (
                <div key={i} className="p-6 liquid-card relative overflow-hidden group cursor-target">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <p className="text-sm text-white font-black uppercase mb-1">{asset.label}</p>
                            <span className="text-[9px] text-gray-500 font-black uppercase tracking-widest">{asset.type}</span>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${asset.status === 'Active' ? 'bg-red-500 animate-ping' : 'bg-gray-700'}`} />
                    </div>
                    <div className="flex justify-between items-end">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${
                            asset.status === 'Active' ? 'text-red-500' : 'text-gray-600'
                        }`}>{asset.status}</span>
                        <div className="text-right">
                            <span className="text-[8px] font-black text-gray-700 uppercase block">Risk_LVL</span>
                            <span className="text-lg font-black text-white">{asset.risk}%</span>
                        </div>
                    </div>
                </div>
             ))}
          </div>
        </motion.div>

        {/* Vector Radar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="liquid-glass p-10 flex flex-col h-full min-h-[450px]"
        >
          <h2 className="text-xs font-black text-[#a0a0a0] mb-12 uppercase tracking-[0.3em]">Interrogation Vector Probabilities</h2>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={mockAttackProbabilities}>
                <PolarGrid stroke="rgba(255,255,255,0.05)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: '#a0a0a0', fontSize: 10, fontWeight: 900 }} />
                <Radar name="Probability" dataKey="A" stroke="#f3d36b" fill="#f3d36b" fillOpacity={0.15} />
                <Tooltip 
                    contentStyle={{ 
                        backgroundColor: '#020617', 
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: '16px',
                        fontSize: '10px',
                        fontWeight: 'black',
                        color: '#fff',
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
                    }} 
                />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

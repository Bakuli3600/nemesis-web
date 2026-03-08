import { useState } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Activity, ShieldAlert, AlertCircle, CheckCircle2, Database, Search, Zap, Terminal } from 'lucide-react';
import { useNemesisStore } from '../../store/useNemesisStore';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function NetworkAnalysisTab() {
  const [isSniffing, setIsSniffing] = useState(false);
  const [packets, setPackets] = useState<any[]>([]);
  const addActivity = useNemesisStore((state) => state.addActivity);

  const saveResultToFirebase = async (data: any[]) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "network_results"), {
        uid: user.uid,
        userEmail: user.email,
        packetCount: data.length,
        anomalies: data.filter(p => p.info.includes('Suspicious')).length,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Error saving network result: ", e);
    }
  };

  const toggleSniffer = async () => {
    if (isSniffing) {
      setIsSniffing(false);
      return;
    }

    setIsSniffing(true);
    setPackets([]);
    
    try {
      const response = await fetch('http://172.25.73.161:8002/api/v1/start-network-scan', { method: 'POST' });
      const data = await response.json();
      
      if (data.success) {
        addActivity({
          type: 'scan',
          msg: 'Passive network sniffer initialized on Layer 3/4.'
        });
        
        let count = 0;
        const interval = setInterval(() => {
          if (count >= 10) {
            clearInterval(interval);
            setIsSniffing(false);
            saveResultToFirebase(data.data);
            return;
          }
          const p = data.data[count % data.data.length];
          setPackets(prev => [p, ...prev].slice(0, 20));
          count++;
        }, 1000);
      }
    } catch (error) {
      console.error(error);
      setIsSniffing(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase italic flex items-center gap-4">
            <Wifi className="text-[#f3d36b]" /> Traffic Flow Analysis
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
            Passive L3/L4 Packet Inspection & DGA Pattern Detection
          </p>
        </div>
        <div className="flex items-center gap-4 scale-90">
          <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl">
            <div className={`w-2 h-2 rounded-full ${isSniffing ? 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]' : 'bg-green-500'}`} />
            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Interface: {isSniffing ? 'Recording' : 'Standby'}
            </span>
          </div>
          <button 
            onClick={toggleSniffer}
            className={`px-8 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all shadow-xl cursor-target ${
              isSniffing 
                ? 'bg-red-500 text-white' 
                : 'bg-[#f3d36b] text-black hover:scale-[1.02]'
            }`}
          >
            {isSniffing ? 'Terminate' : 'Initialize'}
          </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="liquid-glass h-[650px] flex flex-col border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                <Terminal size={120} />
            </div>
            
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02] relative z-10">
              <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-3">
                <Activity size={16} className="text-[#f3d36b]" /> Live Neural Stream
              </h3>
              {isSniffing && (
                <div className="flex items-center gap-3">
                  <span className="text-[10px] text-red-500 font-black tracking-widest">RECORDING</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-3 font-mono text-[11px] custom-scrollbar relative z-10">
              {packets.length > 0 ? packets.map((p, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-6 py-3 px-5 liquid-card cursor-target bg-black/20"
                >
                  <span className="text-gray-600 font-bold">[{new Date().toLocaleTimeString()}]</span>
                  <span className="text-[#f3d36b] font-black w-12">{p.protocol}</span>
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-gray-300 truncate font-bold">{p.src}</span>
                    <span className="text-gray-700">→</span>
                    <span className="text-white truncate font-bold">{p.dst}</span>
                  </div>
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${p.info.includes('Suspicious') ? 'text-red-500' : 'text-gray-500'}`}>
                    {p.info}
                  </span>
                </motion.div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-20">
                  <Wifi className="w-20 h-20 mb-6 text-gray-700 animate-pulse" />
                  <p className="text-sm font-black tracking-[0.4em] uppercase">Awaiting Traffic Signal</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-10 relative z-10">
          <div className="liquid-glass p-8 border-white/5">
            <h4 className="text-[10px] font-black text-[#f3d36b] uppercase tracking-[0.3em] mb-10 flex items-center gap-3">
                <Database size={14} /> Capture Statistics
            </h4>
            <div className="space-y-6 font-mono">
              {[
                { label: 'Total Packets', val: packets.length },
                { label: 'DNS Vectors', val: packets.filter(p => p.protocol === 'DNS').length },
                { label: 'Anomaly Flags', val: packets.filter(p => p.info.includes('Suspicious')).length }
              ].map((m, i) => (
                <div key={i} className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">{m.label}</span>
                  <span className="text-sm font-black text-white">{m.val}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="liquid-glass p-8 border-white/5">
             <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                <Zap size={14} className="text-[#f3d36b]" /> Neural Inspection
             </h4>
             <p className="text-[10px] text-gray-600 font-bold uppercase tracking-tighter leading-relaxed">
                Passive monitoring of DNS query entropy to detect Domain Generation Algorithms (DGA).
             </p>
             <div className="mt-8 p-5 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest font-mono">THRESHOLD_VAL</span>
                <span className="text-xs font-black text-[#f3d36b] font-mono">4.20 E</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

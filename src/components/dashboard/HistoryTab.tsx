import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { History, Shield, Database, MessageSquare, Network, Wifi, Clock, ArrowRight } from 'lucide-react';

export default function HistoryTab() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const collections = [
          { name: 'deepfake_results', type: 'Deepfake' },
          { name: 'comm_analysis_results', type: 'Linguistic' },
          { name: 'breach_results', type: 'Breach' },
          { name: 'onion_audit_results', type: 'OSINT' },
          { name: 'network_results', type: 'Network' }
        ];

        let allResults: any[] = [];

        for (const coll of collections) {
          const q = query(
            collection(db, coll.name),
            where('uid', '==', user.uid),
            orderBy('timestamp', 'desc'),
            limit(10)
          );
          const snapshot = await getDocs(q);
          snapshot.forEach(doc => {
            allResults.push({ id: doc.id, ...doc.data(), entryType: coll.type });
          });
        }

        // Sort all results by timestamp
        allResults.sort((a, b) => {
          const tA = a.timestamp?.seconds || 0;
          const tB = b.timestamp?.seconds || 0;
          return tB - tA;
        });

        setHistory(allResults);
      } catch (e) {
        console.error("Error fetching history: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getIcon = (type: string) => {
    switch (type) {
      case 'Deepfake': return <Shield size={16} className="text-[#a855f7]" />;
      case 'Linguistic': return <MessageSquare size={16} className="text-[#3b82f6]" />;
      case 'Breach': return <Database size={16} className="text-[#ef4444]" />;
      case 'OSINT': return <Network size={16} className="text-[#f3d36b]" />;
      case 'Network': return <Wifi size={16} className="text-[#10b981]" />;
      default: return <History size={16} />;
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase italic flex items-center gap-4">
            <History className="text-[#f3d36b]" /> Mission History
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
            Immutable Log of Neural Interrogations & OSINT Extractions
          </p>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <History className="w-16 h-16 animate-spin mb-6" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Syncing History Grid...</p>
        </div>
      ) : history.length > 0 ? (
        <div className="grid gap-6">
          {history.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="liquid-glass p-6 flex items-center gap-8 group cursor-target hover:border-white/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {getIcon(item.entryType)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{item.entryType}</span>
                   <div className="w-1 h-1 rounded-full bg-gray-700" />
                   <span className="text-[9px] font-mono text-gray-600">
                      {item.timestamp?.toDate().toLocaleString() || 'Recent'}
                   </span>
                </div>
                <p className="text-sm text-white font-bold truncate">
                    {item.entryType === 'Deepfake' && `Scanned: ${item.fileName || 'Unknown File'}`}
                    {item.entryType === 'Linguistic' && `Analyzed Intent: ${item.primary_intent}`}
                    {item.entryType === 'Breach' && `Search Query: ${item.query}`}
                    {item.entryType === 'OSINT' && `Audited: ${item.target}`}
                    {item.entryType === 'Network' && `Captured ${item.packetCount} packets (${item.anomalies} anomalies)`}
                </p>
              </div>

              <div className="text-right shrink-0">
                 {item.label && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.label === 'Deepfake' ? 'text-red-500' : 'text-green-500'}`}>
                        {item.label}
                    </span>
                 )}
                 {item.maxRiskScore !== undefined && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.maxRiskScore > 70 ? 'text-red-500' : 'text-[#f3d36b]'}`}>
                        RISK: {item.maxRiskScore}%
                    </span>
                 )}
                 {item.riskScore !== undefined && (
                    <span className={`text-[10px] font-black uppercase tracking-widest ${item.riskScore > 60 ? 'text-red-500' : 'text-[#f3d36b]'}`}>
                        THREAT: {item.riskScore}%
                    </span>
                 )}
              </div>
              
              <ArrowRight className="text-gray-800 group-hover:text-[#f3d36b] transition-colors" size={20} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass p-32 flex flex-col items-center justify-center text-center opacity-30 border-white/5">
            <History className="w-16 h-16 text-gray-700 mb-6" />
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">No entries found in Neural Archive</p>
        </div>
      )}
    </div>
  );
}

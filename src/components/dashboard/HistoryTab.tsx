import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../supabaseClient';
import { History, Shield, Database, MessageSquare, Network, Wifi, ArrowRight, Clock } from 'lucide-react';

export default function HistoryTab() {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('intel_data')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;
        setHistory(data || []);
      } catch (e) {
        console.error("Error fetching mission history from Supabase: ", e);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getIcon = (source: string) => {
    const s = source.toLowerCase();
    if (s.includes('deepfake')) return <Shield size={16} className="text-[#a855f7]" />;
    if (s.includes('linguistic')) return <MessageSquare size={16} className="text-[#3b82f6]" />;
    if (s.includes('scraper') || s.includes('breach')) return <Database size={16} className="text-[#ef4444]" />;
    if (s.includes('onion') || s.includes('telegram')) return <Network size={16} className="text-[#f3d36b]" />;
    return <History size={16} className="text-gray-400" />;
  };

  const formatSource = (source: string) => {
    return source.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase italic flex items-center gap-4">
            <History className="text-[#f3d36b]" /> Mission History
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
            Immutable Supabase Log of Neural Interrogations & OSINT Extractions
          </p>
        </div>
        <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Supabase: Synchronized</span>
        </div>
      </header>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-40 opacity-20">
            <RefreshCw className="w-16 h-16 animate-spin mb-6 text-[#f3d36b]" />
            <p className="text-xs font-black uppercase tracking-[0.3em]">Querying Postgres Grid...</p>
        </div>
      ) : history.length > 0 ? (
        <div className="grid gap-6">
          {history.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="liquid-glass p-6 flex flex-col md:flex-row items-start md:items-center gap-8 group cursor-target hover:border-white/20 transition-all"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                {getIcon(item.source)}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                   <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{formatSource(item.source)}</span>
                   <div className="w-1 h-1 rounded-full bg-gray-700" />
                   <span className="text-[9px] font-mono text-gray-600 flex items-center gap-2">
                      <Clock size={10} /> {new Date(item.created_at).toLocaleString()}
                   </span>
                </div>
                <p className="text-sm text-white font-bold truncate mb-1">
                    Target: {item.target}
                </p>
                <p className="text-[11px] text-gray-500 font-medium line-clamp-1 opacity-80">
                    {item.content}
                </p>
              </div>

              <div className="text-right shrink-0 flex flex-col items-end gap-2">
                 <div className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${
                    item.risk_score > 70 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                    item.risk_score > 30 ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                    'bg-green-500/10 text-green-500 border-green-500/20'
                 }`}>
                    Risk: {item.risk_score}%
                 </div>
                 <span className="text-[8px] font-mono text-gray-700 uppercase tracking-tighter">ID: #{item.id}</span>
              </div>
              
              <ArrowRight className="hidden md:block text-gray-800 group-hover:text-[#f3d36b] transition-colors" size={20} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="liquid-glass p-32 flex flex-col items-center justify-center text-center opacity-30 border-white/5">
            <History className="w-16 h-16 text-gray-700 mb-6" />
            <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">No entries found in Supabase Archive</p>
        </div>
      )}
    </div>
  );
}

// Add missing RefreshCw import
import { RefreshCw } from 'lucide-react';

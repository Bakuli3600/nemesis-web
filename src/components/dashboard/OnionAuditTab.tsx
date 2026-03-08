import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, Zap, MessageSquare, LogIn, Activity, Network, RefreshCw, Clock, Shield, Cpu, Image as ImageIcon, FileText, Terminal, Target, Fingerprint
} from 'lucide-react';
import { useNemesisStore } from '../../store/useNemesisStore';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function OnionAuditTab() {
  const [onion, setOnion] = useState('');
  const [telegramChannel, setTelegramChannel] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'onion' | 'telegram'>('onion');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [torStatus, setTorStatus] = useState({ connected: false, port: null, mode: 'SIMULATION' });
  
  const addActivity = useNemesisStore((state) => state.addActivity);
  const incrementScans = useNemesisStore((state) => state.incrementScans);
  const incrementAnchors = useNemesisStore((state) => state.incrementAnchors);
  const incrementThreats = useNemesisStore((state) => state.incrementThreats);
  const [honeyPersona, setHoneyPersona] = useState<any>(null);

  const fetchPersona = async () => {
    try {
      const resp = await fetch('http://172.25.73.161:8002/api/v1/osint-deception-persona');
      const data = await resp.json();
      if (data.success) setHoneyPersona(data.persona);
    } catch (e) {}
  };

  useEffect(() => {
    fetchPersona();
    const checkTor = async () => {
      try {
        const resp = await fetch('http://172.25.73.161:8002/api/v1/tor-status');
        const data = await resp.json();
        setTorStatus(data);
      } catch (e) {
        setTorStatus({ connected: false, port: null, mode: 'ERROR' });
      }
    };
    checkTor();
    const interval = setInterval(checkTor, 10000);
    return () => clearInterval(interval);
  }, []);

  const saveResultToFirebase = async (data: any, target: string) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "onion_audit_results"), {
        uid: user.uid,
        userEmail: user.email,
        target: target,
        type: activeSubTab,
        riskScore: data.risk_score,
        classification: data.classification,
        blockchainTx: data.blockchain_tx,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Error saving onion result: ", e);
    }
  };

  const handleAudit = async () => {
    const target = activeSubTab === 'onion' ? onion : telegramChannel;
    if (!target) return;
    setIsScanning(true);
    setResult(null);

    try {
      const endpoint = activeSubTab === 'onion' ? 'onion-audit' : 'analyze-telegram';
      const body = activeSubTab === 'onion' ? { onion_address: target } : { channel: target };
      
      const response = await fetch(`http://172.25.73.161:8002/api/v1/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await response.json();
      
      if (data.success) {
        const payload = activeSubTab === 'onion' ? data.data : {
            ...data.data.ai_analysis,
            source_type: 'telegram',
            full_url: `https://t.me/s/${data.data.channel}`,
            timestamp: new Date().toLocaleString(),
            is_live: data.data.is_valid,
            risk_score: data.data.ai_analysis.confidence * 100, 
            content_findings: {
                visible_text: data.data.raw_text || data.data.ai_analysis.summary,
                image_tags: data.data.ai_analysis.neural_tags
            }
        };

        setResult(payload);
        setIsScanning(false);
        saveResultToFirebase(payload, target);

        incrementScans();
        incrementAnchors();
        if (payload.risk_score > 60) incrementThreats();

        addActivity({
          type: 'intel',
          msg: `OSINT [${activeSubTab.toUpperCase()}] Extraction completed for ${target.substring(0, 15)}...`
        });
      }
    } catch (error) {
      console.error(error);
      setIsScanning(false);
    }
  };

  const getRiskColor = (score: number) => {
    if (score < 30) return 'text-green-500';
    if (score < 60) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getRiskBg = (score: number) => {
    if (score < 30) return 'bg-green-500/10 border-green-500/20';
    if (score < 60) return 'bg-yellow-500/10 border-yellow-500/20';
    return 'bg-red-500/10 border-red-500/20';
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase italic flex items-center gap-4">
            <Network className="text-[#f3d36b]" /> OSINT Intelligence Grid
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
            Deep Multi-Domain Extraction: Tor | Telegram | Paste | Government
          </p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl scale-90">
          <div className={`w-2 h-2 rounded-full ${torStatus.connected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
            Gateway: {torStatus.connected ? `Live (${torStatus.port})` : 'Limited / Simulation'}
          </span>
        </div>
      </header>

      {/* DECEPTION: HONEY PERSONA */}
      {honeyPersona && (
        <div className="liquid-glass p-6 border-blue-500/20 bg-blue-500/5 flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-6">
              <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center border border-blue-500/30">
                 <LogIn className="text-blue-400" size={24} />
              </div>
              <div>
                 <span className="text-[9px] font-black text-blue-400 uppercase tracking-widest block mb-1">Active Honey Persona (Deception)</span>
                 <h4 className="text-sm font-black text-white uppercase tracking-wider">{honeyPersona.alias} • {honeyPersona.role}</h4>
              </div>
           </div>
           <div className="flex items-center gap-8">
              <div>
                 <span className="text-[8px] font-black text-gray-600 uppercase block mb-1">Primary Interest</span>
                 <span className="text-[10px] text-gray-300 font-bold">{honeyPersona.primary_interest}</span>
              </div>
              <button 
                onClick={fetchPersona}
                className="p-3 bg-white/5 border border-white/10 rounded-xl text-gray-400 hover:text-blue-400 hover:border-blue-400/30 transition-all"
              >
                <RefreshCw size={16} />
              </button>
           </div>
        </div>
      )}

      {/* SUB-TAB NAVIGATION */}
      <div className="flex gap-4 border-b border-white/5 pb-6">
         <button 
           onClick={() => { setActiveSubTab('onion'); setResult(null); }}
           className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeSubTab === 'onion' ? 'bg-[#f3d36b] text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
         >
            <Globe size={14} /> Dark Web Audit
         </button>
         <button 
           onClick={() => { setActiveSubTab('telegram'); setResult(null); }}
           className={`px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-3 ${activeSubTab === 'telegram' ? 'bg-[#f3d36b] text-black' : 'bg-white/5 text-gray-500 hover:text-white'}`}
         >
            <MessageSquare size={14} /> Telegram Intel
         </button>
      </div>

      {/* SEARCH INTERFACE */}
      <div className="liquid-glass p-8 border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
            {activeSubTab === 'onion' ? <Globe size={120} /> : <MessageSquare size={120} />}
        </div>
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <div className="flex-1 relative">
            <div className="absolute left-5 top-1/2 -translate-y-1/2 flex gap-3 text-gray-600">
                {activeSubTab === 'onion' ? <Globe size={18} /> : <MessageSquare size={18} />}
            </div>
            <input 
              type="text" 
              placeholder={activeSubTab === 'onion' ? "Target Onion Address..." : "Telegram @Channel or link..."}
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-[#f3d36b] font-mono font-bold placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f3d36b]/20 transition-all cursor-target"
              value={activeSubTab === 'onion' ? onion : telegramChannel}
              onChange={(e) => activeSubTab === 'onion' ? setOnion(e.target.value) : setTelegramChannel(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAudit()}
            />
          </div>
          <button 
            onClick={handleAudit}
            disabled={activeSubTab === 'onion' ? !onion || isScanning : !telegramChannel || isScanning}
            className="px-12 py-5 bg-[#f3d36b] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center gap-3 cursor-target disabled:opacity-50"
          >
            {isScanning ? (
              <><Zap className="animate-spin" size={18} /> {activeSubTab === 'onion' ? 'Neural Crawl...' : 'Neural Extraction...'}</>
            ) : (
              <><Activity size={18} /> {activeSubTab === 'onion' ? 'Audit Onion' : 'Extract Channel'}</>
            )}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {result ? (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* OVERVIEW CARD */}
            <div className="lg:col-span-2 space-y-8">
              <div className="liquid-glass p-10">
                <div className="flex justify-between items-start mb-10 border-b border-white/5 pb-8">
                  <div>
                    <span className="text-[10px] text-[#f3d36b] font-black uppercase tracking-[0.3em] mb-3 block">Extraction Source: {result.source_type || 'Unified OSINT'}</span>
                    <h3 className="text-lg font-mono font-bold break-all text-white/90 leading-relaxed max-w-xl">
                      {result.full_url || result.onion_address}
                    </h3>
                    <div className="flex gap-4 mt-4">
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase">
                            <Clock size={12} /> Scanned: {result.timestamp}
                        </div>
                        <div className="flex items-center gap-2 text-[9px] font-black text-gray-500 uppercase">
                            <Shield size={12} /> Link Status: {result.is_live ? <span className="text-green-500">Live & Reachable</span> : <span className="text-gray-600">Archived</span>}
                        </div>
                    </div>
                  </div>
                  <div className={`px-6 py-3 rounded-2xl border ${getRiskBg(result.risk_score)} flex flex-col items-center min-w-[120px]`}>
                    <span className="text-[8px] font-black uppercase text-gray-500 mb-1">Threat Index</span>
                    <span className={`text-2xl font-black ${getRiskColor(result.risk_score)}`}>{result.risk_score}%</span>
                  </div>
                </div>

                {/* NEURAL TAGS */}
                <div className="mb-10">
                    <h4 className="text-[9px] font-black text-gray-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <Zap size={12} className="text-[#f3d36b]" /> AI-Derived Neural Signatures
                    </h4>
                    <div className="flex flex-wrap gap-2">
                        {result.neural_tags && result.neural_tags.map((tag: string, i: number) => (
                            <span key={i} className="px-3 py-1 bg-[#f3d36b]/10 text-[#f3d36b] rounded-md text-[9px] font-black uppercase tracking-tighter border border-[#f3d36b]/20">
                                #{tag.replace(/\s+/g, '-').toLowerCase()}
                            </span>
                        ))}
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                  {/* AI INTELLIGENCE BRIEFING */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                        <Cpu size={14} className="text-[#f3d36b]" /> Tactical Briefing
                    </h4>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-xs font-bold text-gray-400">Verdict</span>
                            <span className="px-3 py-1 bg-white/5 text-white rounded-full text-[9px] font-black uppercase tracking-widest border border-white/10">
                                {result.classification}
                            </span>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed font-medium italic">
                            "{result.summary}"
                        </p>

                        <div className="mt-6 pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center text-[9px] font-black text-gray-500 uppercase">
                                <span>Analysis Confidence</span>
                                <span>{(result.confidence * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.confidence * 100}%` }}
                                    className="h-full bg-[#f3d36b]"
                                />
                            </div>
                        </div>
                    </div>
                  </div>

                  {/* VISUAL & OCR AUDIT */}
                  <div className="space-y-6">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] flex items-center gap-3">
                        <ImageIcon size={14} className="text-[#f3d36b]" /> Multi-Modal Visual Analysis
                    </h4>
                    <div className="bg-white/5 rounded-3xl p-6 border border-white/5 space-y-5">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Images/Media Found</span>
                            <span className="text-lg font-black text-white">{result.content_findings?.images_analyzed || 0}</span>
                        </div>
                        
                        <div className="space-y-2">
                            <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">OCR Visual Extraction</span>
                            <div className="bg-black/50 p-3 rounded-xl border border-white/5 max-h-[80px] overflow-y-auto">
                                <p className="text-[10px] text-gray-400 font-mono leading-relaxed italic">
                                    {result.content_findings?.ocr_text ? result.content_findings.ocr_text : "No visual text markers identified."}
                                </p>
                            </div>
                        </div>

                        {result.content_findings?.image_tags && result.content_findings.image_tags.length > 0 && (
                            <div className="space-y-2">
                                <span className="text-[9px] font-bold text-gray-500 uppercase tracking-widest">Visual Recognition Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    {result.content_findings.image_tags.map((tag: string, i: number) => (
                                        <span key={i} className="px-2 py-1 bg-purple-500/10 text-purple-400 rounded text-[8px] font-black uppercase tracking-widest border border-purple-500/20">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>

              {/* EXTRACTED ENTITIES */}
              {result.entities && (
                <div className="liquid-glass p-10 border-blue-500/10">
                   <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
                      <Fingerprint size={20} className="text-blue-400" /> Extracted High-Value Intelligence
                   </h4>
                   <div className="grid md:grid-cols-3 gap-6">
                      <div className="space-y-4">
                         <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-2">Target Emails</span>
                         {result.entities.emails.length > 0 ? result.entities.emails.map((e: string, i: number) => (
                            <div key={i} className="text-[10px] font-mono text-blue-400 truncate bg-white/5 p-2 rounded-lg">{e}</div>
                         )) : <span className="text-[9px] text-gray-700 italic">None detected</span>}
                      </div>
                      <div className="space-y-4">
                         <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-2">Onion Node-links</span>
                         {result.entities.onion_v3.length > 0 ? result.entities.onion_v3.map((o: string, i: number) => (
                            <div key={i} className="text-[10px] font-mono text-[#f3d36b] truncate bg-white/5 p-2 rounded-lg">{o}</div>
                         )) : <span className="text-[9px] text-gray-700 italic">None detected</span>}
                      </div>
                      <div className="space-y-4">
                         <span className="text-[9px] font-black text-gray-500 uppercase tracking-widest block border-b border-white/5 pb-2">Financial Vectors</span>
                         {result.entities.crypto_wallets.length > 0 ? result.entities.crypto_wallets.map((w: string, i: number) => (
                            <div key={i} className="text-[10px] font-mono text-green-400 truncate bg-white/5 p-2 rounded-lg">{w}</div>
                         )) : <span className="text-[9px] text-gray-700 italic">None detected</span>}
                      </div>
                   </div>
                </div>
              )}

              {/* RAW CONTENT INTELLIGENCE */}
              <div className="liquid-glass p-10">
                <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
                  <FileText size={20} className="text-[#f3d36b]" /> Raw Textual Intelligence
                </h4>
                <div className="bg-black/40 rounded-3xl p-8 border border-white/5">
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-4 text-[11px] font-mono text-gray-400 leading-relaxed whitespace-pre-wrap">
                        {result.content_findings?.visible_text || "No textual data extracted from target source."}
                    </div>
                </div>
              </div>

              {/* METADATA EXPLORER */}
              {result.metadata?.all_meta && Object.keys(result.metadata.all_meta).length > 0 && (
                <div className="liquid-glass p-10">
                    <h4 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-10 flex items-center gap-4">
                        <Terminal size={20} className="text-[#f3d36b]" /> Comprehensive Meta-Data Grid
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-h-[300px] overflow-y-auto pr-4 custom-scrollbar">
                        {Object.entries(result.metadata.all_meta).map(([key, val]: [string, any], i) => (
                            <div key={i} className="p-4 bg-white/5 rounded-xl border border-white/5 space-y-1">
                                <span className="text-[8px] font-black text-gray-500 uppercase truncate block">{key}</span>
                                <p className="text-[10px] text-white font-mono break-all">{String(val)}</p>
                            </div>
                        ))}
                    </div>
                </div>
              )}
            </div>

            {/* RIGHT SIDEBAR PANEL */}
            <div className="space-y-8">
                {/* RISK SCALE */}
                <div className={`liquid-glass p-8 border ${getRiskBg(result.risk_score)}`}>
                    <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8">Intelligence Verdict</h4>
                    <div className="flex flex-col items-center py-10 relative">
                        <div className="relative w-40 h-40 flex items-center justify-center">
                            <svg className="w-full h-full -rotate-90">
                                <circle 
                                    cx="80" cy="80" r="70" 
                                    className="fill-none stroke-white/5 stroke-[8]" 
                                />
                                <motion.circle 
                                    cx="80" cy="80" r="70" 
                                    className={`fill-none stroke-[8] ${result.risk_score > 60 ? 'stroke-red-500' : 'stroke-[#f3d36b]'}`}
                                    strokeDasharray="440"
                                    initial={{ strokeDashoffset: 440 }}
                                    animate={{ strokeDashoffset: 440 - (440 * result.risk_score) / 100 }}
                                    transition={{ duration: 1.5, ease: "easeOut" }}
                                />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className={`text-4xl font-black ${getRiskColor(result.risk_score)}`}>{result.risk_score}</span>
                                <span className="text-[8px] font-black text-gray-500 uppercase">Scale 0-100</span>
                            </div>
                        </div>
                        <div className="mt-8 text-center space-y-4">
                            <div className={`text-xs font-black uppercase tracking-[0.2em] ${getRiskColor(result.risk_score)}`}>
                                {result.risk_score > 80 ? 'CRITICAL THREAT' : (result.risk_score > 40 ? 'SUSPICIOUS ENTITY' : 'BENIGN DATA')}
                            </div>
                            <div className="p-4 bg-black/50 border border-white/5 rounded-xl">
                                <span className="text-[8px] font-black text-gray-500 uppercase block mb-1">Response Directive</span>
                                <span className="text-[10px] text-white font-bold">{result.recommended_action}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* TELEMETRY ANCHOR */}
                <div className="liquid-glass p-8 bg-gradient-to-br from-[#f3d36b]/5 to-transparent">
                    <div className="flex items-center gap-4 mb-6">
                        <Database size={20} className="text-[#f3d36b]" />
                        <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Ledger Verification</h4>
                    </div>
                    <div className="bg-black/60 p-4 rounded-xl border border-white/5 overflow-hidden">
                        <span className="text-[8px] font-mono text-gray-600 block mb-2">IMMUTABLE_HASH</span>
                        <code className="text-[9px] text-[#f3d36b] break-all font-mono">
                            {result.blockchain_tx}
                        </code>
                    </div>
                </div>
            </div>
          </motion.div>
        ) : (
          <div className="liquid-glass p-32 flex flex-col items-center justify-center text-center opacity-30 border-white/5">
             <div className="relative mb-10">
                <Target className="w-24 h-24 text-gray-700 animate-pulse" />
                <div className="absolute inset-0 bg-[#f3d36b]/5 blur-3xl rounded-full" />
             </div>
             <h2 className="text-xl font-black text-white uppercase tracking-[0.4em] mb-4">Neural Scan Idle</h2>
             <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs max-w-sm">
                Awaiting input from the OSINT Pipeline (Tor, Telegram, or Pasteboards) for multi-modal reasoning.
             </p>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

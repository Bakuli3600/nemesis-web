import { useState } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Zap, MessageSquare, Activity } from 'lucide-react';
import { useNemesisStore } from '../../store/useNemesisStore';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function LinguisticIntelTab() {
  const [text, setText] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const addActivity = useNemesisStore((state) => state.addActivity);
  const incrementScans = useNemesisStore((state) => state.incrementScans);
  const incrementAnchors = useNemesisStore((state) => state.incrementAnchors);
  const incrementThreats = useNemesisStore((state) => state.incrementThreats);

  const saveResultToFirebase = async (scanData: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "comm_analysis_results"), {
        uid: user.uid,
        userEmail: user.email,
        inputText: text,
        primary_intent: scanData.primary_intent,
        sentiment: scanData.sentiment,
        urgency_score: scanData.urgency_score,
        confidence: scanData.confidence,
        risk_flags: scanData.risk_flags,
        blockchainTx: scanData.blockchain_tx,
        timestamp: serverTimestamp()
      });
      console.log("Result saved to Firebase");
    } catch (e) {
      console.error("Error saving result: ", e);
    }
  };

  const handleScan = async () => {
    if (!text) return;
    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch(`http://172.25.73.161:8002/api/v1/analyze-nlp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      
      if (data.success) {
        setTimeout(async () => {
          setResult(data.data);
          setIsScanning(false);
          
          // Save to Firebase
          await saveResultToFirebase({ ...data.data, blockchain_tx: data.blockchain_tx });

          incrementScans();
          incrementAnchors();
          if (data.data.primary_intent !== 'SAFE' && data.data.confidence > 0.6) incrementThreats();

          addActivity({
            type: 'intel',
            msg: `Comm Analysis completed. Intent: ${data.data.primary_intent} (Confidence: ${(data.data.confidence * 100).toFixed(1)}%)`
          });
        }, 1200);
      }
    } catch (error) {
      console.error(error);
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase italic flex items-center gap-4">
            <MessageSquare className="text-[#f3d36b]" /> Linguistic Intelligence
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
            NLP-Based Intent Extraction & Deep Linguistic Threat Profiling
          </p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl scale-90">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Neural Engine: Linked</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
           <div className="liquid-glass p-0 overflow-hidden border-white/5 relative group">
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity pointer-events-none">
                  <Terminal size={120} />
              </div>
              <div className="px-6 py-4 bg-white/5 border-b border-white/5 flex items-center justify-between relative z-10">
                 <div className="flex items-center gap-3">
                    <Terminal size={16} className="text-[#f3d36b]" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Neural Stream Buffer</span>
                 </div>
                 <div className="flex gap-1">
                    <div className="w-2 h-2 rounded-full bg-[#f3d36b]/20" />
                    <div className="w-2 h-2 rounded-full bg-[#f3d36b]/50 animate-pulse" />
                 </div>
              </div>
              <textarea 
                className="w-full h-80 p-10 bg-transparent text-white text-base focus:outline-none resize-none font-medium placeholder:text-gray-800 relative z-10 font-mono"
                placeholder="Paste communication string for deep neural intent analysis..."
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
              <div className="p-6 flex justify-end bg-white/[0.02] border-t border-white/5 relative z-10">
                 <button 
                   onClick={handleScan}
                   disabled={!text || isScanning}
                   className="px-12 py-5 bg-[#f3d36b] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-all shadow-xl disabled:opacity-50 cursor-target"
                 >
                   {isScanning ? (
                    <><Zap className="animate-spin" size={18} /> Processing...</>
                   ) : (
                    <><Activity size={18} /> Execute Analysis</>
                   )}
                 </button>
              </div>
           </div>

           {result && (
             <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                <div className="liquid-glass p-10">
                   <h4 className="text-[10px] font-black text-[#f3d36b] uppercase tracking-[0.3em] mb-10">Linguistic Profile Verdict</h4>
                   <div className="flex flex-wrap gap-8">
                      <div className="flex flex-col gap-3">
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Primary Intent</p>
                         <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                            result.primary_intent === 'MALICIOUS' ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            result.primary_intent === 'SUSPICIOUS' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' : 
                            'bg-green-500/10 text-green-500 border-green-500/20'
                         }`}>
                            {result.primary_intent}
                         </div>
                      </div>
                      
                      <div className="flex flex-col gap-3">
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Suspicion Markers</p>
                         <div className="flex flex-wrap gap-2">
                            {result.risk_flags.length > 0 ? result.risk_flags.map((flag: string, i: number) => (
                               <span key={i} className="px-3 py-1.5 bg-red-500/10 text-red-500 border border-red-500/20 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                                  {flag}
                               </span>
                            )) : (
                               <span className="px-3 py-1.5 bg-green-500/10 text-green-500 border border-green-500/20 rounded-lg text-[9px] font-black uppercase tracking-tighter">
                                  No Anomalies
                               </span>
                            )}
                         </div>
                      </div>

                      <div className="flex flex-col gap-3">
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Urgency</p>
                         <div className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                            result.urgency_score > 0.7 ? 'bg-red-500/10 text-red-500 border-red-500/20' : 
                            'bg-white/5 text-gray-400 border-white/10'
                         }`}>
                            {result.urgency_score > 0.7 ? 'CRITICAL' : 'LOW'}
                         </div>
                      </div>

                      <div className="flex flex-col gap-3 ml-auto text-right">
                         <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Neural Confidence</p>
                         <div className="text-2xl font-black text-[#f3d36b]">{(result.confidence * 100).toFixed(0)}%</div>
                      </div>
                   </div>
                </div>

                {/* Tactical Analysis Summary */}
                <div className="liquid-glass p-10 bg-gradient-to-br from-red-500/[0.02] to-transparent">
                   <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em] mb-8 flex items-center gap-3">
                      <AlertOctagon size={14} className="text-red-500" /> Forensic Breakdown
                   </h4>
                   <p className="text-sm text-gray-300 leading-relaxed font-medium">
                      The neural engine has flagged this communication as <span className="text-white font-black italic">{result.primary_intent}</span> based on 
                      the detection of <span className="text-[#f3d36b] font-black">{result.risk_flags.join(', ') || 'no specific risk patterns'}</span>. 
                      Sentiment analysis indicates a <span className="text-white font-black">{result.sentiment}</span> tone with an urgency index of <span className="text-white font-black">{result.urgency_score.toFixed(2)}</span>.
                   </p>
                </div>
             </motion.div>
           )}
        </div>

        <div className="space-y-10">
           <div className="liquid-glass p-8 border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-[#f3d36b]/10 flex items-center justify-center">
                    <Zap className="text-[#f3d36b]" size={18} />
                </div>
                <h4 className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Model Metadata</h4>
              </div>
              <div className="space-y-6 text-[11px] font-bold uppercase tracking-widest text-gray-500">
                 <div className="flex justify-between py-3 border-b border-white/5">
                    <span>Provider</span>
                    <span className="text-white">Nemesis-NLP-v2</span>
                 </div>
                 <div className="flex justify-between py-3 border-b border-white/5">
                    <span>Hardware</span>
                    <span className="text-[#f3d36b]">CUDA_ACTIVE</span>
                 </div>
                 <div className="flex justify-between py-3">
                    <span>Latency</span>
                    <span className="text-white">420ms</span>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

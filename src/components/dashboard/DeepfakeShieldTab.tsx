import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, ShieldCheck, AlertOctagon, Loader2, Cpu, FileText, CheckCircle2, Video, Image as ImageIcon, Zap, Activity } from 'lucide-react';
import { useNemesisStore } from '../../store/useNemesisStore';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

export default function DeepfakeShieldTab() {
  const addActivity = useNemesisStore((state) => state.addActivity);
  const setGlobalRiskScore = useNemesisStore((state) => state.setGlobalRiskScore);
  const incrementScans = useNemesisStore((state) => state.incrementScans);
  const incrementThreats = useNemesisStore((state) => state.incrementThreats);
  const incrementAnchors = useNemesisStore((state) => state.incrementAnchors);
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileType, setFileType] = useState<'image' | 'video' | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [modelChoice, setModelChoice] = useState<'v2' | 'gemini'>('v2');

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setIsDragging(true);
    } else if (e.type === 'dragleave') {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const selected = e.dataTransfer.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setFileType(selected.type.startsWith('video/') ? 'video' : 'image');
      setResult(null);
    }
  };

  const [result, setResult] = useState<{ 
    label: string, 
    confidence: number, 
    tx: string,
    model_used?: string,
    breakdown?: { deepfake_score: number, realism_score: number },
    raw_results?: any[],
    forensic_details?: {
        risk_level: string;
        confidence_level: string;
        indicators: string[];
        summary: string;
    }
  } | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
      setFileType(selected.type.startsWith('video/') ? 'video' : 'image');
      setResult(null);
    }
  };

  const saveResultToFirebase = async (scanResult: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "deepfake_results"), {
        uid: user.uid,
        userEmail: user.email,
        fileName: file?.name,
        fileType: fileType,
        label: scanResult.label,
        confidence: scanResult.confidence,
        blockchainTx: scanResult.tx,
        modelUsed: scanResult.model_used,
        timestamp: serverTimestamp()
      });
      console.log("Result saved to Firebase");
    } catch (e) {
      console.error("Error saving result: ", e);
    }
  };

  const handleScan = async () => {
    if (!file) return;
    setIsScanning(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('model_choice', modelChoice);

    try {
      const response = await fetch(`http://172.25.73.161:8002/api/v1/scan-deepfake?model_choice=${modelChoice}`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      
      if (data.success) {
        setTimeout(async () => {
            const scanResult = {
              label: data.data.label,
              confidence: data.data.confidence,
              tx: data.blockchain_tx,
              model_used: data.data.model_used,
              breakdown: data.data.breakdown,
              raw_results: data.data.raw_results,
              forensic_details: data.data.forensic_details
            };
            
            setResult(scanResult);
            setIsScanning(false);
            
            // Save to Firebase
            await saveResultToFirebase(scanResult);
            
            // Real Tracking
            incrementScans();
            incrementAnchors();
            
            addActivity({
              type: 'scan',
              msg: `${fileType === 'video' ? 'Video' : 'Image'} scan completed: ${data.data.label} (${(data.data.confidence * 100).toFixed(1)}% confidence)`
            });
            
            if (data.data.label === 'Deepfake' || data.data.is_suspicious) {
              incrementThreats();
              addActivity({
                type: 'threat',
                msg: `High-risk synthetic content detected via ${data.data.model_used}`
              });
              setGlobalRiskScore(Math.floor(Math.random() * 20) + 75);
            }
        }, 1500);
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
            <ShieldCheck className="text-[#f3d36b]" /> Deepfake Shield
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
            Vision Transformers & Temporal Integrity Grid
          </p>
        </div>
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10 scale-90">
            <button 
                onClick={() => setModelChoice('v2')}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-target ${modelChoice === 'v2' ? 'bg-[#f3d36b] text-black' : 'text-gray-500 hover:text-white'}`}
            >
                Engine Sigma
            </button>
            <button 
                onClick={() => setModelChoice('gemini')}
                className={`px-6 py-2 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-3 cursor-target ${modelChoice === 'gemini' ? 'bg-[#a855f7] text-white' : 'text-gray-500 hover:text-white'}`}
            >
                ViT Elite Grid
            </button>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Upload Panel */}
        <div 
          className={`liquid-glass p-8 border-white/5 relative overflow-hidden group min-h-[500px] flex flex-col transition-all duration-300 ${isDragging ? 'border-[#f3d36b] bg-[#f3d36b]/5 scale-[1.01]' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Cpu size={120} />
          </div>
          <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,video/*" className="hidden" />
          
          <div className="relative z-10 flex-1 flex flex-col">
            {preview ? (
              <div className="relative w-full aspect-video rounded-2xl overflow-hidden mb-10 border border-white/10 group cursor-target shadow-2xl bg-black">
                {fileType === 'video' ? (
                  <video src={preview} className="w-full h-full object-contain" controls />
                ) : (
                  <img src={preview} alt="Preview" className="w-full h-full object-contain" />
                )}
                {isScanning && (
                  <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center backdrop-blur-md z-20">
                    <Loader2 className="w-12 h-12 text-[#f3d36b] animate-spin mb-4" />
                    <p className="text-white font-black tracking-[0.3em] text-xs uppercase animate-pulse">Neural Interrogation...</p>
                  </div>
                )}
              </div>
            ) : (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className={`w-full aspect-video flex flex-col items-center justify-center cursor-pointer bg-white/[0.02] hover:bg-white/[0.04] transition-all rounded-2xl mb-10 border-2 border-dashed ${isDragging ? 'border-[#f3d36b] bg-[#f3d36b]/10' : 'border-white/10'}`}
              >
                <div className="flex gap-4 mb-6">
                  <ImageIcon className={`w-12 h-12 transition-colors ${isDragging ? 'text-[#f3d36b]' : 'text-gray-700'}`} />
                  <Video className={`w-12 h-12 transition-colors ${isDragging ? 'text-[#f3d36b]' : 'text-gray-700'}`} />
                </div>
                <p className={`text-lg font-bold transition-colors ${isDragging ? 'text-white' : 'text-gray-400'}`}>
                  {isDragging ? 'Drop to Initialize' : 'Initialize Neural Analysis'}
                </p>
                <p className="text-gray-600 text-[10px] mt-2 uppercase font-black tracking-[0.2em]">Images & Videos &lt; 50MB</p>
              </div>
            )}

            <div className="flex gap-6 w-full mt-auto">
              <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 py-5 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white font-black transition-all border border-white/10 text-[10px] uppercase tracking-[0.2em] cursor-target"
                  disabled={isScanning}
              >
                  {preview ? 'Swap Source' : 'Find Media'}
              </button>
              <button 
                  onClick={handleScan}
                  disabled={!preview || isScanning}
                  className={`flex-1 py-5 px-6 rounded-2xl font-black transition-all text-[10px] uppercase tracking-[0.2em] shadow-xl cursor-target ${
                    !preview || isScanning 
                      ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                      : 'bg-[#f3d36b] text-black hover:scale-[1.02] active:scale-[0.98]'
                  }`}
              >
                  {isScanning ? (
                    <><Zap className="animate-spin" size={18} /> Analyzing...</>
                  ) : (
                    <><Activity size={18} /> Execute Audit</>
                  )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Panel */}
        <div className="space-y-8">
          <AnimatePresence>
            {result && (
              <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="liquid-glass p-10 h-full">
                <div className="flex justify-between items-start mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center">
                            {fileType === 'video' ? <Video className="text-[#f3d36b]" size={20} /> : <ImageIcon className="text-[#f3d36b]" size={20} />}
                        </div>
                        <div>
                            <h3 className="text-xl font-black text-white uppercase">Verdict</h3>
                            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1 block">Mode: {result.model_used || (fileType === 'video' ? 'ResNext50+LSTM' : 'ViT-B/16')}</span>
                        </div>
                    </div>
                    <div className={`px-4 py-1.5 text-[10px] font-black rounded-full uppercase tracking-[0.2em] ${
                        result.label === 'Deepfake' || result.label === 'Suspicious' ? 'bg-red-500/10 text-red-500 border border-red-500/20' : 'bg-green-500/10 text-green-500 border border-green-500/20'
                    }`}>
                        {result.label}
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-10 mb-12">
                    <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Integrity Score</p>
                        <p className={`text-5xl font-black ${result.label === 'Deepfake' || result.label === 'Suspicious' ? 'text-red-500' : 'text-green-500'} drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]`}>
                            {(result.confidence * 100).toFixed(1)}%
                        </p>
                    </div>
                    <div className="p-6 bg-white/[0.02] rounded-2xl border border-white/5">
                        <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-4">Neural Result</p>
                        <div className="flex items-center gap-3">
                            {result.label === 'Deepfake' || result.label === 'Suspicious' ? <AlertOctagon size={24} className="text-red-500" /> : <CheckCircle2 size={24} className="text-green-500" />}
                            <span className="text-sm font-black uppercase text-white tracking-widest">Valid</span>
                        </div>
                    </div>
                </div>

                {result.forensic_details && (
                    <div className="space-y-6 mb-12 bg-white/[0.02] p-6 rounded-2xl border border-white/5">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest border-b border-white/10 pb-2">Neural Forensic Analysis (ViT)</h4>
                        
                        <div className="space-y-4 text-sm text-gray-300">
                            <div>
                                <span className="font-bold text-[#f3d36b] uppercase text-[10px] tracking-widest block mb-1">Risk Level</span>
                                <span className="text-white">{result.forensic_details.risk_level} ({result.forensic_details.confidence_level} Confidence)</span>
                            </div>

                            <div>
                                <span className="font-bold text-[#f3d36b] uppercase text-[10px] tracking-widest block mb-1">Indicators Detected</span>
                                <ul className="list-disc list-inside pl-4 text-xs space-y-1">
                                    {result.forensic_details.indicators.map((indicator, idx) => (
                                        <li key={idx}>{indicator}</li>
                                    ))}
                                </ul>
                            </div>

                            <div>
                                <span className="font-bold text-[#f3d36b] uppercase text-[10px] tracking-widest block mb-1">Analysis Summary</span>
                                <p className="text-xs leading-relaxed opacity-80">{result.forensic_details.summary}</p>
                            </div>
                        </div>
                    </div>
                )}

                {fileType === 'video' && result.raw_results && !result.forensic_details && (
                    <div className="space-y-6 mb-12">
                        <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Class Probability Distribution</h4>
                        <div className="space-y-4">
                            {result.raw_results.map((res, i) => (
                                <div key={i}>
                                    <div className="flex justify-between text-[9px] font-black mb-2 uppercase tracking-[0.2em] text-gray-400">
                                        <span>{res.label}</span>
                                        <span>{(res.score * 100).toFixed(1)}%</span>
                                    </div>
                                    <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div 
                                            initial={{ width: 0 }}
                                            animate={{ width: `${res.score * 100}%` }}
                                            className={`h-full ${res.label === 'Deepfake' || res.label === 'LABEL_1' ? 'bg-red-500' : 'bg-green-500'}`}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {!result.raw_results && result.breakdown && (
                    <div className="space-y-8 mb-12">
                        <div>
                            <div className="flex justify-between text-[10px] font-black mb-3 uppercase tracking-[0.2em] text-gray-400">
                                <span>Artifact Probability</span>
                                <span>{(result.breakdown.deepfake_score * 100).toFixed(1)}%</span>
                            </div>
                            <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div 
                                    initial={{ width: 0 }}
                                    animate={{ width: `${result.breakdown.deepfake_score * 100}%` }}
                                    className={`h-full ${result.breakdown.deepfake_score > 0.5 ? 'bg-red-500' : 'bg-[#f3d36b]'}`}
                                />
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-10">
                    <div className="p-6 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <LinkIcon className="w-5 h-5 text-gray-600" />
                        <div>
                            <span className="text-[9px] font-black text-gray-500 uppercase tracking-[0.2em] block mb-1">Blockchain Hash</span>
                            <p className="text-[10px] text-gray-400 break-all font-mono font-bold uppercase opacity-60">
                                TX_{result.tx.substring(0, 20)}...
                            </p>
                        </div>
                    </div>
                    <div className="text-[9px] font-black text-[#f3d36b] uppercase tracking-widest shrink-0 ml-4">Verified</div>
                    </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!result && !isScanning && (
            <div className="liquid-glass p-16 h-full flex flex-col items-center justify-center text-center opacity-30 border-white/5 min-h-[500px]">
               <ShieldCheck className="w-16 h-16 text-gray-700 mb-6" />
               <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">Awaiting Neural Linkage</p>
               <div className="mt-8 p-4 border border-white/5 rounded-2xl bg-white/5">
                  <p className="text-[9px] text-gray-600 uppercase font-black tracking-widest leading-relaxed">
                    System supports MP4, MOV, JPG, and PNG formats. <br/> Maximum payload: 50MB.
                  </p>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

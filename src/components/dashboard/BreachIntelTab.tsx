import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Database, ShieldAlert, AlertTriangle, Fingerprint, ExternalLink, ShieldCheck, Mail, Globe, Lock, FileText, Activity, ChevronRight, AlertOctagon, Brain, Server, Target, Layout } from 'lucide-react';
import { useNemesisStore } from '../../store/useNemesisStore';
import { db, auth } from '../../firebase/firebaseConfig';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

type TabType = 'correlation' | 'breaches' | 'exposures' | 'darkweb' | 'osint' | 'leaks' | 'deep-analysis';

export default function BreachIntelTab() {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<TabType>('correlation');
  const [scrapedContent, setScrapedContent] = useState('');
  const [deepAnalysisReport, setDeepAnalysisReport] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scrapeUrl, setScrapeUrl] = useState('');
  const [waitTime, setWaitTime] = useState(30);
  const addActivity = useNemesisStore((state) => state.addActivity);

  const handleSeleniumScrape = async (customUrl?: string) => {
    const targetUrl = customUrl || scrapeUrl;
    if (!targetUrl || !query) return;
    setIsAnalyzing(true);
    setDeepAnalysisReport(null);

    try {
      const response = await fetch(`http://172.25.73.161:8002/api/v1/selenium-scrape-breach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: targetUrl, target: query, wait_time: waitTime })
      });
      const data = await response.json();
      if (data.success) {
        setDeepAnalysisReport(data.report);
        addActivity({
          type: 'intel',
          msg: `Selenium Intelligence Extraction completed for: ${targetUrl}`
        });
      }
    } catch (error) {
      console.error("Selenium scrape failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const intelligenceSources = [
    { name: 'HIBP', url: `https://haveibeenpwned.com/`, color: 'text-red-400' },
    { name: 'DeHashed', url: `https://www.dehashed.com/search?query=${query}`, color: 'text-blue-400' },
    { name: 'Intel X', url: `https://intelx.io/?s=${query}`, color: 'text-purple-400' },
    { name: 'URLScan', url: `https://urlscan.io/search/#${query}`, color: 'text-green-400' },
    { name: 'Pulsedive', url: `https://pulsedive.com/indicator/?q=${query}`, color: 'text-orange-400' },
    { name: 'Shodan', url: `https://www.shodan.io/search?query=${query}`, color: 'text-yellow-400' },
    { name: 'Pastebin', url: `https://pastebin.com/search?q=${query}`, color: 'text-gray-400' }
  ];

  const handleDeepAnalysis = async () => {
    if (!scrapedContent || !query) return;
    setIsAnalyzing(true);
    setDeepAnalysisReport(null);

    try {
      const response = await fetch(`http://172.25.73.161:8002/api/v1/analyze-scraped-breach`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: query, content: scrapedContent })
      });
      const data = await response.json();
      if (data.success) {
        setDeepAnalysisReport(data.report);
        addActivity({
          type: 'intel',
          msg: `Deep Intelligence Analysis completed for: ${query}`
        });
      }
    } catch (error) {
      console.error("Deep analysis failed:", error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const saveResultToFirebase = async (data: any) => {
    try {
      const user = auth.currentUser;
      if (!user) return;

      await addDoc(collection(db, "breach_results"), {
        uid: user.uid,
        userEmail: user.email,
        query: query,
        maxRiskScore: data.summary.max_risk_score,
        totalBreaches: data.summary.total_breaches_found,
        timestamp: serverTimestamp()
      });
    } catch (e) {
      console.error("Error saving breach result: ", e);
    }
  };

  const handleSearch = async () => {
    if (!query) return;
    setIsSearching(true);
    setResults(null);

    try {
      const response = await fetch(`http://172.25.73.161:8002/api/v1/search-breaches?query=${encodeURIComponent(query)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data);
        saveResultToFirebase(data);
        addActivity({
          type: 'intel',
          msg: `Neural Correlation performed for: ${query} (Risk: ${data.summary.max_risk_score}%)`
        });
      }
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const tabs: { id: TabType; label: string; icon: any }[] = [
    { id: 'correlation', label: 'AI Correlation', icon: Brain },
    { id: 'breaches', label: 'Verified Breaches', icon: Lock },
    { id: 'exposures', label: 'Exposures', icon: Mail },
    { id: 'darkweb', label: 'Dark Web', icon: Globe },
    { id: 'osint', label: 'OSINT Signals', icon: Activity },
    { id: 'leaks', label: 'Leak Indexes', icon: Database },
    { id: 'deep-analysis', label: 'Deep Analysis', icon: Fingerprint }
  ];

  return (
    <div className="space-y-10">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-white mb-2 uppercase italic flex items-center gap-4">
            <Database className="text-[#f3d36b]" /> breached one
          </h1>
          <p className="text-gray-500 font-bold uppercase tracking-[0.2em] text-[8px]">
            Unified Threat Correlation & Predictive Breach Analysis
          </p>
        </div>
        <div className="flex items-center gap-4 px-6 py-3 bg-white/5 border border-white/10 rounded-2xl scale-90">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Correlation Engine: ONLINE</span>
        </div>
      </header>

      {/* SEARCH INTERFACE */}
      <div className="liquid-glass p-8 border-white/5 relative overflow-hidden group">
        <div className="flex flex-col md:flex-row gap-6 relative z-10">
          <div className="flex-1 relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search Target (e.g. company.com or email hash)"
              className="w-full bg-black/40 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-[#f3d36b] font-mono font-bold placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f3d36b]/20 transition-all cursor-target"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <button 
            onClick={handleSearch}
            disabled={!query || isSearching}
            className="px-12 py-5 bg-[#f3d36b] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center gap-3 cursor-target disabled:opacity-50"
          >
            {isSearching ? 'Correlating...' : 'Execute Protocol'}
          </button>
        </div>
      </div>

      {(results || activeTab === 'deep-analysis') && (
        <div className="space-y-10">
          {/* TAB NAVIGATION */}
          <div className="flex flex-wrap gap-4 border-b border-white/5 pb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-6 py-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all ${
                  activeTab === tab.id ? 'bg-[#f3d36b] text-black' : 'bg-white/5 text-gray-500 hover:text-white'
                }`}
              >
                <tab.icon size={14} /> {tab.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeTab === 'correlation' && results && (
              <motion.div key="correlation" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="liquid-glass p-8 flex flex-col items-center border-white/5">
                    <Target className="w-10 h-10 text-[#f3d36b] mb-4" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Correlation Risk</p>
                    <h2 className="text-5xl font-black text-white">{results.summary.max_risk_score}%</h2>
                  </div>
                  <div className="liquid-glass p-8 flex flex-col items-center border-white/5">
                    <ShieldAlert className="w-10 h-10 text-red-500 mb-4" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Threat Level</p>
                    <h2 className={`text-3xl font-black ${results.summary.max_risk_score > 75 ? 'text-red-500' : 'text-orange-500'}`}>
                      {results.summary.max_risk_score > 75 ? 'CRITICAL' : results.summary.max_risk_score > 40 ? 'HIGH' : 'MEDIUM'}
                    </h2>
                  </div>
                  <div className="liquid-glass p-8 flex flex-col items-center border-white/5">
                    <Server className="w-10 h-10 text-blue-500 mb-4" />
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Source Hits</p>
                    <h2 className="text-5xl font-black text-white">
                      {results.summary.total_breaches_found + results.summary.darkweb_mentions + (results.results.external_signals?.length || 0)}
                    </h2>
                  </div>
                </div>

                <div className="liquid-glass p-10 border-white/5 bg-gradient-to-br from-[#f3d36b]/5 to-transparent">
                  <div className="flex items-center gap-4 mb-8">
                    <Brain className="text-[#f3d36b]" size={24} />
                    <h3 className="text-sm font-black text-white uppercase tracking-widest italic">AI Neural Analysis Summary</h3>
                  </div>
                  <div className="grid md:grid-cols-2 gap-12">
                    {results.results.ai_intelligence && results.results.ai_intelligence[0] ? (
                      <>
                        <div>
                          <p className="text-lg text-white font-bold mb-4 leading-relaxed">{results.results.ai_intelligence[0].summary}</p>
                          <p className="text-sm text-gray-400 leading-relaxed mb-6">{results.results.ai_intelligence[0].impact}</p>
                        </div>
                        <div className="p-8 bg-black/40 rounded-3xl border border-white/5">
                           <p className="text-[10px] font-black text-[#f3d36b] uppercase tracking-widest mb-6">Mitigation Roadmap</p>
                           <ul className="space-y-4">
                              {results.results.ai_intelligence[0].countermeasures.map((cm: string, i: number) => (
                                <li key={i} className="flex items-start gap-4 text-xs text-gray-300">
                                  <ChevronRight className="text-[#f3d36b] mt-0.5 shrink-0" size={14} />
                                  <span>{cm}</span>
                                </li>
                              ))}
                           </ul>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 text-center py-10 opacity-30 italic">No Deep AI Intelligence available for this target yet.</div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'deep-analysis' && (
              <motion.div key="deep-analysis" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                
                {/* INTELLIGENCE LAUNCHPAD */}
                <div className="liquid-glass p-8 border-white/5">
                  <div className="flex items-center gap-4 mb-8">
                    <Activity className="text-[#f3d36b]" size={20} />
                    <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">NEMESIS Intelligence Launchpad</h3>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                    {intelligenceSources.map((source) => (
                      <button
                        key={source.name}
                        onClick={() => handleSeleniumScrape(source.url)}
                        disabled={!query || isAnalyzing}
                        className="flex flex-col items-center justify-center p-4 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-[#f3d36b]/30 transition-all group disabled:opacity-30"
                      >
                        <span className={`text-[10px] font-black uppercase tracking-widest mb-2 ${source.color}`}>{source.name}</span>
                        <ExternalLink size={14} className="text-gray-600 group-hover:text-white transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                   {/* SELENIUM AUTOMATION */}
                  <div className="liquid-glass p-8 border-white/5 bg-blue-500/5">
                    <div className="flex items-center gap-4 mb-6">
                      <Globe className="text-blue-400" size={20} />
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Selenium Source Interrogation</h3>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <p className="text-[9px] text-gray-500 mb-2 font-black uppercase">Target Source URL</p>
                        <input 
                          type="text"
                          placeholder="https://breach-site.com/search?q=target"
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-blue-400 focus:outline-none focus:border-blue-500/50 transition-all"
                          value={scrapeUrl}
                          onChange={(e) => setScrapeUrl(e.target.value)}
                        />
                      </div>
                      <div>
                        <p className="text-[9px] text-gray-500 mb-2 font-black uppercase">Interaction Window (Seconds)</p>
                        <input 
                          type="number"
                          className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-xs font-mono text-white focus:outline-none"
                          value={waitTime}
                          onChange={(e) => setWaitTime(parseInt(e.target.value))}
                        />
                      </div>
                      <button 
                        onClick={handleSeleniumScrape}
                        disabled={!scrapeUrl || !query || isAnalyzing}
                        className="w-full py-4 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] font-black text-blue-400 uppercase tracking-widest hover:bg-blue-500 hover:text-white transition-all disabled:opacity-30"
                      >
                        {isAnalyzing ? 'Initializing Driver...' : 'Launch Automated Scraper'}
                      </button>
                    </div>
                  </div>

                  {/* MANUAL PASTE */}
                  <div className="liquid-glass p-8 border-white/5">
                    <div className="flex items-center gap-4 mb-6">
                      <Fingerprint className="text-[#f3d36b]" size={20} />
                      <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Manual Data Injection</h3>
                    </div>
                    <textarea 
                      className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-[10px] font-mono text-gray-300 focus:outline-none focus:ring-1 focus:ring-[#f3d36b]/30 transition-all mb-4 resize-none"
                      placeholder="Paste Raw Scraped Text/Tables"
                      value={scrapedContent}
                      onChange={(e) => setScrapedContent(e.target.value)}
                    />
                    <button 
                      onClick={handleDeepAnalysis}
                      disabled={!scrapedContent || !query || isAnalyzing}
                      className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black text-[#f3d36b] uppercase tracking-widest hover:bg-[#f3d36b] hover:text-black transition-all disabled:opacity-30"
                    >
                      {isAnalyzing ? 'Analyzing Neural Patterns...' : 'Execute Manual Analysis'}
                    </button>
                  </div>
                </div>

                {deepAnalysisReport && (
                  <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="liquid-glass p-10 border-[#f3d36b]/20 bg-[#f3d36b]/5 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                       <ShieldAlert size={120} className="text-[#f3d36b]" />
                    </div>
                    <div className="flex items-center justify-between mb-8 border-b border-[#f3d36b]/20 pb-6 relative z-10">
                      <h4 className="text-lg font-black text-[#f3d36b] uppercase italic flex items-center gap-3">
                        <ShieldAlert /> Neural Intelligence Report
                      </h4>
                      <div className="flex gap-4">
                        <div className="px-4 py-2 bg-black/40 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest border border-white/5">
                          Status: ANALYST_VERIFIED
                        </div>
                      </div>
                    </div>
                    <pre className="whitespace-pre-wrap font-mono text-xs text-gray-300 leading-relaxed relative z-10 p-6 bg-black/20 rounded-2xl border border-white/5">
                      {deepAnalysisReport}
                    </pre>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeTab === 'breaches' && results && (
              <motion.div key="breaches" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
                {results.results.breaches.length > 0 ? results.results.breaches.map((b: any, i: number) => (
                  <div key={i} className="liquid-glass p-6 border-white/5 hover:border-blue-500/20 transition-all">
                    <h4 className="text-lg font-black text-white mb-2">{b.company}</h4>
                    <div className="flex gap-4 text-[10px] font-black text-gray-500 uppercase mb-4">
                      <span>{b.year}</span>
                      <span>{b.breach_type}</span>
                      <span className="text-blue-500">{b.records_exposed.toLocaleString()} Records</span>
                    </div>
                    <div className="px-3 py-1 bg-white/5 rounded-lg text-[9px] font-bold text-gray-400 inline-block">
                      VERIFICATION: {b.verification_status}
                    </div>
                  </div>
                )) : <div className="col-span-2 text-center py-20 opacity-30 italic">No verified breaches found for this vector.</div>}
              </motion.div>
            )}

            {activeTab === 'exposures' && (
              <motion.div key="exposures" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-3 gap-4">
                {results.results.exposures.length > 0 ? results.results.exposures.map((e: any, i: number) => (
                  <div key={i} className="p-5 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-[9px] font-mono text-[#f3d36b] mb-2 truncate">{e.email_hash}</p>
                    <p className="text-xs font-bold text-white mb-3">{e.domain}</p>
                    <div className="flex justify-between items-center text-[8px] font-black uppercase tracking-widest text-gray-500">
                      <span>{e.exposure_source}</span>
                      <span className="text-red-500">{e.risk_score}%</span>
                    </div>
                  </div>
                )) : <div className="col-span-3 text-center py-20 opacity-30 italic">No credential exposure signals detected.</div>}
              </motion.div>
            )}

            {activeTab === 'darkweb' && (
              <motion.div key="darkweb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {results.results.mentions.length > 0 ? results.results.mentions.map((m: any, i: number) => (
                  <div key={i} className="liquid-glass p-6 border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black text-red-500 uppercase tracking-widest block mb-1">{m.forum_name}</span>
                      <h4 className="text-sm font-black text-white uppercase">{m.topic.replace('_', ' ')}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{m.actor_reputation} Actor • {m.date}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-xs font-black text-red-500 mb-1">THREAT: {m.threat_score}</p>
                       <p className="text-[9px] text-gray-600 font-bold uppercase">${m.price_usd} LISTING</p>
                    </div>
                  </div>
                )) : <div className="text-center py-20 opacity-30 italic">No Dark Web chatter detected for this target.</div>}
              </motion.div>
            )}

            {activeTab === 'osint' && (
              <motion.div key="osint" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                {results.results.external_signals && results.results.external_signals.length > 0 ? results.results.external_signals.map((s: any, i: number) => (
                  <div key={i} className="liquid-glass p-6 border-white/5 flex justify-between items-center">
                    <div>
                      <span className="text-[9px] font-black text-[#f3d36b] uppercase tracking-widest block mb-1">{s.source}</span>
                      <h4 className="text-sm font-black text-white uppercase">{s.signal.replace('_', ' ')}</h4>
                      <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">{s.type} • {s.date}</p>
                      <p className="text-[9px] text-gray-400 mt-2 italic">{s.details}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-lg font-black text-red-500 mb-1">{s.risk_score}%</p>
                       <p className="text-[9px] text-gray-600 font-bold uppercase">RISK LEVEL</p>
                    </div>
                  </div>
                )) : <div className="text-center py-20 opacity-30 italic">No external OSINT exposure signals found.</div>}
              </motion.div>
            )}

            {activeTab === 'leaks' && (
              <motion.div key="leaks" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid md:grid-cols-2 gap-6">
                {results.results.leaks.length > 0 ? results.results.leaks.map((l: any, i: number) => (
                  <div key={i} className="liquid-glass p-6 border-white/5">
                    <h4 className="text-sm font-black text-white mb-2">{l.name}</h4>
                    <p className="text-[10px] text-gray-500 uppercase mb-4">{l.format} • {l.size_mb} MB</p>
                    <div className="flex items-center gap-3 text-blue-400 text-[10px] font-mono truncate">
                      <ExternalLink size={12} /> {l.magnet_link}
                    </div>
                  </div>
                )) : <div className="col-span-2 text-center py-20 opacity-30 italic">No data leak archives indexed.</div>}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {!results && !isSearching && (
        <div className="liquid-glass p-32 flex flex-col items-center justify-center text-center opacity-30 border-white/5">
           <Layout className="w-20 h-20 mb-8 text-gray-700 animate-pulse" />
           <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-xs">Waiting for Target Correlation Key</p>
        </div>
      )}
    </div>
  );
}

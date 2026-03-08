import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, Shield, MessageSquare, 
  Database, Network, Wifi, History, 
  ChevronRight, Layout, Zap, Activity 
} from 'lucide-react';

// Import Tabs
import OverviewTab from '../components/dashboard/OverviewTab';
import DeepfakeShieldTab from '../components/dashboard/DeepfakeShieldTab';
import LinguisticIntelTab from '../components/dashboard/LinguisticIntelTab';
import BreachIntelTab from '../components/dashboard/BreachIntelTab';
import OnionAuditTab from '../components/dashboard/OnionAuditTab';
import NetworkAnalysisTab from '../components/dashboard/NetworkAnalysisTab';
import HistoryTab from '../components/dashboard/HistoryTab';

type DashboardTab = 'overview' | 'deepfake' | 'linguistic' | 'breach' | 'osint' | 'network' | 'history';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');

  const tabs: { id: DashboardTab; label: string; icon: any; color: string }[] = [
    { id: 'overview', label: 'Command Hub', icon: LayoutDashboard, color: '#f3d36b' },
    { id: 'deepfake', label: 'Deepfake Shield', icon: Shield, color: '#a855f7' },
    { id: 'linguistic', label: 'Linguistic Intel', icon: MessageSquare, color: '#3b82f6' },
    { id: 'breach', label: 'Breach Intel', icon: Database, color: '#ef4444' },
    { id: 'osint', label: 'OSINT Grid', icon: Network, color: '#f3d36b' },
    { id: 'network', label: 'Traffic Analysis', icon: Wifi, color: '#10b981' },
    { id: 'history', label: 'Mission History', icon: History, color: '#6366f1' },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-120px)]">
      {/* Sidebar Navigation */}
      <aside className="lg:w-72 space-y-2 shrink-0">
        <div className="p-6 mb-6 bg-white/[0.02] border border-white/5 rounded-3xl">
           <div className="flex items-center gap-3 mb-4">
              <div className="w-2 h-2 rounded-full bg-[#f3d36b] animate-pulse" />
              <span className="text-[10px] font-black text-[#f3d36b] uppercase tracking-widest">System Active</span>
           </div>
           <h2 className="text-xl font-black text-white uppercase italic">Command</h2>
           <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter mt-1">NEMESIS_v1_BETA_NODE</p>
        </div>

        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-300 group cursor-target ${
                activeTab === tab.id 
                  ? 'bg-white/5 border border-white/10 text-white shadow-xl shadow-black/20' 
                  : 'text-gray-500 hover:text-gray-300 hover:bg-white/[0.02]'
              }`}
            >
              <tab.icon 
                size={18} 
                className="transition-transform group-hover:scale-110" 
                style={{ color: activeTab === tab.id ? tab.color : 'currentColor' }} 
              />
              <span className="text-[10px] font-black uppercase tracking-widest">{tab.label}</span>
              {activeTab === tab.id && (
                <motion.div layoutId="active-pill" className="ml-auto w-1 h-4 rounded-full" style={{ backgroundColor: tab.color }} />
              )}
            </button>
          ))}
        </nav>

        <div className="mt-12 p-6 bg-black/40 rounded-3xl border border-white/5">
           <div className="flex items-center gap-3 text-[9px] font-black text-gray-600 uppercase tracking-widest mb-4">
              <Zap size={12} /> Neural Status
           </div>
           <div className="space-y-4">
              <div className="flex justify-between items-center text-[8px] font-black uppercase text-gray-400">
                 <span>Synapse Load</span>
                 <span className="text-green-500">Normal</span>
              </div>
              <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                 <div className="w-[34%] h-full bg-green-500" />
              </div>
           </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 bg-white/[0.01] border border-white/5 rounded-[40px] p-8 md:p-12 relative overflow-hidden">
         {/* Background Subtle Elements */}
         <div className="absolute top-0 right-0 p-20 opacity-[0.02] pointer-events-none">
            <LayoutDashboard size={400} />
         </div>

         <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="relative z-10"
            >
              {activeTab === 'overview' && <OverviewTab />}
              {activeTab === 'deepfake' && <DeepfakeShieldTab />}
              {activeTab === 'linguistic' && <LinguisticIntelTab />}
              {activeTab === 'breach' && <BreachIntelTab />}
              {activeTab === 'osint' && <OnionAuditTab />}
              {activeTab === 'network' && <NetworkAnalysisTab />}
              {activeTab === 'history' && <HistoryTab />}
            </motion.div>
         </AnimatePresence>
      </main>
    </div>
  );
}

import { NavLink, Link } from 'react-router-dom';
import { LayoutDashboard, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

export default function Sidebar() {
  const navItems = [
    { name: 'Command Hub', path: '/dashboard', icon: LayoutDashboard },
  ];

  return (
    <motion.aside 
      initial={{ x: -200 }}
      animate={{ x: 0 }}
      className="w-64 glass-panel border-l-0 border-y-0 border-r border-white/10 flex flex-col h-full sticky top-0 z-10"
    >
      <Link to="/" className="p-6 flex items-center gap-3 border-b border-white/5 hover:bg-white/5 transition-colors group">
        <img src={logo} alt="NEMESIS Logo" className="w-10 h-10 object-contain animate-pulse group-hover:drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]" />
        <h1 className="text-xl font-bold tracking-widest text-white drop-shadow-[0_0_8px_rgba(0,240,255,0.8)]">
          NEMESIS
        </h1>
      </Link>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 cursor-target ${
                isActive
                  ? 'bg-white/10 text-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium tracking-wide uppercase text-[10px]">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-white/5 space-y-4">
        <div className="flex items-center justify-between px-2">
            <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest italic">Operative_Active</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        </div>
        <div className="bg-black/40 p-3 rounded-lg border border-white/5">
            <div className="flex items-center gap-2 text-[10px] text-[#b026ff] font-bold mb-1 uppercase">
                <Database size={10} /> Threat_Ledger
            </div>
            <div className="text-[9px] text-gray-500 font-mono truncate">0x4F2...882BC1</div>
        </div>
        <div className="text-[10px] text-gray-600 text-center font-mono uppercase tracking-widest">
          Nemesis_v1.0_PROACTIVE
        </div>
      </div>
    </motion.aside>
  );
}

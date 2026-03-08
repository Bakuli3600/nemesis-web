import { Link } from 'react-router-dom';
import { Mail, Globe, Shield, Github } from 'lucide-react';
import logo from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="mt-24 md:mt-32 pb-12 md:pb-20 pt-12 md:pt-20 border-t border-white/5 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent pointer-events-none" />
      
      <div className="container-responsive relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
          <div className="md:col-span-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-6 md:mb-8">
              <img src={logo} alt="Logo" className="w-6 h-6 md:w-8 md:h-8 object-contain" />
              <span className="text-lg md:text-xl font-black tracking-tight text-white uppercase">NEMESIS</span>
            </div>
            <p className="text-gray-500 text-xs md:text-sm leading-relaxed font-bold uppercase tracking-tighter mb-8 max-w-xs mx-auto sm:mx-0">
              Predictive intelligence for the decentralized web. Anticipating and disrupting threats through neural OSINT.
            </p>
            <div className="flex justify-center sm:justify-start gap-6">
              <a href="mailto:nemesis.vergirl@gmail.com" className="text-gray-700 hover:text-[#f3d36b] transition-colors"><Mail size={20} strokeWidth={2.5} /></a>
              <a href="#" className="text-gray-700 hover:text-[#f3d36b] transition-colors"><Github size={20} strokeWidth={2.5} /></a>
            </div>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-white font-black mb-6 md:mb-8 text-[9px] md:text-[10px] uppercase tracking-[0.3em]">Platform Architecture</h4>
            <ul className="space-y-4 md:space-y-5 text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <li><Link to="/dashboard" className="hover:text-white transition-colors cursor-target">Neural Command</Link></li>
              <li><Link to="/deepfakeshield" className="hover:text-white transition-colors cursor-target">Vision Shield</Link></li>
              <li><Link to="/comm-analysis" className="hover:text-white transition-colors cursor-target">Linguistic Intel</Link></li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-white font-black mb-6 md:mb-8 text-[9px] md:text-[10px] uppercase tracking-[0.3em]">Neural Resources</h4>
            <ul className="space-y-4 md:space-y-5 text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <li><a href="#" className="hover:text-white transition-colors">API Specification</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Model weights</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Ledger Explorer</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Security Whitepaper</a></li>
            </ul>
          </div>

          <div className="text-center sm:text-left">
            <h4 className="text-white font-black mb-6 md:mb-8 text-[9px] md:text-[10px] uppercase tracking-[0.3em]">Channel Support</h4>
            <ul className="space-y-4 md:space-y-5 text-[9px] md:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">
              <li className="flex items-center justify-center sm:justify-start gap-3"><Mail size={14} className="text-[#f3d36b]" /> nemesis.vergirl@gmail.com</li>
              <li className="flex items-center justify-center sm:justify-start gap-3"><Globe size={14} className="text-[#f3d36b]" /> Global Ops</li>
              <li className="flex items-center justify-center sm:justify-start gap-3">
                <Shield size={14} className="text-[#f3d36b]" /> 
                <span className="text-white bg-white/10 px-2 py-0.5 rounded text-[8px]">Encrypted Portal</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-[8px] md:text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] pt-8 md:pt-12 border-t border-white/5 text-center">
          <p>© 2026 NEMESIS NEURAL DEFENSE GRID.</p>
          <div className="flex flex-wrap justify-center gap-6 md:gap-12">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">System Status</a>
            <a href="#" className="hover:text-white transition-colors">Directives</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

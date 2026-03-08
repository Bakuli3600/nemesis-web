import { LogOut } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { useEffect, useState } from 'react';
import { auth } from '../firebase/firebaseConfig';
import './CardNav.css';

interface CardNavProps {
  logo: string;
}

const CardNav = ({
  logo
}: CardNavProps) => {
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setDisplayName(user.email?.split('@')[0] || "Operative");
      }
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="tactical-nav-container">
      <nav className="tactical-nav !justify-center relative">
        {/* Center: Logo & Name */}
        <Link to="/dashboard" className="nav-logo-section !flex !flex-row !gap-3 !mx-auto">
          <img src={logo} alt="NEMESIS" className="nav-logo-img !h-8 w-auto" />
          <span className="nav-logo-text !block !text-xl !font-black !tracking-[0.3em]">NEMESIS</span>
        </Link>

        {/* Right: Action (Absolute positioned to not offset the center) */}
        <div className="absolute right-4 md:right-8 flex items-center gap-4">
          {displayName && (
            <div className="hidden lg:flex flex-col items-end">
                <span className="text-[8px] font-black text-gray-500 uppercase tracking-widest leading-none">Operative</span>
                <span className="text-[10px] font-black text-white uppercase tracking-tighter leading-none mt-1">{displayName}</span>
            </div>
          )}
          <button 
            onClick={handleLogout}
            className="p-2.5 rounded-full bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/30 text-gray-400 hover:text-red-500 transition-all cursor-target"
            title="De-Authorize Operative"
          >
            <LogOut size={16} />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default CardNav;

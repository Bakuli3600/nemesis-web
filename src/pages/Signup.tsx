import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase/firebaseConfig';
import { ArrowRight, Lock, Mail, User, Loader2, AlertCircle, X } from 'lucide-react';
import logo from '../assets/logo.png';

interface SignupProps {
  onClose?: () => void;
  onSwitchToLogin?: () => void;
}

export default function Signup({ onClose, onSwitchToLogin }: SignupProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) navigate('/dashboard');
    });
    return () => unsubscribe();
  }, [navigate]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store user profile in Firestore
      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        createdAt: serverTimestamp(),
        role: "user"
      });

      navigate('/dashboard');
    } catch (err: any) {
      console.error("Signup Error:", err.code, err.message);
      setError(`REGISTRATION_ERROR [${err.code}]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#020617]/90 backdrop-blur-xl">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="w-full max-w-md liquid-glass p-10 relative shadow-[0_0_50px_rgba(243,211,107,0.1)]"
      >
        {/* Back/Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-500 hover:text-[#f3d36b] transition-colors p-2 rounded-full hover:bg-white/5 cursor-target"
        >
          <X size={24} />
        </button>

        <div className="flex flex-col items-center mb-10">
          <img src={logo} alt="NEMESIS" className="w-16 h-16 mb-4 drop-shadow-[0_0_15px_rgba(243,211,107,0.4)]" />
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">Neural Identity</h1>
          <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Initialize Secure Protocol</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-6">
          <div className="space-y-2">
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input 
                type="text" 
                placeholder="OPERATIVE NAME"
                required
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f3d36b]/20 transition-all"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input 
                type="email" 
                placeholder="IDENTITY@DOMAIN.AI"
                required
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f3d36b]/20 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 w-5 h-5" />
              <input 
                type="password" 
                placeholder="CRYPTOGRAPHIC STRING"
                required
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white font-bold placeholder:text-gray-700 focus:outline-none focus:ring-2 focus:ring-[#f3d36b]/20 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-[10px] font-black uppercase tracking-widest"
            >
              <AlertCircle size={14} /> {error}
            </motion.div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-4 bg-[#f3d36b] text-black rounded-2xl font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl flex items-center justify-center gap-3 cursor-target"
          >
            {loading ? <Loader2 className="animate-spin" size={18} /> : (
              <>INITIALIZE IDENTITY <ArrowRight size={18} /></>
            )}
          </button>
        </form>

        <div className="mt-10 pt-10 border-t border-white/5 text-center">
          <p className="text-[10px] text-gray-600 font-black uppercase tracking-[0.2em]">
            Already Synchronized? <button onClick={onSwitchToLogin} className="text-[#f3d36b] hover:underline ml-2 cursor-target">Neural Access</button>
          </p>
        </div>

        <button 
          onClick={onClose}
          className="w-full mt-4 text-[9px] font-black text-gray-700 uppercase tracking-[0.4em] hover:text-gray-500 transition-colors"
        >
          &larr; Return to System Briefing
        </button>
      </motion.div>
    </div>
  );
}


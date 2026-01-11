
import React, { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
}

type AuthStep = 'initial' | 'success';
type UserPath = 'signin' | 'creator' | 'marketer' | null;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const [path, setPath] = useState<UserPath>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('initial');
      setPath(null);
      setEmail('');
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitialSubmit = async (e: React.FormEvent, selectedPath: UserPath) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setPath(selectedPath);
    
    // Brief delay to simulate processing before direct success
    await new Promise(resolve => setTimeout(resolve, 800));
    
    setIsLoading(false);
    setStep('success');
  };

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500 min-h-[500px]">
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
        <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mb-4 tracking-tighter">ACCESS GRANTED</h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase max-w-sm leading-relaxed mb-8">
        Your account for <span className="font-black text-slate-900 dark:text-white">{email}</span> has been provisioned. 
        You now have <span className="text-jetblue font-black">{path?.toUpperCase()}</span> level access to PRM.
      </p>
      <button 
        onClick={onClose}
        className="px-12 py-4 bg-[#001A41] text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue transition-all shadow-2xl"
      >
        Enter Dashboard
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Main Container */}
      <div className="relative w-full max-w-7xl bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
        
        {step === 'success' ? renderSuccess() : (
          <div className="flex flex-col lg:flex-row min-h-[650px]">
            
            {/* 1. SIGN IN TRACK */}
            <div className="flex-1 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                <img 
                  src="https://i.imgur.com/V1p2JYE_d.png?maxwidth=520&shape=thumb&fidelity=high" 
                  alt="Sign In Access" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" 
                  loading="eager"
                />
              </div>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">EXISTING USERS</div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic leading-[0.85] tracking-tighter">SIGN <br /> IN</h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-4">Authenticated Access</p>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'signin')} className="mt-auto space-y-4">
                <input 
                  type="email" 
                  placeholder="ENTER EMAIL" 
                  required 
                  value={path === 'signin' ? email : ''}
                  onChange={(e) => { setPath('signin'); setEmail(e.target.value); }}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-6 py-4 text-[11px] font-black tracking-widest outline-none border-2 border-transparent focus:border-jetblue/30 dark:text-white transition-all" 
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-slate-900 dark:bg-slate-800 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl group-hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {isLoading && path === 'signin' ? (
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : 'AUTHENTICATE'}
                </button>
              </form>
            </div>

            {/* 2. CREATOR TRACK - CLASSIC GOLD THEME */}
            <div className="flex-1 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col bg-[#D4AF37] text-white group transition-all hover:bg-[#B8860B]">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-white/10 bg-white/5 shadow-sm">
                <img 
                  src="https://i.imgur.com/M3lbq0r.jpeg" 
                  alt="Creator Registration" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" 
                  loading="eager"
                />
              </div>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[8px] font-black text-white/80 uppercase tracking-widest mb-4">NEW CREATORS</div>
                <h3 className="text-4xl font-black uppercase italic leading-[0.85] tracking-tighter">CREATOR <br /> SIGN UP</h3>
                <p className="text-[10px] font-bold text-white/60 tracking-[0.2em] uppercase mt-4">Automated Monetization</p>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'creator')} className="mt-auto space-y-4">
                <input 
                  type="email" 
                  placeholder="ENTER EMAIL" 
                  required 
                  value={path === 'creator' ? email : ''}
                  onChange={(e) => { setPath('creator'); setEmail(e.target.value); }}
                  className="w-full bg-white/10 rounded-xl px-6 py-4 text-[11px] font-black tracking-widest outline-none border-none text-white placeholder:text-white/40 transition-all focus:bg-white/20" 
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-[#D4AF37] py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl group-hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {isLoading && path === 'creator' ? (
                    <div className="w-4 h-4 border-2 border-[#D4AF37]/30 border-t-[#D4AF37] rounded-full animate-spin" />
                  ) : 'START ONBOARDING'}
                </button>
              </form>
            </div>

            {/* 3. MARKETER TRACK - BLUE THEME */}
            <div className="flex-1 p-8 md:p-10 flex flex-col bg-[#001A41] text-white group transition-all hover:bg-[#00255c]">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-white/10 bg-white/5">
                <img 
                  src="https://i.imgur.com/KzCLsaJ_d.jpeg?maxwidth=520&shape=thumb&fidelity=high" 
                  alt="Marketer Sign Up" 
                  className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale group-hover:grayscale-0" 
                  loading="eager"
                />
              </div>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[8px] font-black text-white/70 uppercase tracking-widest mb-4">ENTERPRISE TEAMS</div>
                <h3 className="text-4xl font-black uppercase italic leading-[0.85] tracking-tighter">MARKETER <br /> SIGN UP</h3>
                <p className="text-[10px] font-bold text-white/40 tracking-[0.2em] uppercase mt-4">Precision Placement Deployment</p>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'marketer')} className="mt-auto space-y-4">
                <input 
                  type="email" 
                  placeholder="BUSINESS EMAIL" 
                  required 
                  value={path === 'marketer' ? email : ''}
                  onChange={(e) => { setPath('marketer'); setEmail(e.target.value); }}
                  className="w-full bg-white/10 rounded-xl px-6 py-4 text-[11px] font-black tracking-widest outline-none border-none text-white placeholder:text-white/40 transition-all focus:bg-white/20" 
                />
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full bg-white text-[#001A41] py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl group-hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  {isLoading && path === 'marketer' ? (
                    <div className="w-4 h-4 border-2 border-[#001A41]/30 border-t-[#001A41] rounded-full animate-spin" />
                  ) : 'START TEAM PORTAL'}
                </button>
              </form>
            </div>
            
          </div>
        )}

        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-[110] w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

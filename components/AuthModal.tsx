
import React, { useState, useEffect } from 'react';
import { sendVerificationEmail } from '../services/emailService.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
}

type AuthStep = 'initial' | 'verify_inbox' | 'success';
type UserPath = 'signin' | 'creator' | 'marketer' | null;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const [path, setPath] = useState<UserPath>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setStep('initial');
      setPath(null);
      setEmail('');
      setIsLoading(false);
      setError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitialSubmit = async (e: React.FormEvent, selectedPath: UserPath) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    setPath(selectedPath);
    
    const result = await sendVerificationEmail(email, selectedPath || 'unknown');
    
    setIsLoading(false);
    if (result.success) {
      setStep('verify_inbox');
    } else {
      setError('Unable to reach the PRM Email Server. Check your connection or configuration.');
    }
  };

  const renderVerifyInbox = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500 min-h-[500px]">
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-jetblue/20 rounded-full blur-2xl animate-pulse"></div>
        <div className="relative w-24 h-24 bg-jetblue rounded-3xl flex items-center justify-center shadow-2xl shadow-jetblue/30 rotate-3">
          <svg className="w-12 h-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mb-4 tracking-tighter">TRANSMISSION SENT</h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase max-w-sm leading-relaxed mb-10">
        A secure onboarding link has been dispatched to:<br/>
        <span className="text-jetblue font-black mt-2 block border-b-2 border-jetblue/10 pb-1">{email}</span>
      </p>

      <div className="flex flex-col gap-4 w-full max-w-xs relative z-10">
        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 italic">
          WAITING FOR VERIFICATION...
        </div>
        <button 
          onClick={() => setStep('success')} 
          className="px-12 py-4 bg-jetblue text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue-bright transition-all shadow-2xl group"
        >
          <span className="group-hover:scale-110 transition-transform inline-block">I've Clicked the Link</span>
        </button>
        <button 
          onClick={() => setStep('initial')}
          className="text-[10px] font-black text-slate-400 hover:text-jetblue uppercase tracking-widest transition-colors"
        >
          Resend or change email
        </button>
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500 min-h-[500px]">
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8">
        <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mb-4 tracking-tighter tracking-tighter">ACCESS GRANTED</h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase max-w-sm leading-relaxed mb-8">
        Identity confirmed. Your profile is now synced with the <span className="text-jetblue font-black">PRM CENTRAL HUB</span>.
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
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
        
        {step === 'success' ? renderSuccess() : step === 'verify_inbox' ? renderVerifyInbox() : (
          <div className="flex flex-col lg:flex-row min-h-[650px]">
            
            {/* SIGN IN */}
            <div className="flex-1 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                <img src="https://i.imgur.com/V1p2JYE_d.png?maxwidth=520&shape=thumb&fidelity=high" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt="Sign In" />
              </div>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">EXISTING USERS</div>
                <h3 className="text-4xl font-black text-slate-900 dark:text-white uppercase italic leading-[0.85] tracking-tighter">SIGN <br /> IN</h3>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'signin')} className="mt-auto space-y-4">
                {error && <div className="p-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">{error}</div>}
                <input 
                  type="email" placeholder="ENTER EMAIL" required 
                  value={path === 'signin' ? email : ''}
                  onChange={(e) => { setPath('signin'); setEmail(e.target.value); }}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-xl px-6 py-4 text-[11px] font-black tracking-widest outline-none border-2 border-transparent focus:border-jetblue/30 dark:text-white transition-all" 
                />
                <button type="submit" disabled={isLoading} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl group-hover:scale-[1.02] flex items-center justify-center gap-2">
                  {isLoading && path === 'signin' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'AUTHENTICATE'}
                </button>
              </form>
            </div>

            {/* CREATOR */}
            <div className="flex-1 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col bg-prmgold text-white group transition-all hover:bg-prmgold-dark">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-white/10 bg-white/5 shadow-sm">
                <img src="https://i.imgur.com/M3lbq0r.jpeg" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt="Creator" />
              </div>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[8px] font-black text-white/80 uppercase tracking-widest mb-4">NEW CREATORS</div>
                <h3 className="text-4xl font-black uppercase italic leading-[0.85] tracking-tighter">CREATOR <br /> SIGN UP</h3>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'creator')} className="mt-auto space-y-4">
                {error && path === 'creator' && <div className="p-3 bg-black/20 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">{error}</div>}
                <input 
                  type="email" placeholder="ENTER EMAIL" required 
                  value={path === 'creator' ? email : ''}
                  onChange={(e) => { setPath('creator'); setEmail(e.target.value); }}
                  className="w-full bg-white/10 rounded-xl px-6 py-4 text-[11px] font-black tracking-widest outline-none border-none text-white placeholder:text-white/40 transition-all focus:bg-white/20" 
                />
                <button type="submit" disabled={isLoading} className="w-full bg-white text-prmgold py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl group-hover:scale-[1.02] flex items-center justify-center gap-2">
                  {isLoading && path === 'creator' ? <div className="w-4 h-4 border-2 border-prmgold/30 border-t-prmgold rounded-full animate-spin" /> : 'START ONBOARDING'}
                </button>
              </form>
            </div>

            {/* MARKETER */}
            <div className="flex-1 p-8 md:p-10 flex flex-col bg-[#001A41] text-white group transition-all hover:bg-[#00255c]">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-white/10 bg-white/5">
                <img src="https://i.imgur.com/KzCLsaJ_d.jpeg?maxwidth=520&shape=thumb&fidelity=high" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale group-hover:grayscale-0" alt="Marketer" />
              </div>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[8px] font-black text-white/70 uppercase tracking-widest mb-4">ENTERPRISE TEAMS</div>
                <h3 className="text-4xl font-black uppercase italic leading-[0.85] tracking-tighter">MARKETER <br /> SIGN UP</h3>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'marketer')} className="mt-auto space-y-4">
                {error && path === 'marketer' && <div className="p-3 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-lg mb-4">{error}</div>}
                <input 
                  type="email" placeholder="BUSINESS EMAIL" required 
                  value={path === 'marketer' ? email : ''}
                  onChange={(e) => { setPath('marketer'); setEmail(e.target.value); }}
                  className="w-full bg-white/10 rounded-xl px-6 py-4 text-[11px] font-black tracking-widest outline-none border-none text-white placeholder:text-white/40 transition-all focus:bg-white/20" 
                />
                <button type="submit" disabled={isLoading} className="w-full bg-white text-[#001A41] py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl group-hover:scale-[1.02] flex items-center justify-center gap-2">
                  {isLoading && path === 'marketer' ? <div className="w-4 h-4 border-2 border-[#001A41]/30 border-t-[#001A41] rounded-full animate-spin" /> : 'START TEAM PORTAL'}
                </button>
              </form>
            </div>
          </div>
        )}

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

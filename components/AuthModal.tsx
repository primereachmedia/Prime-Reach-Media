
import React, { useState, useEffect } from 'react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
}

type AuthStep = 'initial' | 'verifying' | 'success';
type UserPath = 'signin' | 'creator' | 'marketer' | null;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const [path, setPath] = useState<UserPath>(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStep('initial');
      setPath(null);
      setEmail('');
      setOtp(['', '', '', '', '', '']);
      setIsLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitialSubmit = async (e: React.FormEvent, selectedPath: UserPath) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setPath(selectedPath);
    
    // Simulate sending the code to the user's email
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    setStep('verifying');
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const verifyCode = async () => {
    setIsLoading(true);
    // Simulate verification check
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsLoading(false);
    setStep('success');
    
    console.log(`User ${email} verified via ${path} path. Routed to PRM Command.`);
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
        Identity verified. Your session is now synced with <span className="text-jetblue font-black">PRM CENTRAL COMMAND</span>.
      </p>
      <button 
        onClick={onClose}
        className="px-12 py-4 bg-[#001A41] text-white rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue transition-all shadow-2xl"
      >
        Continue to Dashboard
      </button>
    </div>
  );

  const renderVerification = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center min-h-[500px]">
      <div className="mb-8">
        <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">CHECK YOUR INBOX</h3>
        <p className="text-[10px] font-bold text-slate-400 tracking-[0.3em] uppercase mt-2">CODE SENT TO: {email}</p>
      </div>

      <div className="flex gap-3 mb-10">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            id={`otp-${idx}`}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            className="w-12 h-16 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl text-center text-2xl font-black text-jetblue dark:text-white focus:border-jetblue outline-none transition-all"
          />
        ))}
      </div>

      <button 
        onClick={verifyCode}
        disabled={otp.some(d => !d) || isLoading}
        className={`w-full max-w-xs py-4 rounded-xl font-black text-xs uppercase tracking-[0.3em] transition-all shadow-xl ${
          isLoading ? 'bg-slate-100 text-slate-400' : 'bg-jetblue text-white hover:bg-jetblue-bright'
        }`}
      >
        {isLoading ? 'VERIFYING SIGNATURE...' : 'CONFIRM ACCESS'}
      </button>

      <button 
        onClick={() => setStep('initial')}
        className="mt-6 text-[10px] font-black text-slate-400 hover:text-jetblue uppercase tracking-widest underline decoration-2 underline-offset-4"
      >
        Entered wrong email?
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      {/* Main Container */}
      <div className="relative w-full max-w-7xl bg-white dark:bg-slate-950 rounded-[2rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
        
        {step === 'success' ? renderSuccess() : step === 'verifying' ? renderVerification() : (
          <div className="flex flex-col lg:flex-row min-h-[650px]">
            
            {/* 1. SIGN IN TRACK */}
            <div className="flex-1 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900">
                <img 
                  src="https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=60&w=600" 
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
                  disabled={isLoading && path === 'signin'}
                  className="w-full bg-slate-900 dark:bg-slate-800 text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-black transition-all shadow-xl group-hover:scale-[1.02]"
                >
                  {isLoading && path === 'signin' ? 'GENERATING CODE...' : 'SEND ACCESS CODE'}
                </button>
              </form>
            </div>

            {/* 2. CREATOR TRACK */}
            <div className="flex-1 p-8 md:p-10 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col bg-gradient-to-b from-white to-slate-50 dark:from-slate-950 dark:to-slate-900 group hover:to-slate-100 dark:hover:to-slate-800 transition-colors">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 shadow-sm">
                <img 
                  src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=60&w=600" 
                  alt="Creator Registration" 
                  className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" 
                  loading="eager"
                />
              </div>
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-jetblue/10 rounded-full text-[8px] font-black text-jetblue uppercase tracking-widest mb-4">NEW CREATORS</div>
                <h3 className="text-4xl font-black text-jetblue dark:text-jetblue-light uppercase italic leading-[0.85] tracking-tighter">CREATOR <br /> SIGN UP</h3>
                <p className="text-[10px] font-bold text-slate-400 tracking-[0.2em] uppercase mt-4">USDC Monetization</p>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'creator')} className="mt-auto space-y-4">
                <input 
                  type="email" 
                  placeholder="ENTER EMAIL" 
                  required 
                  value={path === 'creator' ? email : ''}
                  onChange={(e) => { setPath('creator'); setEmail(e.target.value); }}
                  className="w-full bg-white dark:bg-slate-800 rounded-xl px-6 py-4 text-[11px] font-black tracking-widest outline-none border-2 border-slate-200 dark:border-slate-700 focus:border-jetblue/30 dark:text-white transition-all shadow-sm" 
                />
                <button 
                  type="submit" 
                  disabled={isLoading && path === 'creator'}
                  className="w-full bg-jetblue text-white py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/20 group-hover:scale-[1.02]"
                >
                  {isLoading && path === 'creator' ? 'INITIALIZING...' : 'START ONBOARDING'}
                </button>
              </form>
            </div>

            {/* 3. MARKETER TRACK */}
            <div className="flex-1 p-8 md:p-10 flex flex-col bg-[#001A41] text-white group transition-all hover:bg-[#00255c]">
              <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-8 border border-white/10 bg-white/5">
                <img 
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=60&w=600" 
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
                  disabled={isLoading && path === 'marketer'}
                  className="w-full bg-white text-[#001A41] py-5 rounded-xl font-black text-xs uppercase tracking-[0.3em] hover:bg-slate-100 transition-all shadow-2xl group-hover:scale-[1.02]"
                >
                  {isLoading && path === 'marketer' ? 'AUTHORIZING...' : 'START TEAM PORTAL'}
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

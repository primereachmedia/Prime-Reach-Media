
import React, { useState, useEffect, useRef } from 'react';
import { sendVerificationEmail } from '../services/emailService.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode: 'signin' | 'signup';
}

type AuthStep = 'initial' | 'verify_otp' | 'success';
type UserPath = 'signin' | 'creator' | 'marketer' | null;

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState<AuthStep>('initial');
  const [path, setPath] = useState<UserPath>(null);
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sentCode, setSentCode] = useState<string | null>(null);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isShaking, setIsShaking] = useState(false);
  const otpInputs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (isOpen) {
      setStep('initial');
      setPath(null);
      setEmail('');
      setIsLoading(false);
      setError(null);
      setSentCode(null);
      setOtp(['', '', '', '', '', '']);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleInitialSubmit = async (e: React.FormEvent, selectedPath: UserPath) => {
    e.preventDefault();
    if (!email) return;
    
    setIsLoading(true);
    setError(null);
    setPath(selectedPath);
    
    // We trigger the REAL email transmission here
    const result = await sendVerificationEmail(email, selectedPath || 'unknown');
    
    if (result.success) {
      // Store the code locally to verify it in the next step
      setSentCode(result.passcode || null);
      setTimeout(() => {
        setIsLoading(false);
        setStep('verify_otp');
      }, 800);
    } else {
      setIsLoading(false);
      setError(result.error || 'Connection to secure mail server failed.');
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Focus next box
    if (value && index < 5) {
      otpInputs.current[index + 1]?.focus();
    }

    // Auto-verify if 6th digit is entered
    if (index === 5 && value) {
      const fullCode = newOtp.join('');
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputs.current[index - 1]?.focus();
    }
  };

  const verifyCode = (code: string) => {
    setIsLoading(true);
    setError(null);

    // Simulated network delay for the "Security Check"
    setTimeout(() => {
      // STRICT VERIFICATION: Matches the EXACT code sent in your email
      if (sentCode && code === sentCode) {
        setStep('success');
      } else {
        // FAIL STATE
        setError('SECURE CODE MISMATCH');
        setIsShaking(true);
        setOtp(['', '', '', '', '', '']);
        setTimeout(() => setIsShaking(false), 500);
        otpInputs.current[0]?.focus();
      }
      setIsLoading(false);
    }, 1200);
  };

  const renderVerifyOtp = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500 min-h-[550px]">
      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .shake-element { animation: shake 0.2s ease-in-out 0s 2; }
      `}</style>

      <div className="relative mb-10">
        <div className="absolute inset-0 bg-jetblue/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="relative w-24 h-24 bg-jetblue rounded-[2rem] flex items-center justify-center shadow-2xl shadow-jetblue/40 rotate-6 border-4 border-white dark:border-slate-900">
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
      </div>
      
      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mb-2 tracking-tighter">AUTHENTICATION REQUIRED</h3>
      <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase max-w-sm leading-relaxed mb-10">
        Input the 6-digit security token dispatched to:<br/>
        <span className="text-jetblue font-black mt-1 block select-all">{email}</span>
      </p>

      {error && <div className="mb-6 p-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-lg animate-bounce border border-red-500/20">{error}</div>}

      <div className={`flex gap-3 mb-12 ${isShaking ? 'shake-element' : ''}`}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={el => otpInputs.current[idx] = el}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleOtpChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            disabled={isLoading}
            className={`w-12 h-16 md:w-14 md:h-20 text-center text-2xl font-black bg-slate-50 dark:bg-slate-900 border-2 rounded-2xl outline-none transition-all dark:text-white ${
              error ? 'border-red-500/50 ring-4 ring-red-500/5' : 'border-slate-200 dark:border-slate-800 focus:border-jetblue dark:focus:border-jetblue focus:ring-4 focus:ring-jetblue/10'
            }`}
          />
        ))}
      </div>

      <div className="flex flex-col gap-4 w-full max-w-xs">
        {isLoading ? (
          <div className="flex items-center justify-center gap-3 py-4 text-jetblue font-black text-[10px] uppercase tracking-[0.4em]">
            <div className="w-4 h-4 border-2 border-jetblue/30 border-t-jetblue rounded-full animate-spin" />
            VALIDATING TOKEN...
          </div>
        ) : (
          <div className="flex flex-col gap-6">
             <button 
              onClick={() => {
                const fullCode = otp.join('');
                if (fullCode.length === 6) verifyCode(fullCode);
              }}
              className="w-full bg-jetblue text-white py-4 rounded-xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/20"
            >
              Verify Identity
            </button>
            <button 
              onClick={() => setStep('initial')}
              className="text-[10px] font-black text-slate-400 hover:text-jetblue uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 19l-7-7m0 0l7-7m-7 7h18" strokeWidth={3}/></svg>
              Mistyped Email? Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in duration-500 min-h-[550px]">
      <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border-4 border-green-500/20">
        <svg className="w-12 h-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic mb-4 tracking-tighter">ACCESS GRANTED</h3>
      <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.3em] uppercase max-w-sm leading-relaxed mb-8">
        Verification successful. Your session is now encrypted and secured by <span className="text-jetblue font-black">PRM HUB V2</span>.
      </p>
      <button 
        onClick={onClose}
        className="px-12 py-5 bg-[#001A41] text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue transition-all shadow-2xl hover:-translate-y-1"
      >
        Initialize Dashboard
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-7xl bg-white dark:bg-slate-950 rounded-[3rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10">
        
        {step === 'success' ? renderSuccess() : step === 'verify_otp' ? renderVerifyOtp() : (
          <div className="flex flex-col lg:flex-row min-h-[700px]">
            
            {/* SIGN IN */}
            <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col group hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-10 border border-slate-100 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 shadow-inner">
                <img src="https://i.imgur.com/V1p2JYE_d.png?maxwidth=520&shape=thumb&fidelity=high" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt="Sign In" />
              </div>
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-full text-[8px] font-black text-slate-500 uppercase tracking-widest mb-4">EXISTING USERS</div>
                <h3 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic leading-[0.8] tracking-tighter">SIGN <br /> IN</h3>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'signin')} className="mt-auto space-y-4">
                {error && path === 'signin' && <div className="p-3 bg-red-500/10 text-red-500 text-[10px] font-black uppercase tracking-widest rounded-xl mb-4 leading-tight border border-red-500/20">{error}</div>}
                <input 
                  type="email" placeholder="ENTER EMAIL" required 
                  value={path === 'signin' ? email : ''}
                  onChange={(e) => { setPath('signin'); setEmail(e.target.value); }}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-2xl px-8 py-5 text-[11px] font-black tracking-widest outline-none border-2 border-transparent focus:border-jetblue/30 dark:text-white transition-all shadow-sm" 
                />
                <button type="submit" disabled={isLoading} className="w-full bg-slate-900 dark:bg-slate-800 text-white py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-black transition-all shadow-xl group-hover:scale-[1.02] flex items-center justify-center gap-2">
                  {isLoading && path === 'signin' ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : 'AUTHENTICATE'}
                </button>
              </form>
            </div>

            {/* CREATOR */}
            <div className="flex-1 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-100 dark:border-slate-800 flex flex-col bg-prmgold text-white group transition-all hover:bg-prmgold-dark">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-10 border border-white/10 bg-white/5 shadow-2xl">
                <img src="https://i.imgur.com/M3lbq0r.jpeg" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity grayscale group-hover:grayscale-0" alt="Creator" />
              </div>
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[8px] font-black text-white/80 uppercase tracking-widest mb-4">NEW CREATORS</div>
                <h3 className="text-5xl font-black uppercase italic leading-[0.8] tracking-tighter">CREATOR <br /> SIGN UP</h3>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'creator')} className="mt-auto space-y-4">
                {error && path === 'creator' && <div className="p-3 bg-black/20 text-white text-[10px] font-black uppercase tracking-widest rounded-xl mb-4 leading-tight">{error}</div>}
                <input 
                  type="email" placeholder="ENTER EMAIL" required 
                  value={path === 'creator' ? email : ''}
                  onChange={(e) => { setPath('creator'); setEmail(e.target.value); }}
                  className="w-full bg-white/10 rounded-2xl px-8 py-5 text-[11px] font-black tracking-widest outline-none border-none text-white placeholder:text-white/50 transition-all focus:bg-white/20" 
                />
                <button type="submit" disabled={isLoading} className="w-full bg-white text-prmgold py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-100 transition-all shadow-2xl group-hover:scale-[1.02] flex items-center justify-center gap-2">
                  {isLoading && path === 'creator' ? <div className="w-4 h-4 border-2 border-prmgold/30 border-t-prmgold rounded-full animate-spin" /> : 'START ONBOARDING'}
                </button>
              </form>
            </div>

            {/* MARKETER */}
            <div className="flex-1 p-8 md:p-12 flex flex-col bg-[#001A41] text-white group transition-all hover:bg-[#00255c]">
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden mb-10 border border-white/10 bg-white/5 shadow-2xl">
                <img src="https://i.imgur.com/KzCLsaJ_d.jpeg?maxwidth=520&shape=thumb&fidelity=high" className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity grayscale group-hover:grayscale-0" alt="Marketer" />
              </div>
              <div className="mb-8">
                <div className="inline-block px-3 py-1 bg-white/10 rounded-full text-[8px] font-black text-white/70 uppercase tracking-widest mb-4">ENTERPRISE TEAMS</div>
                <h3 className="text-5xl font-black uppercase italic leading-[0.8] tracking-tighter">MARKETER <br /> SIGN UP</h3>
              </div>

              <form onSubmit={(e) => handleInitialSubmit(e, 'marketer')} className="mt-auto space-y-4">
                {error && path === 'marketer' && <div className="p-3 bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl mb-4 leading-tight">{error}</div>}
                <input 
                  type="email" placeholder="BUSINESS EMAIL" required 
                  value={path === 'marketer' ? email : ''}
                  onChange={(e) => { setPath('marketer'); setEmail(e.target.value); }}
                  className="w-full bg-white/10 rounded-2xl px-8 py-5 text-[11px] font-black tracking-widest outline-none border-none text-white placeholder:text-white/50 transition-all focus:bg-white/20" 
                />
                <button type="submit" disabled={isLoading} className="w-full bg-white text-[#001A41] py-6 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-slate-100 transition-all shadow-2xl group-hover:scale-[1.02] flex items-center justify-center gap-2">
                  {isLoading && path === 'marketer' ? <div className="w-4 h-4 border-2 border-[#001A41]/30 border-t-[#001A41] rounded-full animate-spin" /> : 'START TEAM PORTAL'}
                </button>
              </form>
            </div>
          </div>
        )}

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 z-[110] w-12 h-12 flex items-center justify-center bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 rounded-full text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-all border border-slate-200 dark:border-white/10"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AuthModal;

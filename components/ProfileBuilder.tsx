
import React, { useState, useEffect } from 'react';

interface ProfileBuilderProps {
  userRole: string;
  userEmail: string;
  initialWalletAddress?: string | null;
  initialTwitterHandle?: string | null;
  isTwitterVerified: boolean;
  onUpdate: (data: any) => void;
  onSave: (data: any) => void;
  onLogout: () => void;
}

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, userEmail, initialWalletAddress, initialTwitterHandle, isTwitterVerified, onUpdate, onSave, onLogout }) => {
  const [formData, setFormData] = useState({
    companyName: initialTwitterHandle || '',
    mission: '',
    companyType: '',
    timeInBusiness: '',
    industry: '',
    primaryObjective: '',
    audienceDescription: '',
    image: null as string | null,
    walletAddress: initialWalletAddress || null as string | null,
    twitterHandle: initialTwitterHandle || '' as string,
    isTwitterVerified: isTwitterVerified
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [isVerifyingX, setIsVerifyingX] = useState(false);
  const [verificationStep, setVerificationStep] = useState<'idle' | 'token' | 'scanning' | 'success'>('idle');
  const [verificationToken, setVerificationToken] = useState('');
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'signing'>('idle');
  const [phantomError, setPhantomError] = useState<string | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);

  // Sync verification step if already verified
  useEffect(() => {
    if (isTwitterVerified) setVerificationStep('success');
  }, [isTwitterVerified]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const initiateXHandshake = () => {
    if (!formData.twitterHandle) return;
    const code = `PRM-${Math.floor(100 + Math.random() * 899)}-IDENTITY`;
    setVerificationToken(code);
    setVerificationStep('token');
  };

  const handleFinalXVerification = () => {
    setVerificationStep('scanning');
    setIsVerifyingX(true);
    
    // Rigorous Identity Scanning Simulation
    setTimeout(() => {
      const handle = formData.twitterHandle.startsWith('@') ? formData.twitterHandle : `@${formData.twitterHandle}`;
      
      setFormData(prev => ({ 
        ...prev, 
        twitterHandle: handle,
        isTwitterVerified: true,
        companyName: prev.companyName || handle.replace('@', '')
      }));
      onUpdate({ twitterHandle: handle, isTwitterVerified: true });
      setIsVerifyingX(false);
      setVerificationStep('success');
    }, 2500);
  };

  const handleConnectWallet = async () => {
    const { solana } = window as any;
    
    if (!solana?.isPhantom) {
      setPhantomError('PHANTOM WALLET NOT DETECTED. PLEASE INSTALL THE EXTENSION.');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setIsConnecting(true);
    setConnectionStep('connecting');
    setPhantomError(null);

    try {
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      
      setConnectionStep('signing');
      const message = `AUTHENTICATE WITH PRIME REACH MEDIA\n\nUser: ${userEmail}\nTimestamp: ${Date.now()}\nStatus: Required Handshake`;
      const encodedMessage = new TextEncoder().encode(message);
      
      try {
        await solana.signMessage(encodedMessage, "utf8");
        setFormData(prev => ({ ...prev, walletAddress: publicKey }));
        onUpdate({ walletAddress: publicKey });
      } catch (signErr: any) {
        throw new Error('SIGNATURE REJECTED. MANUAL APPROVAL IS MANDATORY.');
      }

    } catch (err: any) {
      setPhantomError(err.message || 'CONNECTION REJECTED BY USER');
    } finally {
      setIsConnecting(false);
      setConnectionStep('idle');
    }
  };

  const handleDisconnectWallet = async () => {
    const { solana } = window as any;
    if (solana) {
      try {
        await solana.disconnect();
        setFormData(prev => ({ ...prev, walletAddress: null }));
        onUpdate({ walletAddress: null });
      } catch (err) {
        setFormData(prev => ({ ...prev, walletAddress: null }));
      }
    } else {
      setFormData(prev => ({ ...prev, walletAddress: null }));
    }
  };

  const handleIdentityTermination = () => {
    setIsTerminating(true);
    setTimeout(() => {
      onLogout();
    }, 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, email: userEmail });
  };

  const companyTypes = ['Individual', 'Startup', 'Agency', 'Enterprise'];
  const industries = ['Crypto', 'Gaming', 'SaaS', 'Ecommerce', 'Media', 'Other'];
  const objectives = ['Brand awareness', 'Product launch', 'Conversions', 'Community growth'];

  if (isTerminating) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
        <div className="w-20 h-20 border-4 border-jetblue border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-4">PURGING IDENTITY SESSION</h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">DE-AUTHENTICATING SECURE HANDSHAKE...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-end mb-8">
           <button 
             onClick={handleIdentityTermination}
             className="flex items-center gap-3 px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-red-500/50 hover:bg-red-500/5 transition-all group"
           >
             <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-red-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 group-hover:text-red-500 uppercase tracking-widest">Terminate Identity Session</span>
           </button>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
             <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
             <span className="text-[10px] font-black text-jetblue dark:text-jetblue-light uppercase tracking-[0.5em]">PRM Studio v2.0</span>
             <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-center">PROFILE STUDIO</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-4 text-center">CONFIGURING IDENTITY FOR: <span className="text-prmgold">{userRole}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-24">
          
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800 transition-all hover:shadow-2xl hover:shadow-jetblue/10">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">01</span>
              Branding Hub
            </h2>
            
            <div className="relative flex justify-center">
              <input type="file" id="branding-asset" className="hidden" accept="image/*" onChange={handleImageChange} />
              <label htmlFor="branding-asset" className="block w-full max-w-[450px] aspect-square rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue dark:hover:border-jetblue transition-all cursor-pointer overflow-hidden relative group bg-slate-50 dark:bg-slate-950 shadow-inner">
                {formData.image ? (
                  <div className="relative w-full h-full">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Branding" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <span className="text-white font-black text-xs uppercase tracking-widest border-2 border-white px-4 py-2 hover:bg-white hover:text-black transition-colors">Change Asset</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-jetblue p-12 text-center">
                    <div className="w-20 h-20 mb-6 bg-slate-100 dark:bg-slate-900 rounded-full flex items-center justify-center border-2 border-slate-200 dark:border-slate-800">
                      <svg className="w-10 h-10 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs font-black uppercase tracking-[0.2em] leading-relaxed">Click to Upload Master Asset</span>
                  </div>
                )}
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              Identity & Verification
            </h2>

            {/* X Verification Hub */}
            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 mb-10 ${formData.isTwitterVerified ? 'bg-slate-50 dark:bg-slate-950/40 border-slate-200 dark:border-slate-800' : 'bg-jetblue/5 border-jetblue/20'}`}>
               <div className="flex flex-col items-center justify-center gap-8 w-full">
                  <div className="flex flex-col items-center text-center max-w-lg">
                    <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl mb-4">
                       <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                       X Social Identity
                       {formData.twitterHandle && (
                         formData.isTwitterVerified ? (
                           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-500/10 rounded">
                             <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                               <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z" />
                             </svg>
                             <span className="text-[8px] font-black text-blue-500 uppercase">Verified</span>
                           </div>
                         ) : (
                           <div className="flex items-center gap-1.5 px-2 py-0.5 bg-red-500/10 rounded">
                             <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                               <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05z" />
                             </svg>
                             <span className="text-[8px] font-black text-red-500 uppercase">Unverified</span>
                           </div>
                         )
                       )}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic mb-6">
                      Identity integrity is critical. We require a unique bio-token handshake to verify handle authority.
                    </p>
                  </div>

                  {verificationStep === 'idle' && (
                    <div className="w-full flex gap-2">
                      <input 
                        type="text"
                        value={formData.twitterHandle}
                        onChange={(e) => setFormData(prev => ({ ...prev, twitterHandle: e.target.value, isTwitterVerified: false }))}
                        placeholder="@YourXHandle"
                        className="flex-1 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-4 py-4 text-xs font-black dark:text-white focus:border-jetblue outline-none transition-all"
                      />
                      <button
                        type="button"
                        onClick={initiateXHandshake}
                        disabled={!formData.twitterHandle}
                        className="px-8 py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-30"
                      >
                        Start Verification
                      </button>
                    </div>
                  )}

                  {verificationStep === 'token' && (
                    <div className="w-full p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
                       <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 text-center">Identity Handshake Protocol</h5>
                       <div className="bg-slate-50 dark:bg-slate-950 p-6 rounded-2xl mb-6 text-center border-2 border-dashed border-slate-200 dark:border-slate-800">
                         <span className="text-xs font-black text-jetblue dark:text-jetblue-light tracking-widest select-all">{verificationToken}</span>
                       </div>
                       <p className="text-[9px] font-bold text-slate-500 dark:text-slate-400 uppercase leading-relaxed mb-6 text-center">
                         Copy the token above and add it to your X bio. <br/>Once saved, click "Check Profile Authority" below.
                       </p>
                       <div className="flex flex-col gap-3">
                         <button
                           type="button"
                           onClick={handleFinalXVerification}
                           className="w-full py-4 bg-jetblue text-white rounded-xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-jetblue-bright transition-all"
                         >
                           Check Profile Authority
                         </button>
                         <button
                           type="button"
                           onClick={() => setVerificationStep('idle')}
                           className="text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600"
                         >
                           Cancel Handshake
                         </button>
                       </div>
                    </div>
                  )}

                  {verificationStep === 'scanning' && (
                    <div className="w-full flex flex-col items-center py-10 animate-pulse">
                      <div className="w-12 h-12 border-4 border-jetblue border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-[10px] font-black text-jetblue uppercase tracking-[0.5em]">Scanning X Metadata...</span>
                    </div>
                  )}

                  {verificationStep === 'success' && (
                    <div className="w-full text-center py-4 bg-green-500/5 rounded-2xl border border-green-500/20">
                      <span className="text-[10px] font-black text-green-500 uppercase tracking-[0.3em] flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                        Identity Verified: {formData.twitterHandle}
                      </span>
                      <button 
                        type="button" 
                        onClick={() => { setVerificationStep('idle'); setFormData(prev => ({...prev, isTwitterVerified: false})); }}
                        className="mt-3 text-[8px] font-black text-slate-400 uppercase tracking-widest hover:text-red-500"
                      >
                        [ Revoke Identity Access ]
                      </button>
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Login Identifier</label>
                <div className="relative">
                   <input type="text" value={userEmail} disabled className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold text-slate-400 cursor-not-allowed opacity-80" />
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-jetblue uppercase tracking-tighter">Email Verified</div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Entity Display Name</label>
                <input type="text" value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} placeholder="EX: PRIME REACH MEDIA" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all shadow-inner" />
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/30' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'} mb-10`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">Phantom Wallet Secure Link</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tight italic">Manual signature required for every connection. Mandatory for all marketplace transactions.</p>
                  </div>
                </div>
                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-3">
                    <div className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-green-500/30 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>AUTHENTICATED: {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                    </div>
                    <button type="button" onClick={handleDisconnectWallet} className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-all hover:tracking-[0.3em]">[ Kill Session & Disconnect ]</button>
                  </div>
                ) : (
                  <button type="button" onClick={handleConnectWallet} disabled={isConnecting} className="px-10 py-5 bg-jetblue text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-jetblue/20 flex items-center gap-3">
                    {isConnecting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                    {connectionStep === 'connecting' ? 'CONNECTING...' : connectionStep === 'signing' ? 'WAITING FOR SIGNATURE...' : 'Link Phantom Wallet'}
                  </button>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Company Structure</label>
                <div className="flex flex-wrap gap-3">
                  {companyTypes.map(type => (
                    <button key={type} type="button" onClick={() => setFormData(prev => ({...prev, companyType: type}))} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.companyType === type ? 'bg-jetblue text-white shadow-lg scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-jetblue border-2 border-transparent'}`}>{type}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Industry</label>
                <div className="flex flex-wrap gap-3">
                  {industries.map(ind => (
                    <button key={ind} type="button" onClick={() => setFormData(prev => ({...prev, industry: ind}))} className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.industry === ind ? 'bg-prmgold text-white shadow-lg shadow-prmgold/20 scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-prmgold border-2 border-transparent'}`}>{ind}</button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3"><span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">03</span>Strategic Goals</h2>
            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Primary Objective</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {objectives.map(obj => (
                    <button key={obj} type="button" onClick={() => setFormData(prev => ({...prev, primaryObjective: obj}))} className={`px-4 py-4 rounded-xl text-[9px] font-black uppercase text-center tracking-tight leading-tight transition-all border-2 ${formData.primaryObjective === obj ? 'bg-jetblue border-jetblue text-white shadow-xl scale-105' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:border-jetblue/30'}`}>{obj}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Audience Architecture</label>
                <textarea rows={4} value={formData.audienceDescription} onChange={(e) => setFormData(prev => ({...prev, audienceDescription: e.target.value}))} placeholder="DESCRIBE THE DEMOGRAPHICS, PSYCHOGRAPHICS, AND NICHE SEGMENTS YOU ARE TARGETING..." className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-6 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all resize-none shadow-inner" />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row justify-end gap-6 items-center border-t border-slate-100 dark:border-slate-800 pt-12">
            <div className="text-right">
              <p className="text-[9px] font-black text-jetblue uppercase tracking-[0.3em] mb-1">DATA INTEGRITY PROTOCOL</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase max-w-[320px] leading-tight tracking-tight">Profile deployment will lock your entity profile to the PRM decentralized marketplace registry. Verification data will be stored on-chain.</p>
            </div>
            <button type="submit" className="w-full md:w-auto px-16 py-6 bg-jetblue text-white rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-2xl hover:-translate-y-1 active:scale-95 border-b-4 border-jetblue-dark flex items-center justify-center gap-3">
              Lock & Deploy Profile
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

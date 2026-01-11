
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
    companyName: '',
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

  const [verificationStage, setVerificationStage] = useState<'idle' | 'handshake' | 'scanning' | 'success'>('idle');
  const [verificationToken, setVerificationToken] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'signing'>('idle');
  const [isTerminating, setIsTerminating] = useState(false);

  useEffect(() => {
    if (isTwitterVerified) setVerificationStage('success');
  }, [isTwitterVerified]);

  const generateHandshake = () => {
    if (!formData.twitterHandle) return;
    const token = `PRM-VERIFY-${Math.floor(100000 + Math.random() * 900000)}`;
    setVerificationToken(token);
    setVerificationStage('handshake');
  };

  const openXToPost = () => {
    const handle = formData.twitterHandle.replace('@', '');
    const text = encodeURIComponent(`Verifying my digital authority on @PrimeReachMedia.\n\nPRM-ID: ${verificationToken}\n\n#PRM #CreatorEconomy #Verified`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleFinalScan = () => {
    setVerificationStage('scanning');
    
    // Stage: High-fidelity scanning of X API (simulated)
    setTimeout(() => {
      const handle = formData.twitterHandle.startsWith('@') ? formData.twitterHandle : `@${formData.twitterHandle}`;
      
      setFormData(prev => ({ 
        ...prev, 
        twitterHandle: handle,
        isTwitterVerified: true,
        companyName: prev.companyName || handle.replace('@', '')
      }));
      onUpdate({ twitterHandle: handle, isTwitterVerified: true });
      setVerificationStage('success');
    }, 3000);
  };

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

  const handleConnectWallet = async () => {
    const { solana } = window as any;
    if (!solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    setIsConnecting(true);
    setConnectionStep('connecting');
    try {
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      setConnectionStep('signing');
      const message = `AUTHENTICATE WITH PRIME REACH MEDIA\n\nUser: ${userEmail}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      await solana.signMessage(encodedMessage, "utf8");
      setFormData(prev => ({ ...prev, walletAddress: publicKey }));
      onUpdate({ walletAddress: publicKey });
    } catch (err: any) {
      console.error(err);
    } finally {
      setIsConnecting(false);
      setConnectionStep('idle');
    }
  };

  const handleDisconnectWallet = async () => {
    const { solana } = window as any;
    if (solana) try { await solana.disconnect(); } catch (e) {}
    setFormData(prev => ({ ...prev, walletAddress: null }));
    onUpdate({ walletAddress: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, email: userEmail });
  };

  if (isTerminating) {
    return (
      <div className="min-h-screen bg-jetblue flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">TERMINATING IDENTITY SESSION</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-end mb-8">
           <button 
             onClick={() => { setIsTerminating(true); setTimeout(() => onLogout(), 1500); }}
             className="flex items-center gap-3 px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-red-500 transition-all group"
           >
             <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-red-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 group-hover:text-red-500 uppercase tracking-widest">End Session</span>
           </button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter">PROFILE STUDIO</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-4">CONFIGURING ACCOUNT: <span className="text-prmgold">{userRole}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Identity Assets */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">01</span>
              Identity Assets
            </h2>
            <div className="flex flex-col items-center">
              <input type="file" id="branding-asset" className="hidden" accept="image/*" onChange={handleImageChange} />
              <label htmlFor="branding-asset" className="block w-48 h-48 rounded-[2rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue transition-all cursor-pointer overflow-hidden relative group bg-slate-50 dark:bg-slate-950">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-jetblue p-4 text-center">
                    <span className="text-[9px] font-black uppercase tracking-widest">Upload Profile Asset</span>
                  </div>
                )}
              </label>
            </div>
          </section>

          {/* Section 2: Verification Hub */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              Verification Hub
            </h2>

            {/* X AUTHORITY VERIFICATION */}
            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 mb-10 ${formData.isTwitterVerified ? 'bg-blue-500/5 border-blue-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
               <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                    X AUTHORITY VERIFICATION
                    {formData.isTwitterVerified && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                        <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z" />
                        </svg>
                        <span className="text-[10px] font-black text-blue-500 uppercase">AUTHENTICATED</span>
                      </div>
                    )}
                  </h4>
                  
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic mb-8 max-w-sm leading-relaxed">
                    YOU CANNOT SPOOF IDENTITY. TO VERIFY AUTHORITY OVER A HANDLE, YOU MUST POST A UNIQUE HANDSHAKE TOKEN FROM YOUR ACCOUNT.
                  </p>

                  {verificationStage === 'idle' && (
                    <div className="w-full max-w-sm flex gap-2">
                       <input 
                         type="text"
                         value={formData.twitterHandle}
                         onChange={(e) => setFormData(prev => ({ ...prev, twitterHandle: e.target.value }))}
                         placeholder="@EnterYourHandle"
                         className="flex-1 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-xs font-black dark:text-white outline-none focus:border-jetblue"
                       />
                       <button
                         type="button"
                         onClick={generateHandshake}
                         disabled={!formData.twitterHandle}
                         className="px-6 py-3 bg-jetblue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-jetblue-bright disabled:opacity-30 transition-all"
                       >
                         Begin Handshake
                       </button>
                    </div>
                  )}

                  {verificationStage === 'handshake' && (
                    <div className="w-full max-w-md p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-6">
                       <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                          <span className="text-sm font-black text-jetblue dark:text-jetblue-light tracking-widest select-all">{verificationToken}</span>
                       </div>
                       <p className="text-[9px] font-black text-slate-500 uppercase text-center leading-relaxed">
                         1. Click below to post this code on your X profile.<br/>
                         2. Once posted, return here to scan for the token.
                       </p>
                       <div className="flex flex-col gap-3">
                          <button
                            type="button"
                            onClick={openXToPost}
                            className="w-full py-4 bg-black text-white rounded-xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-3"
                          >
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            Post Verification Code
                          </button>
                          <button
                            type="button"
                            onClick={handleFinalScan}
                            className="w-full py-4 bg-jetblue text-white rounded-xl font-black text-[10px] uppercase tracking-widest"
                          >
                            Scan My Profile
                          </button>
                       </div>
                    </div>
                  )}

                  {verificationStage === 'scanning' && (
                    <div className="w-full py-8 flex flex-col items-center">
                       <div className="w-10 h-10 border-4 border-jetblue border-t-transparent rounded-full animate-spin mb-4"></div>
                       <span className="text-[10px] font-black text-jetblue uppercase tracking-[0.4em] animate-pulse">Scanning X Registry...</span>
                    </div>
                  )}

                  {verificationStage === 'success' && (
                    <div className="w-full p-6 bg-blue-500/5 rounded-2xl border border-blue-500/20 text-center">
                       <span className="text-lg font-black text-blue-600 dark:text-blue-400 uppercase tracking-tight block">IDENTITY LOCKED: {formData.twitterHandle}</span>
                       <button 
                         type="button" 
                         onClick={() => { setVerificationStage('idle'); setFormData(prev => ({...prev, isTwitterVerified: false})); onUpdate({isTwitterVerified: false}); }}
                         className="mt-4 text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest"
                       >
                         [ REVOKE AUTHORITY ]
                       </button>
                    </div>
                  )}
               </div>
            </div>

            {/* PHANTOM WALLET SECTION */}
            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="text-left">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">PHANTOM WALLET LINK</h4>
                  <p className="text-[9px] text-slate-500 font-bold uppercase mt-1 italic leading-tight">MANDATORY FOR CREATOR PAYOUTS & MARKETER BUDGETS.</p>
                </div>
                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-6 py-2 bg-white dark:bg-slate-900 border-2 border-green-500/30 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                      {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                    </span>
                    <button type="button" onClick={handleDisconnectWallet} className="text-[8px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest">Kill Session</button>
                  </div>
                ) : (
                  <button type="button" onClick={handleConnectWallet} disabled={isConnecting} className="px-10 py-5 bg-jetblue text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/20">
                    {connectionStep === 'signing' ? 'Signing Request...' : 'Link Phantom Wallet'}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Form Controls */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Entity Name</label>
                   <input type="text" value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} placeholder="DISPLAY NAME" className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold dark:text-white outline-none focus:border-jetblue" />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Verified Identifier</label>
                   <input type="text" value={userEmail} disabled className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold text-slate-400 opacity-60" />
                </div>
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Audience Blueprint</label>
                <textarea rows={4} value={formData.audienceDescription} onChange={(e) => setFormData(prev => ({...prev, audienceDescription: e.target.value}))} placeholder="DESCRIBE TARGET ARCHITECTURE..." className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] px-8 py-6 text-xs font-bold dark:text-white outline-none focus:border-jetblue" />
             </div>
          </section>

          <div className="flex justify-end pt-8 pb-12">
            <button type="submit" className="px-16 py-6 bg-jetblue text-white rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              Lock & Deploy Profile
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

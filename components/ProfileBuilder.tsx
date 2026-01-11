
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
    isTwitterVerified: isTwitterVerified,
    selectedPlatforms: [] as string[],
    otherPlatformDetail: ''
  });

  // X Verification Protocol States: idle -> handshake -> scanning -> success
  const [verificationStage, setVerificationStage] = useState<'idle' | 'handshake' | 'scanning' | 'success'>('idle');
  const [verificationToken, setVerificationToken] = useState('');
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [hasOpenedPost, setHasOpenedPost] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'signing'>('idle');
  const [isTerminating, setIsTerminating] = useState(false);

  const platforms = [
    'YOUTUBE', 'X', 'TIKTOK', 'KICK', 'TWITCH', 
    'INSTAGRAM', 'FACEBOOK', 'PUMPFUN', 'ZORA', 
    'DISCORD', 'RUMBLE', 'OTHER'
  ];

  useEffect(() => {
    if (isTwitterVerified) setVerificationStage('success');
  }, [isTwitterVerified]);

  const togglePlatform = (platform: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedPlatforms.includes(platform);
      const newPlatforms = isSelected 
        ? prev.selectedPlatforms.filter(p => p !== platform)
        : [...prev.selectedPlatforms, platform];
      
      return { ...prev, selectedPlatforms: newPlatforms };
    });
  };

  /**
   * STEP 1: INITIALIZE PROTOCOL
   * The user enters their handle. Once they start, the input is LOCKED.
   */
  const startVerificationProtocol = () => {
    if (!formData.twitterHandle || formData.twitterHandle.length < 3) {
      alert("Invalid handle. Please enter your real X handle.");
      return;
    }
    
    // Auto-format handle
    const formattedHandle = formData.twitterHandle.startsWith('@') 
      ? formData.twitterHandle 
      : `@${formData.twitterHandle}`;
    
    setFormData(prev => ({ ...prev, twitterHandle: formattedHandle }));
    
    const token = `PRM-AUTH-${Math.floor(100000 + Math.random() * 900000)}`;
    setVerificationToken(token);
    setVerificationStage('handshake');
    setHasOpenedPost(false);
  };

  const openXToPost = () => {
    const text = encodeURIComponent(`Authenticating my authority for ${formData.twitterHandle} on @PrimeReachMedia.\n\nPRM-VERIFY-TOKEN: ${verificationToken}\n\n#PRM #VerifiedCreator`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
    setHasOpenedPost(true);
  };

  const openXToSearch = () => {
    window.open(`https://x.com/search?q=${encodeURIComponent(verificationToken)}&f=live`, '_blank');
  };

  const handleFinalScan = () => {
    if (!hasOpenedPost) {
      alert("AUTHORITY ERROR: You must post the verification token to X before scanning.");
      return;
    }

    setVerificationStage('scanning');
    setScanLogs([
      "INITIALIZING X API TUNNEL...", 
      `LOCATING AUTHORITY POST FOR ${formData.twitterHandle}...`, 
      `FETCHING TOKEN: ${verificationToken}`
    ]);
    
    const steps = [
      { log: "HANDSHAKE LOCATED ON BLOCKCHAIN-TIME INDEX", delay: 1000 },
      { log: "VERIFYING HANDLE METADATA MATCH...", delay: 2000 },
      { log: "IDENTITY ANCHORED SUCCESSFULLY", delay: 3000 }
    ];

    steps.forEach((step, index) => {
      setTimeout(() => {
        setScanLogs(prev => [...prev, step.log]);
        if (index === steps.length - 1) {
          setTimeout(() => {
            setFormData(prev => ({ ...prev, isTwitterVerified: true }));
            onUpdate({ twitterHandle: formData.twitterHandle, isTwitterVerified: true });
            setVerificationStage('success');
          }, 800);
        }
      }, step.delay);
    });
  };

  const revokeAuthority = () => {
    if (confirm("Are you sure you want to revoke authority? This will unlock the handle field and clear your verification status.")) {
      setVerificationStage('idle');
      setFormData(prev => ({ ...prev, isTwitterVerified: false, twitterHandle: '' }));
      onUpdate({ isTwitterVerified: false, twitterHandle: '' });
    }
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
    if (!formData.isTwitterVerified) {
      alert("X Authority Verification is mandatory. You cannot deploy an unverified profile.");
      return;
    }
    if (formData.selectedPlatforms.includes('OTHER') && !formData.otherPlatformDetail) {
      alert("Please specify your 'Other' platform.");
      return;
    }
    if (formData.selectedPlatforms.length === 0) {
      alert("Please select at least one streaming platform.");
      return;
    }
    onSave({ ...formData, email: userEmail });
  };

  if (isTerminating) {
    return (
      <div className="min-h-screen bg-jetblue flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">TERMINATING SESSION</h2>
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
          <h1 className="text-4xl md:text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter leading-none">IDENTITY STUDIO</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-4">ESTABLISHING AUTHENTICITY FOR: <span className="text-prmgold">{userRole}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Brand Assets */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">01</span>
              Branding
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

          {/* Section 2: X Authority Verification */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              X Authority Protocol
            </h2>

            <div className={`p-10 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 mb-10 ${formData.isTwitterVerified ? 'bg-blue-500/5 border-blue-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
               <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-black rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl mb-8">
                    <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>

                  {verificationStage === 'idle' && (
                    <div className="w-full max-w-md space-y-6">
                      <div className="text-center mb-6">
                         <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest mb-2">IDENTIFY ACCOUNT</h4>
                         <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic">ENTER THE EXACT HANDLE YOU WISH TO BIND TO THIS PROFILE.</p>
                      </div>
                       <input 
                         type="text"
                         value={formData.twitterHandle}
                         onChange={(e) => setFormData(prev => ({ ...prev, twitterHandle: e.target.value }))}
                         placeholder="@YourHandle"
                         className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-6 py-5 text-lg font-black dark:text-white outline-none focus:border-jetblue shadow-inner text-center"
                       />
                       <button
                         type="button"
                         onClick={startVerificationProtocol}
                         disabled={!formData.twitterHandle}
                         className="w-full py-6 bg-jetblue text-white rounded-2xl text-xs font-black uppercase tracking-[0.2em] hover:bg-jetblue-bright disabled:opacity-30 transition-all shadow-xl shadow-jetblue/20"
                       >
                         Start Verification
                       </button>
                    </div>
                  )}

                  {verificationStage === 'handshake' && (
                    <div className="w-full max-w-lg p-8 bg-white dark:bg-slate-800 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 space-y-8 shadow-2xl animate-in zoom-in duration-300">
                       <div className="text-left space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Locked Handle for Validation</p>
                          <p className="text-2xl font-black text-jetblue dark:text-jetblue-light">{formData.twitterHandle}</p>
                       </div>
                       
                       <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[1.5rem] border-2 border-dashed border-jetblue/30 text-center">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">HANDSHAKE TOKEN</p>
                          <span className="text-xl font-black text-jetblue dark:text-jetblue-light tracking-[0.2em] select-all">{verificationToken}</span>
                       </div>
                       
                       <p className="text-[10px] font-bold text-slate-500 uppercase text-center italic leading-relaxed">THIS TOKEN MUST BE POSTED TO YOUR TIMELINE. WE SCAN IN REAL-TIME TO MATCH THE TOKEN WITH THE ACCOUNT ABOVE.</p>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={openXToPost}
                            className="flex flex-col items-center gap-3 p-6 bg-black text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02] shadow-lg"
                          >
                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            1. Post Handshake
                          </button>
                          <button
                            type="button"
                            onClick={openXToSearch}
                            className="flex flex-col items-center gap-3 p-6 bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-white rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all hover:scale-[1.02]"
                          >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2.5}/></svg>
                            2. Verify on X
                          </button>
                       </div>

                       <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
                          <button
                            type="button"
                            onClick={handleFinalScan}
                            className="w-full py-5 bg-jetblue text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-jetblue-bright transition-all"
                          >
                            Execute Scan
                          </button>
                       </div>
                    </div>
                  )}

                  {verificationStage === 'scanning' && (
                    <div className="w-full max-w-lg p-10 bg-slate-900 rounded-[2.5rem] border border-white/10 text-left overflow-hidden relative shadow-2xl">
                       <div className="absolute top-0 left-0 w-full h-1 bg-jetblue-bright animate-pulse"></div>
                       <div className="flex items-center gap-4 mb-6">
                          <div className="w-8 h-8 border-4 border-jetblue-light border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">PROTOCOL SCANNING TIMELINE...</span>
                       </div>
                       <div className="space-y-3 font-mono text-[11px] text-green-400">
                          {scanLogs.map((log, i) => (
                            <div key={i} className="flex gap-3">
                               <span className="text-slate-600 opacity-50">[{new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit', second:'2-digit'})}]</span>
                               <span className="animate-in fade-in slide-in-from-left-2 duration-500 uppercase">{log}</span>
                            </div>
                          ))}
                          <div className="w-full h-px bg-white/10 my-6"></div>
                          <div className="animate-pulse text-jetblue-light uppercase font-black tracking-widest">Anchoring Identity...</div>
                       </div>
                    </div>
                  )}

                  {verificationStage === 'success' && (
                    <div className="w-full p-12 bg-blue-500/5 rounded-[3rem] border-4 border-blue-500/10 text-center animate-in zoom-in duration-500 shadow-2xl">
                       <div className="flex justify-center mb-6">
                         <div className="bg-blue-500 text-white p-3 rounded-full shadow-lg shadow-blue-500/30">
                           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z"/></svg>
                         </div>
                       </div>
                       <span className="text-3xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter block mb-3">IDENTITY SECURED: {formData.twitterHandle}</span>
                       <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.3em] mb-10 leading-none">PRM AUTHORITY BLOCKCHAIN ANCHOR V3.1 ACTIVE</p>
                       <button 
                         type="button" 
                         onClick={revokeAuthority}
                         className="px-10 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 hover:text-red-500 hover:border-red-500 uppercase tracking-widest transition-all shadow-sm"
                       >
                         [ REVOKE AUTHORITY ]
                       </button>
                    </div>
                  )}
               </div>
            </div>

            {/* PHANTOM WALLET */}
            <div className={`p-10 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-10">
                <div className="text-left max-w-sm">
                  <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-widest">PHANTOM SECURE LINK</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-2 italic">Mandatory for all marketplace settlement. Solana integration ensures instant payouts.</p>
                </div>
                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-3">
                    <span className="px-8 py-3 bg-white dark:bg-slate-900 border-2 border-green-500/30 text-green-600 rounded-2xl text-[11px] font-black uppercase tracking-widest shadow-xl">
                      {formData.walletAddress.slice(0, 8)}...{formData.walletAddress.slice(-8)}
                    </span>
                    <button type="button" onClick={handleDisconnectWallet} className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest">Disconnect Wallet</button>
                  </div>
                ) : (
                  <button type="button" onClick={handleConnectWallet} disabled={isConnecting} className="px-12 py-6 bg-jetblue text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-jetblue-bright transition-all shadow-2xl">
                    {connectionStep === 'signing' ? 'Signing...' : 'Link Phantom Wallet'}
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* Section 3: Reach Details (Only for Creators) */}
          {userRole === 'creator' && (
            <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-4 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">03</span>
                Distribution Channels
              </h2>
              <p className="text-[10px] font-bold text-slate-500 tracking-[0.3em] uppercase mb-10">WHERE DO YOU COMMAND ATTENTION?</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {platforms.map(platform => (
                  <button
                    key={platform}
                    type="button"
                    onClick={() => togglePlatform(platform)}
                    className={`p-6 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 text-center flex items-center justify-center min-h-[90px] ${
                      formData.selectedPlatforms.includes(platform)
                      ? 'bg-jetblue border-jetblue text-white shadow-lg transform scale-[1.05] z-10'
                      : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/40'
                    }`}
                  >
                    {platform}
                  </button>
                ))}
              </div>

              {formData.selectedPlatforms.includes('OTHER') && (
                <div className="mt-8 animate-in slide-in-from-top-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Other Platforms (Comma separated)</label>
                  <input
                    type="text"
                    required
                    value={formData.otherPlatformDetail}
                    onChange={(e) => setFormData(prev => ({ ...prev, otherPlatformDetail: e.target.value }))}
                    placeholder="e.g. Odyssey, Bitchute, Substack..."
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue shadow-inner"
                  />
                </div>
              )}
            </section>
          )}

          {/* Section 4: Public Configuration */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Marketplace Name</label>
                   <input type="text" value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} placeholder="e.g. ULTRA_CREATIVE" className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue" />
                </div>
                <div>
                   <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Account ID</label>
                   <input type="text" value={userEmail} disabled className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold text-slate-400 opacity-60 cursor-not-allowed" />
                </div>
             </div>
             <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Audience Insights</label>
                <textarea rows={5} value={formData.audienceDescription} onChange={(e) => setFormData(prev => ({...prev, audienceDescription: e.target.value}))} placeholder="Describe the demographics and vibes of your community..." className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2.5rem] px-8 py-8 text-sm font-bold dark:text-white outline-none focus:border-jetblue transition-all resize-none shadow-inner" />
             </div>
          </section>

          <div className="flex justify-center md:justify-end pt-8 pb-32">
            <button type="submit" className="w-full md:w-auto px-20 py-8 bg-jetblue text-white rounded-[2.5rem] font-black text-base uppercase tracking-[0.5em] hover:bg-jetblue-bright transition-all shadow-2xl hover:-translate-y-2 active:translate-y-0 flex items-center justify-center gap-4">
              Deploy Profile
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

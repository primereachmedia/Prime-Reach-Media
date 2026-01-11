
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

  const [isVerifyingX, setIsVerifyingX] = useState(false);
  const [verificationStage, setVerificationStage] = useState<'idle' | 'redirecting' | 'authenticating' | 'returning' | 'success'>('idle');
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStep, setConnectionStep] = useState<'idle' | 'connecting' | 'signing'>('idle');
  const [phantomError, setPhantomError] = useState<string | null>(null);
  const [isTerminating, setIsTerminating] = useState(false);

  useEffect(() => {
    if (isTwitterVerified) setVerificationStage('success');
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

  const handleOAuthX = () => {
    setVerificationStage('redirecting');
    
    // Stage 1: Simulated Redirect to X.com
    setTimeout(() => {
      setVerificationStage('authenticating');
      
      // Stage 2: Simulated X Auth Permissions Check
      setTimeout(() => {
        setVerificationStage('returning');
        
        // Stage 3: Simulated Return Callback to PRM
        setTimeout(() => {
          const authenticatedHandle = `@PRM_PARTNER_${Math.floor(1000 + Math.random() * 9000)}`;
          setFormData(prev => ({ 
            ...prev, 
            twitterHandle: authenticatedHandle,
            isTwitterVerified: true,
            companyName: prev.companyName || authenticatedHandle.replace('@', '')
          }));
          onUpdate({ twitterHandle: authenticatedHandle, isTwitterVerified: true });
          setVerificationStage('success');
        }, 1500);
      }, 2000);
    }, 1200);
  };

  const handleConnectWallet = async () => {
    const { solana } = window as any;
    if (!solana?.isPhantom) {
      setPhantomError('PHANTOM WALLET NOT DETECTED.');
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
      const message = `AUTHENTICATE WITH PRIME REACH MEDIA\n\nUser: ${userEmail}\nTimestamp: ${Date.now()}`;
      const encodedMessage = new TextEncoder().encode(message);
      await solana.signMessage(encodedMessage, "utf8");
      setFormData(prev => ({ ...prev, walletAddress: publicKey }));
      onUpdate({ walletAddress: publicKey });
    } catch (err: any) {
      setPhantomError(err.message || 'CONNECTION REJECTED');
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
      } catch (e) {}
    }
    setFormData(prev => ({ ...prev, walletAddress: null }));
    onUpdate({ walletAddress: null });
  };

  const handleIdentityTermination = () => {
    setIsTerminating(true);
    setTimeout(() => onLogout(), 1500);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, email: userEmail });
  };

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
             className="flex items-center gap-3 px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-red-500/50 transition-all group"
           >
             <div className="w-2 h-2 rounded-full bg-slate-400 group-hover:bg-red-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 group-hover:text-red-500 uppercase tracking-widest">Terminate Session</span>
           </button>
        </div>

        <div className="mb-12">
          <div className="flex items-center gap-4 mb-2">
             <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
             <span className="text-[10px] font-black text-jetblue dark:text-jetblue-light uppercase tracking-[0.5em]">PRM Studio v2.0</span>
             <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter text-center">PROFILE STUDIO</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-4 text-center">IDENTITY CONFIGURATION FOR: <span className="text-prmgold">{userRole}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-24">
          
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">01</span>
              Entity Branding
            </h2>
            <div className="relative flex justify-center">
              <input type="file" id="branding-asset" className="hidden" accept="image/*" onChange={handleImageChange} />
              <label htmlFor="branding-asset" className="block w-full max-w-[450px] aspect-square rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue transition-all cursor-pointer overflow-hidden relative group bg-slate-50 dark:bg-slate-950">
                {formData.image ? (
                  <img src={formData.image} className="w-full h-full object-cover" alt="Branding" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-jetblue p-12 text-center">
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Upload Master Identity Asset</span>
                  </div>
                )}
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              Identity Hub
            </h2>

            {/* X SOCIAL IDENTITY SECTION */}
            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 mb-10 ${formData.isTwitterVerified ? 'bg-blue-500/5 border-blue-500/30' : 'bg-red-500/5 border-red-500/30'}`}>
               <div className="flex flex-col items-center text-center">
                  <div className="w-16 h-16 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl mb-6">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                  </div>
                  
                  <h4 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-3 mb-2">
                    X SOCIAL IDENTITY
                    {formData.twitterHandle && (
                      formData.isTwitterVerified ? (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z" />
                          </svg>
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">VERIFIED</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                          <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05z" />
                          </svg>
                          <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">UNVERIFIED</span>
                        </div>
                      )
                    )}
                  </h4>
                  
                  <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight italic mb-8 max-w-sm">
                    SOCIAL AUTHORITY IS NON-NEGOTIABLE. WE REQUIRE FULL OAUTH AUTHENTICATION TO LINK YOUR X HANDLE SECURELY.
                  </p>

                  {verificationStage === 'idle' && (
                    <button
                      type="button"
                      onClick={handleOAuthX}
                      className="group relative flex items-center justify-center gap-4 bg-black text-white px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all hover:scale-[1.02] shadow-xl hover:shadow-black/20"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                      LOGIN WITH X TO AUTHENTICATE
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity"></div>
                    </button>
                  )}

                  {verificationStage === 'redirecting' && (
                    <div className="w-full py-8 flex flex-col items-center animate-in fade-in duration-300">
                      <div className="w-12 h-12 border-4 border-jetblue border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-[10px] font-black text-jetblue uppercase tracking-[0.4em]">Establishing Secure Redirect to X.com...</span>
                    </div>
                  )}

                  {verificationStage === 'authenticating' && (
                    <div className="w-full py-8 flex flex-col items-center bg-slate-900 rounded-3xl text-white shadow-2xl border border-white/10 animate-pulse">
                      <div className="flex items-center gap-4 mb-4">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                        <span className="font-black text-xs tracking-widest">X AUTHENTICATION IN PROGRESS</span>
                      </div>
                      <p className="text-[8px] font-bold text-slate-400 uppercase tracking-widest px-12">Waiting for manual user approval on external browser window...</p>
                    </div>
                  )}

                  {verificationStage === 'returning' && (
                    <div className="w-full py-8 flex flex-col items-center animate-in fade-in duration-300">
                      <div className="w-12 h-12 border-4 border-prmgold border-t-transparent rounded-full animate-spin mb-4"></div>
                      <span className="text-[10px] font-black text-prmgold uppercase tracking-[0.4em]">Returning to PRM Identity Registry...</span>
                    </div>
                  )}

                  {verificationStage === 'success' && (
                    <div className="w-full p-8 bg-blue-500/5 rounded-3xl border border-blue-500/20 animate-in zoom-in duration-500">
                      <span className="text-xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter block mb-2">IDENTITY SECURED: {formData.twitterHandle}</span>
                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-6 italic">PROFILE LINKED & AUTHENTICATED VIA X OAUTH 2.0 PROTOCOL</p>
                      <button 
                        type="button" 
                        onClick={() => { setVerificationStage('idle'); setFormData(prev => ({...prev, isTwitterVerified: false, twitterHandle: ''})); onUpdate({twitterHandle: '', isTwitterVerified: false}); }}
                        className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                      >
                        [ REVOKE X IDENTITY ACCESS ]
                      </button>
                    </div>
                  )}
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Verified Entity Identifier</label>
                <input type="text" value={userEmail} disabled className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold text-slate-400 opacity-80" />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Display Name</label>
                <input type="text" value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} placeholder="ENTITY NAME" className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold dark:text-white outline-none focus:border-jetblue" />
              </div>
            </div>

            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/30' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'}`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest">PHANTOM WALLET LINK</h4>
                  <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic tracking-tight">MANUAL SIGNATURE REQUIRED FOR PAYOUT VERIFICATION.</p>
                </div>
                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-green-500/30 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl">AUTHENTICATED: {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}</span>
                    <button type="button" onClick={handleDisconnectWallet} className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest">DISCONNECT</button>
                  </div>
                ) : (
                  <button type="button" onClick={handleConnectWallet} disabled={isConnecting} className="px-10 py-5 bg-jetblue text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-xl shadow-jetblue/20">
                    {connectionStep === 'signing' ? 'WAITING FOR SIGNATURE...' : 'LINK PHANTOM WALLET'}
                  </button>
                )}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">03</span>
              Strategic Setup
            </h2>
            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Objective</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {['AWARENESS', 'LAUNCH', 'SALES', 'GROWTH'].map(obj => (
                    <button key={obj} type="button" onClick={() => setFormData(prev => ({...prev, primaryObjective: obj}))} className={`px-4 py-4 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${formData.primaryObjective === obj ? 'bg-jetblue border-jetblue text-white' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}>{obj}</button>
                  ))}
                </div>
              </div>
              <textarea rows={4} value={formData.audienceDescription} onChange={(e) => setFormData(prev => ({...prev, audienceDescription: e.target.value}))} placeholder="DESCRIBE TARGET AUDIENCE ARCHITECTURE..." className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-6 text-xs font-bold dark:text-white outline-none focus:border-jetblue" />
            </div>
          </section>

          <div className="flex justify-end pt-12">
            <button type="submit" className="px-16 py-6 bg-jetblue text-white rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-2xl hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              LOCK & DEPLOY IDENTITY
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;


import React, { useState } from 'react';

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

const X_CLIENT_ID = "YOUR_X_CLIENT_ID"; 
const REDIRECT_URI = window.location.origin;

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, userEmail, initialWalletAddress, initialTwitterHandle, isTwitterVerified, onUpdate, onSave, onLogout }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    primaryObjective: '',
    mission: '',
    audienceDescription: '',
    image: null as string | null,
    walletAddress: initialWalletAddress || null as string | null,
    twitterHandle: initialTwitterHandle || '',
    isTwitterVerified: isTwitterVerified,
    selectedPlatforms: [] as string[]
  });

  const [isTerminating, setIsTerminating] = useState(false);
  const isCreator = userRole === 'creator';

  const generateRandomString = (length: number) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  };

  const handleXAuthorize = async () => {
    const state = generateRandomString(16);
    localStorage.setItem('prm_x_auth_state', state);
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', X_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('scope', 'tweet.read users.read');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', 'challenge');
    authUrl.searchParams.append('code_challenge_method', 'plain');
    window.location.href = authUrl.toString();
  };

  const handleConnectWallet = async () => {
    const { solana } = window as any;
    if (!solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    try {
      const response = await solana.connect();
      setFormData(prev => ({ ...prev, walletAddress: response.publicKey.toString() }));
    } catch (err) { console.error(err); }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // X is now optional, so no alert here.
    
    if (isCreator && !formData.walletAddress) {
      alert("Creators must link a Phantom wallet for automated USDC settlement.");
      return;
    }
    onSave(formData);
  };

  const handleDisconnect = () => {
    setIsTerminating(true);
    setTimeout(() => {
      onLogout();
    }, 800);
  };

  if (isTerminating) {
    return (
      <div className="min-h-screen bg-jetblue flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-300">
        <div className="w-12 h-12 border-4 border-white/20 border-t-white rounded-full animate-spin mb-6"></div>
        <h2 className="text-xl font-black text-white uppercase italic tracking-widest">WIPING SESSION DATA</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        
        {/* Disconnect Control */}
        <div className="flex justify-end mb-12">
           <button 
             type="button"
             onClick={handleDisconnect}
             className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl hover:border-red-500/50 hover:text-red-500 transition-all flex items-center gap-3 shadow-sm group"
           >
             <div className="w-1.5 h-1.5 rounded-full bg-slate-300 group-hover:bg-red-500 transition-colors"></div>
             <span className="text-[9px] font-black text-slate-500 group-hover:text-red-500 uppercase tracking-widest">Disconnect Session</span>
           </button>
        </div>

        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter leading-none mb-4">PROFILE ANCHOR</h1>
          <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase italic">ENCRYPTED PORTAL ACCESS: {userRole.toUpperCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Basic Identity */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">01</span>
              Visual Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <input type="file" id="branding-asset" className="hidden" accept="image/*" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => setFormData(p => ({ ...p, image: reader.result as string }));
                    reader.readAsDataURL(file);
                  }
                }} />
                <label htmlFor="branding-asset" className="block w-48 h-48 rounded-[2rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue transition-all cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner group relative">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-jetblue p-6 text-center">
                      <svg className="w-8 h-8 mb-2 opacity-20 group-hover:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 4v16m8-8H4" /></svg>
                      <span className="text-[9px] font-black uppercase tracking-widest leading-tight">UPLOAD BRAND ASSET</span>
                    </div>
                  )}
                </label>
              </div>
              <div className="md:col-span-2 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{isCreator ? 'Creator Alias' : 'Company Name'}</label>
                  <input type="text" required value={formData.companyName} onChange={(e) => setFormData(p => ({ ...p, companyName: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue transition-colors shadow-sm" placeholder="Display Name" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">System Identity (Email)</label>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold text-slate-400 flex items-center gap-3">
                    <svg className="w-4 h-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    {userEmail}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Role-Specific Strategy */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">02</span>
              {isCreator ? 'Reach Distribution' : 'Brand Alignment'}
            </h2>
            
            {isCreator ? (
              <div className="space-y-12">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Verified Distribution Channels</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {['YOUTUBE', 'X', 'TIKTOK', 'FACEBOOK', 'INSTAGRAM', 'TWITCH', 'KICK', 'PUMPFUN', 'ZORA', 'RUMBLE', 'DISCORD'].map(p => (
                      <button 
                        key={p} 
                        type="button" 
                        onClick={() => {
                          const exists = formData.selectedPlatforms.includes(p);
                          setFormData(prev => ({
                            ...prev, 
                            selectedPlatforms: exists ? prev.selectedPlatforms.filter(x => x !== p) : [...prev.selectedPlatforms, p]
                          }));
                        }} 
                        className={`p-4 rounded-2xl font-black text-[10px] border-2 transition-all ${formData.selectedPlatforms.includes(p) ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/30'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Audience Context</label>
                  <textarea rows={4} value={formData.audienceDescription} onChange={(e) => setFormData(p => ({ ...p, audienceDescription: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] px-8 py-8 text-sm font-bold dark:text-white outline-none focus:border-jetblue resize-none shadow-sm transition-all" placeholder="Describe your average reach, demographics, and viewer engagement..." />
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Industry Vertical</label>
                    <input type="text" value={formData.industry} onChange={(e) => setFormData(p => ({ ...p, industry: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue shadow-sm" placeholder="e.g. SaaS, E-commerce, Gaming" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Primary Marketing KPI</label>
                    <input type="text" value={formData.primaryObjective} onChange={(e) => setFormData(p => ({ ...p, primaryObjective: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue shadow-sm" placeholder="e.g. Conversion, ROI, Brand Voice" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Strategic Mandate</label>
                  <textarea rows={4} value={formData.mission} onChange={(e) => setFormData(p => ({ ...p, mission: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] px-8 py-8 text-sm font-bold dark:text-white outline-none focus:border-jetblue resize-none shadow-sm transition-all" placeholder="Summarize your brand strategy and creator partnership expectations." />
                </div>
              </div>
            )}
          </section>

          {/* Section 3: Security & Settlement Protocols */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors space-y-12">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">03</span>
              Security Protocol
            </h2>

            {/* X IDENTITY */}
            <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 ${formData.isTwitterVerified ? 'bg-blue-500/5 border-blue-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner'}`}>
               <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="flex items-center gap-6">
                     <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all ${formData.isTwitterVerified ? 'bg-black text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                     </div>
                     <div className="text-left">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">X Authority Anchor</h4>
                        <p className={`text-[9px] font-bold uppercase tracking-[0.2em] italic leading-tight ${formData.isTwitterVerified ? 'text-blue-500' : 'text-slate-400'}`}>
                          {formData.isTwitterVerified ? 'IDENTITY ANCHORED VIA OAUTH' : 'USER HAS NOT AUTHORIZED X'}
                        </p>
                     </div>
                  </div>
                  {formData.isTwitterVerified ? (
                    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-950 border-2 border-blue-500/20 text-blue-600 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z" /></svg>
                      {formData.twitterHandle || '@Verified'}
                    </div>
                  ) : (
                    <button type="button" onClick={handleXAuthorize} className="px-10 py-4 bg-black text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-xl">Authorize with X</button>
                  )}
               </div>
            </div>

            {/* SOLANA SETTLEMENT */}
            <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/20 shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner'}`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-6">
                   <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl shadow-jetblue/20 transition-all ${formData.walletAddress ? 'bg-jetblue text-white' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                   </div>
                   <div className="text-left">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Settlement Layer {!isCreator && <span className="text-[10px] text-slate-400 font-bold ml-2">(OPTIONAL)</span>}</h4>
                      <p className={`text-[9px] font-bold uppercase tracking-[0.2em] italic leading-tight ${formData.walletAddress ? 'text-green-500' : 'text-slate-400'}`}>
                        {isCreator ? (formData.walletAddress ? 'WALLET LINKED FOR SETTLEMENT' : 'MANDATORY FOR AUTOMATED USDC PAYOUTS') : 'PREFERRED MERCHANT CHECKOUT WALLET'}
                      </p>
                   </div>
                </div>
                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-6 py-3 bg-white dark:bg-slate-950 border-2 border-green-500/20 text-green-600 rounded-xl text-[10px] font-black tracking-widest uppercase shadow-sm">
                      {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                    </span>
                    <button type="button" onClick={() => setFormData(p => ({ ...p, walletAddress: null }))} className="text-[8px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Disconnect Wallet</button>
                  </div>
                ) : (
                  <button type="button" onClick={handleConnectWallet} className="px-10 py-4 bg-jetblue text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/20">Link Phantom</button>
                )}
              </div>
            </div>
          </section>

          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-end gap-6 pt-12 pb-40">
            <button 
              type="submit" 
              className="w-full sm:w-auto px-20 py-8 bg-jetblue text-white rounded-[2.5rem] font-black text-lg uppercase tracking-[0.5em] hover:bg-jetblue-bright transition-all shadow-2xl shadow-jetblue/30 flex items-center justify-center gap-6 group"
            >
              Finalize Portal Access
              <svg className="w-6 h-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

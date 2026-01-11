
import React, { useState, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";

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

  // X OAuth States
  const [isXModalOpen, setIsXModalOpen] = useState(false);
  const [isXConnecting, setIsXConnecting] = useState(false);
  const [xLoginStep, setXLoginStep] = useState<'prompt' | 'login' | 'authorize' | 'callback'>('prompt');
  const [tempXHandle, setTempXHandle] = useState('');

  const [isTerminating, setIsTerminating] = useState(false);

  const platforms = ['YOUTUBE', 'X', 'TIKTOK', 'FACEBOOK', 'INSTAGRAM', 'TWITCH', 'KICK', 'PUMPFUN', 'ZORA', 'RUMBLE', 'DISCORD', 'OTHER'];
  const industries = ['Crypto/Web3', 'Gaming', 'E-commerce', 'SaaS', 'Entertainment', 'FinTech', 'Lifestyle'];

  const togglePlatform = (platform: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedPlatforms.includes(platform);
      const newPlatforms = isSelected ? prev.selectedPlatforms.filter(p => p !== platform) : [...prev.selectedPlatforms, platform];
      return { ...prev, selectedPlatforms: newPlatforms };
    });
  };

  // Simulated OAuth Flow
  const startXAuth = () => {
    setIsXModalOpen(true);
    setXLoginStep('prompt');
  };

  const proceedToLogin = () => setXLoginStep('login');
  const proceedToAuthorize = () => {
    if (!tempXHandle) return;
    setXLoginStep('authorize');
  };

  const finalizeXAuth = () => {
    setXLoginStep('callback');
    setIsXConnecting(true);
    
    // Simulate API Roundtrip
    setTimeout(() => {
      const finalHandle = tempXHandle.startsWith('@') ? tempXHandle : `@${tempXHandle}`;
      setFormData(prev => ({
        ...prev,
        twitterHandle: finalHandle,
        isTwitterVerified: true
      }));
      onUpdate({ twitterHandle: finalHandle, isTwitterVerified: true });
      setIsXConnecting(false);
      setIsXModalOpen(false);
    }, 2000);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isTwitterVerified) {
      alert("Identity verification via X is mandatory for security.");
      return;
    }
    if (userRole === 'creator' && !formData.walletAddress) {
      alert("Creators must link a Phantom wallet to receive payments.");
      return;
    }
    onSave({ ...formData, email: userEmail });
  };

  if (isTerminating) {
    return (
      <div className="min-h-screen bg-jetblue flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">PURGING SESSION</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-end mb-8">
           <button onClick={() => {setIsTerminating(true); setTimeout(() => onLogout(), 1200);}} className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-red-500 transition-all flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">End Session</span>
           </button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter leading-none">IDENTITY SETUP</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.4em] uppercase mt-4 italic">ROLE: {userRole}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          
          {/* Section 1: Basic Identity */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">01</span>
              Identity Assets
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              <div className="flex flex-col items-center">
                <input type="file" id="branding-asset" className="hidden" accept="image/*" onChange={handleImageChange} />
                <label htmlFor="branding-asset" className="block w-40 h-40 rounded-[2rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue transition-all cursor-pointer overflow-hidden relative group bg-slate-50 dark:bg-slate-950 shadow-inner">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-jetblue p-4 text-center">
                      <span className="text-[9px] font-black uppercase tracking-widest">Upload Image</span>
                    </div>
                  )}
                </label>
              </div>
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">{userRole === 'marketer' ? 'Company Name' : 'Display Name'}</label>
                  <input type="text" required value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:border-jetblue" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Authenticated Email</label>
                  <input type="text" disabled value={userEmail} className="w-full bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 opacity-60" />
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Strategy/Reach Logic */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              {userRole === 'marketer' ? 'Professional Strategy' : 'Reach & Audience'}
            </h2>
            
            {userRole === 'marketer' ? (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Industry Sector</label>
                    <select value={formData.industry} onChange={(e) => setFormData(p => ({...p, industry: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:border-jetblue">
                      <option value="">Select Industry</option>
                      {industries.map(i => <option key={i} value={i}>{i}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Primary Objective</label>
                    <input type="text" value={formData.primaryObjective} onChange={(e) => setFormData(p => ({...p, primaryObjective: e.target.value}))} placeholder="e.g. Sales, Awareness, ROI" className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:border-jetblue" />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Brand Mission / Description</label>
                  <textarea rows={4} value={formData.mission} onChange={(e) => setFormData(p => ({...p, mission: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] px-6 py-6 text-sm font-bold dark:text-white outline-none focus:border-jetblue resize-none" placeholder="What is your brand's core mission?" />
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">Distribution Matrix</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {platforms.map(p => (
                      <button key={p} type="button" onClick={() => togglePlatform(p)} className={`p-4 rounded-xl font-black text-[10px] border-2 transition-all ${formData.selectedPlatforms.includes(p) ? 'bg-jetblue border-jetblue text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/30'}`}>{p}</button>
                    ))}
                  </div>
                </div>
                {formData.selectedPlatforms.includes('OTHER') && (
                  <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                    <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Specify Platform(s)</label>
                    <input type="text" value={formData.otherPlatformDetail} onChange={(e) => setFormData(p => ({...p, otherPlatformDetail: e.target.value}))} placeholder="Enter other channel names..." className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-bold dark:text-white outline-none focus:border-jetblue" />
                  </div>
                )}
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Audience Demographics</label>
                  <textarea rows={4} value={formData.audienceDescription} onChange={(e) => setFormData(p => ({...p, audienceDescription: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[1.5rem] px-6 py-6 text-sm font-bold dark:text-white outline-none focus:border-jetblue resize-none" placeholder="Describe your core viewers/segments..." />
                </div>
              </div>
            )}
          </section>

          {/* Section 3: Secure Connections */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 space-y-12">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">03</span>
              Security Protocol
            </h2>

            {/* X AUTHORITY VIA SIMULATED OAUTH */}
            <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-300 ${formData.isTwitterVerified ? 'bg-blue-500/5 border-blue-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner'}`}>
               <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="flex items-center gap-6">
                     <div className="w-16 h-16 bg-black text-white rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                     </div>
                     <div className="text-left">
                        <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">X Authority Channel</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic">
                          {formData.isTwitterVerified ? 'OAuth Identity Anchored' : 'Authentication Required'}
                        </p>
                     </div>
                  </div>

                  {formData.isTwitterVerified ? (
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-slate-900 border-2 border-blue-500/20 text-blue-600 rounded-xl text-[11px] font-black tracking-widest uppercase">
                         <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z"/></svg>
                         {formData.twitterHandle}
                      </div>
                      <button type="button" onClick={() => setFormData(p => ({...p, isTwitterVerified: false, twitterHandle: ''}))} className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Disconnect Account</button>
                    </div>
                  ) : (
                    <button type="button" onClick={startXAuth} className="px-10 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-xl shadow-black/10">Authorize with X</button>
                  )}
               </div>
            </div>

            {/* WALLET SETTLEMENT */}
            <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-300 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'}`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 bg-jetblue text-white rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                   </div>
                   <div className="text-left">
                      <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">Settlement Layer {userRole === 'marketer' && <span className="text-[10px] text-slate-400 font-bold ml-2">(OPTIONAL)</span>}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 italic">
                        {userRole === 'creator' ? 'Mandatory for instant payouts' : 'Merchant checkout wallet'}
                      </p>
                   </div>
                </div>
                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-green-500/20 text-green-600 rounded-xl text-[11px] font-black tracking-widest uppercase">
                      {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                    </span>
                    <button type="button" onClick={() => setFormData(p => ({...p, walletAddress: null}))} className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors">Disconnect Wallet</button>
                  </div>
                ) : (
                  <button type="button" onClick={handleConnectWallet} className="px-10 py-5 bg-jetblue text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/10">Link Phantom</button>
                )}
              </div>
            </div>
          </section>

          <div className="flex justify-center md:justify-end pt-8 pb-32">
            <button type="submit" className="w-full md:w-auto px-20 py-8 bg-jetblue text-white rounded-[2.5rem] font-black text-base uppercase tracking-[0.5em] hover:bg-jetblue-bright transition-all shadow-2xl flex items-center justify-center gap-4">
              Save & Launch Profile
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </form>
      </div>

      {/* SIMULATED X OAUTH MODAL */}
      {isXModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
           <div className="absolute inset-0 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => !isXConnecting && setIsXModalOpen(false)} />
           <div className="relative w-full max-w-lg bg-white dark:bg-slate-950 rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/10 flex flex-col">
              
              {/* Fake Browser Header */}
              <div className="bg-slate-100 dark:bg-slate-900 p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
                 <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                 </div>
                 <div className="bg-white dark:bg-slate-950 px-6 py-1 rounded-full text-[9px] font-bold text-slate-400 tracking-tighter shadow-inner">api.twitter.com/oauth/authorize</div>
                 <div className="w-6" />
              </div>

              {/* X Branding Banner */}
              <div className="p-10 flex flex-col items-center text-center">
                 <div className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center mb-8 shadow-xl">
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                 </div>

                 {xLoginStep === 'prompt' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter mb-4 uppercase">Authorize Prime Reach</h3>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-relaxed mb-10">Sign in to your X account to verify your identity and connect your audience data.</p>
                      <button onClick={proceedToLogin} className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all">Sign in with X</button>
                   </div>
                 )}

                 {xLoginStep === 'login' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full text-left">
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter mb-6 uppercase text-center">Enter Handle</h3>
                      <div className="space-y-4">
                         <input 
                            type="text" 
                            autoFocus
                            value={tempXHandle} 
                            onChange={(e) => setTempXHandle(e.target.value)} 
                            placeholder="@YourHandle" 
                            className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-6 py-5 text-lg font-black text-slate-900 dark:text-white outline-none focus:border-blue-500"
                         />
                         <button onClick={proceedToAuthorize} className="w-full py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl">Next</button>
                      </div>
                   </div>
                 )}

                 {xLoginStep === 'authorize' && (
                   <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 w-full">
                      <div className="mb-8 flex flex-col items-center">
                         <div className="w-12 h-12 bg-jetblue text-white rounded-xl flex items-center justify-center mb-3">
                            <span className="font-black text-xs">PRM</span>
                         </div>
                         <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tighter uppercase">Prime Reach Media</h3>
                         <p className="text-[10px] text-slate-500 font-bold">Wants to access your account</p>
                      </div>
                      
                      <div className="text-left bg-slate-50 dark:bg-slate-900/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 mb-10 space-y-3">
                         <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">This app will be able to:</p>
                         <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.58L21 7Z"/></svg>
                            Read Tweets from your timeline
                         </div>
                         <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.58L21 7Z"/></svg>
                            See who you follow
                         </div>
                         <div className="flex items-center gap-3 text-[10px] font-bold text-slate-600 dark:text-slate-300">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M21 7L9 19L3.5 13.5L4.91 12.09L9 16.17L19.59 5.58L21 7Z"/></svg>
                            Verify your account ownership
                         </div>
                      </div>

                      <div className="flex flex-col gap-4">
                         <button onClick={finalizeXAuth} className="w-full py-5 bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:bg-blue-600 transition-all">Authorize App</button>
                         <button onClick={() => setIsXModalOpen(false)} className="w-full py-4 text-slate-400 font-black text-[10px] uppercase tracking-widest">Cancel</button>
                      </div>
                   </div>
                 )}

                 {xLoginStep === 'callback' && (
                   <div className="animate-in fade-in duration-500 w-full flex flex-col items-center py-10">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-6"></div>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">Establishing Handshake</h3>
                      <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] animate-pulse">Communicating with X API V2...</p>
                   </div>
                 )}
              </div>

           </div>
        </div>
      )}
    </div>
  );
};

export default ProfileBuilder;

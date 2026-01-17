
import React, { useState, useEffect } from 'react';

interface ProfileBuilderProps {
  userRole: string;
  userEmail: string;
  initialWalletAddress?: string | null;
  initialSocialAlias?: string | null;
  initialCompanyName?: string | null;
  initialImage?: string | null;
  onUpdate: (data: any) => void;
  onSave: (data: any) => void;
  onLogout: () => void;
}

const platformsList = ['YOUTUBE', 'X', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'ZORA', 'PUMPFUN', 'RUMBLE', 'TWITCH', 'KICK', 'DISCORD', 'OTHER'];

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ 
  userRole, 
  userEmail, 
  initialWalletAddress, 
  initialSocialAlias, 
  initialCompanyName,
  initialImage,
  onUpdate, 
  onSave, 
  onLogout 
}) => {
  const [formData, setFormData] = useState({
    companyName: initialCompanyName || '',
    industry: '',
    primaryObjective: '',
    mission: '',
    audienceDescription: '',
    image: initialImage || null as string | null,
    walletAddress: initialWalletAddress || null as string | null,
    socialAlias: initialSocialAlias || '',
    isWalletSigned: !!initialWalletAddress, 
    selectedPlatforms: [] as string[]
  });

  const [isSigningWallet, setIsSigningWallet] = useState(false);
  const isCreator = userRole === 'creator';

  const handleConnectWallet = async () => {
    const provider = (window as any).solana;
    if (!provider?.isPhantom) return window.open('https://phantom.app/', '_blank');
    
    setIsSigningWallet(true);
    try {
      const resp = await provider.connect();
      const publicKey = resp.publicKey.toString();
      
      // Strict Client-Side Handshake (No RPC required)
      const message = `PRM PRODUCTION PROTOCOL (v3.2)\nSECURE IDENTITY ANCHOR\n\nEntity ID: ${userEmail}\nWallet: ${publicKey}\n\nI anchor this wallet for secure USDC settlement on PRM. This signature validates my mainnet identity.`;
      const encodedMessage = new TextEncoder().encode(message);
      const signedMessage = await provider.signMessage(encodedMessage, "utf8");
      
      if (signedMessage) {
        setFormData(p => ({ ...p, walletAddress: publicKey, isWalletSigned: true }));
      }
    } catch (err: any) {
      console.error("Wallet Handshake Error:", err);
      if (err?.code === 4001) {
        alert('Action Required: You must sign the identity anchor message to proceed.');
      } else {
        alert('Network Protocol Error: Identity anchor could not be established. Please check your Phantom settings.');
      }
    } finally {
      setIsSigningWallet(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreator && !formData.isWalletSigned) return alert("Anchor Required: Finalize cryptographic handshake for USDC payouts.");
    if (!formData.image) return alert("Identity Asset Required: Please upload your brand logo/avatar.");
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-16 px-4 sm:px-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 sm:mb-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tight leading-none mb-4">PROFILE ANCHOR</h1>
          <p className="text-[8px] sm:text-[10px] font-black text-slate-400 tracking-[0.3em] sm:tracking-[0.4em] uppercase italic">PRODUCTION PORTAL ACCESS: {userRole.toUpperCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-12">
          {/* Section 01: Identity & Branding */}
          <section className="bg-white dark:bg-slate-900 p-6 sm:p-14 rounded-2xl sm:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase mb-8 sm:mb-12 flex items-center gap-3 sm:gap-4">
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg">01</span>
              Identity Details
            </h2>
            
            <div className="flex flex-col lg:flex-row gap-8 sm:gap-12 items-start">
              {/* Brand Asset Upload Area */}
              <div className="w-full lg:w-48 flex flex-col items-center gap-4">
                <input 
                  type="file" 
                  id="logo-upload" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                />
                <label 
                  htmlFor="logo-upload" 
                  className="w-40 h-40 sm:w-48 sm:h-48 rounded-[1.5rem] sm:rounded-[2rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue dark:hover:border-jetblue transition-all cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner group relative flex items-center justify-center"
                >
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Profile Preview" />
                  ) : (
                    <div className="text-center p-4 sm:p-6 space-y-2 opacity-40 group-hover:opacity-100 group-hover:text-jetblue transition-all">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M12 4v16m8-8H4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      <span className="text-[8px] sm:text-[9px] font-black uppercase tracking-widest block leading-tight">UPLOAD BRAND LOGO</span>
                    </div>
                  )}
                  {formData.image && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                       <span className="text-[9px] sm:text-[10px] font-black text-white uppercase tracking-widest">Change Asset</span>
                    </div>
                  )}
                </label>
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest text-center">Identity Anchor (1:1 Aspect)</p>
              </div>

              {/* Form Fields */}
              <div className="flex-1 grid grid-cols-1 gap-6 sm:gap-8 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                  <div className="space-y-2 sm:space-y-4">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isCreator ? 'Alias' : 'Entity Name'}</label>
                    <input type="text" required value={formData.companyName} onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue transition-colors" placeholder="Protocol Identity" />
                  </div>
                  <div className="space-y-2 sm:space-y-4">
                    <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Social Alias (Protocol UID)</label>
                    <input type="text" value={formData.socialAlias} onChange={e => setFormData(p => ({ ...p, socialAlias: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue transition-colors" placeholder="@uid_prm" />
                  </div>
                </div>
                <div className="space-y-2 sm:space-y-4">
                   <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Registered Email</label>
                   <div className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-5 text-sm font-bold text-slate-400 italic">
                      {userEmail}
                   </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-6 sm:p-14 rounded-2xl sm:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4">
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg">02</span>
              Vertical Synchronization
            </h2>
            <div className="space-y-6 sm:space-y-8">
              <label className="block text-[9px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Active Distribution Channels</label>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {platformsList.map(p => (
                  <button key={p} type="button" onClick={() => {
                    const exists = formData.selectedPlatforms.includes(p);
                    setFormData(prev => ({ ...prev, selectedPlatforms: exists ? prev.selectedPlatforms.filter(x => x !== p) : [...prev.selectedPlatforms, p] }));
                  }} className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] border-2 transition-all ${formData.selectedPlatforms.includes(p) ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/30'}`}>{p}</button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-6 sm:p-14 rounded-2xl sm:rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors space-y-8 sm:space-y-12">
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white uppercase mb-8 sm:mb-10 flex items-center gap-3 sm:gap-4">
              <span className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-[10px] sm:text-xs font-black shadow-lg">03</span>
              SECURITY ANCHOR
            </h2>
            <div className={`p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] border-2 transition-all duration-500 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/20 shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner'}`}>
               <div className="flex flex-col md:flex-row items-center justify-between gap-6 sm:gap-8">
                  <div className="text-center md:text-left">
                    <h4 className="text-base sm:text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">USDC Settlement Anchor</h4>
                    <p className={`text-[8px] sm:text-[9px] font-bold uppercase tracking-[0.2em] italic ${formData.isWalletSigned ? 'text-green-500' : 'text-slate-400'}`}>
                      {formData.isWalletSigned ? 'PROTOCOL HANDSHAKE ANCHORED' : 'MANDATORY FOR ON-CHAIN SETTLEMENT'}
                    </p>
                  </div>
                  {formData.isWalletSigned ? (
                    <span className="px-4 sm:px-6 py-2 sm:py-3 bg-white dark:bg-slate-950 border-2 border-green-500/20 text-green-600 rounded-lg sm:rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-sm truncate max-w-full">
                      {formData.walletAddress?.slice(0, 8)}...{formData.walletAddress?.slice(-4)}
                    </span>
                  ) : (
                    <button type="button" disabled={isSigningWallet} onClick={handleConnectWallet} className="w-full md:w-auto px-8 sm:px-10 py-3 sm:py-4 bg-jetblue text-white rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] shadow-xl shadow-jetblue/20 hover:bg-jetblue-bright transition-all">{isSigningWallet ? 'Executing...' : 'Anchor via Phantom'}</button>
                  )}
               </div>
            </div>
          </section>

          <div className="flex justify-end gap-6 pt-8 sm:pt-12 pb-24 sm:pb-40">
            <button type="submit" className="w-full sm:w-auto px-12 sm:px-20 py-6 sm:py-8 bg-jetblue text-white rounded-xl sm:rounded-[2.5rem] font-black text-base sm:text-lg uppercase tracking-[0.3em] sm:tracking-[0.5em] hover:bg-jetblue-bright transition-all shadow-2xl shadow-jetblue/30 flex items-center justify-center gap-4 sm:gap-6 group">
              Commit Portal Profile
              <svg className="w-5 h-5 sm:w-6 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

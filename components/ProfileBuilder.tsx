
import React, { useState, useEffect } from 'react';

interface ProfileBuilderProps {
  userRole: string;
  userEmail: string;
  initialWalletAddress?: string | null;
  initialSocialAlias?: string | null;
  onUpdate: (data: any) => void;
  onSave: (data: any) => void;
  onLogout: () => void;
}

const platformsList = ['YOUTUBE', 'X', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'ZORA', 'PUMPFUN', 'RUMBLE', 'TWITCH', 'KICK', 'DISCORD', 'OTHER'];

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, userEmail, initialWalletAddress, initialSocialAlias, onUpdate, onSave, onLogout }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    industry: '',
    primaryObjective: '',
    mission: '',
    audienceDescription: '',
    image: null as string | null,
    walletAddress: initialWalletAddress || null as string | null,
    socialAlias: initialSocialAlias || '',
    isWalletSigned: false, 
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
      const message = `PRM PRODUCTION PROTOCOL (v3.2)\nSECURE IDENTITY ANCHOR\n\nEntity ID: ${userEmail}\nWallet: ${publicKey}\n\nI anchor this wallet for secure USDC settlement on PRM. This signature validates my mainnet identity.`;
      const signedMessage = await provider.signMessage(new TextEncoder().encode(message), "utf8");
      if (signedMessage) setFormData(p => ({ ...p, walletAddress: publicKey, isWalletSigned: true }));
    } catch (err: any) {
      alert('Handshake Failed: Identity must be anchored via cryptographic signature.');
    } finally {
      setIsSigningWallet(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isCreator && !formData.isWalletSigned) return alert("Anchor Required: Finalize cryptographic handshake for USDC payouts.");
    onSave(formData);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tight leading-none mb-4">PROFILE ANCHOR</h1>
          <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase italic">PRODUCTION PORTAL ACCESS: {userRole.toUpperCase()}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">01</span>
              Identity Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{isCreator ? 'Alias' : 'Entity Name'}</label>
                  <input type="text" required value={formData.companyName} onChange={e => setFormData(p => ({ ...p, companyName: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue" placeholder="Protocol Identity" />
               </div>
               <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Identity Alias (Protocol UID)</label>
                  <input type="text" value={formData.socialAlias} onChange={e => setFormData(p => ({ ...p, socialAlias: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue" placeholder="@uid_prm" />
               </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">02</span>
              Vertical Synchronization
            </h2>
            <div className="space-y-8">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Distribution Channels</label>
              <div className="flex flex-wrap gap-3">
                {platformsList.map(p => (
                  <button key={p} type="button" onClick={() => {
                    const exists = formData.selectedPlatforms.includes(p);
                    setFormData(prev => ({ ...prev, selectedPlatforms: exists ? prev.selectedPlatforms.filter(x => x !== p) : [...prev.selectedPlatforms, p] }));
                  }} className={`p-4 rounded-2xl font-black text-[10px] border-2 transition-all ${formData.selectedPlatforms.includes(p) ? 'bg-jetblue border-jetblue text-white' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400'}`}>{p}</button>
                ))}
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 transition-colors space-y-12">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">03</span>
              SECURITY ANCHOR
            </h2>
            <div className={`p-10 rounded-[2.5rem] border-2 transition-all duration-500 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800'}`}>
               <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                  <div className="text-left">
                    <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">USDC Settlement Anchor</h4>
                    <p className={`text-[9px] font-bold uppercase tracking-[0.2em] italic ${formData.isWalletSigned ? 'text-green-500' : 'text-slate-400'}`}>
                      {formData.isWalletSigned ? 'PROTOCOL HANDSHAKE ANCHORED' : 'MANDATORY FOR ON-CHAIN SETTLEMENT'}
                    </p>
                  </div>
                  {formData.isWalletSigned ? (
                    <span className="px-6 py-3 bg-white dark:bg-slate-950 border-2 border-green-500/20 text-green-600 rounded-xl text-[10px] font-black uppercase tracking-widest">{formData.walletAddress?.slice(0, 12)}...</span>
                  ) : (
                    <button type="button" disabled={isSigningWallet} onClick={handleConnectWallet} className="px-10 py-4 bg-jetblue text-white rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-xl">{isSigningWallet ? 'Executing...' : 'Anchor via Phantom'}</button>
                  )}
               </div>
            </div>
          </section>

          <div className="flex justify-end gap-6 pt-12 pb-40">
            <button type="submit" className="w-full sm:w-auto px-20 py-8 bg-jetblue text-white rounded-[2.5rem] font-black text-lg uppercase tracking-[0.5em] hover:bg-jetblue-bright transition-all shadow-2xl flex items-center justify-center gap-6">Commit Portal Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;


import React, { useState, useEffect } from 'react';

interface ProfileBuilderProps {
  userRole: string;
  userEmail: string;
  initialWalletAddress?: string | null;
  initialTwitterHandle?: string | null;
  onSave: (data: any) => void;
}

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, userEmail, initialWalletAddress, initialTwitterHandle, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: initialTwitterHandle || '',
    mission: '',
    companyType: '',
    timeInBusiness: '',
    industry: '',
    primaryObjective: '',
    audienceDescription: '',
    image: null as string | null,
    walletAddress: initialWalletAddress || null as string | null
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [phantomError, setPhantomError] = useState<string | null>(null);

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
      setPhantomError('PROVIDER WALLET NOT DETECTED. PLEASE INSTALL A COMPATIBLE EXTENSION.');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setIsConnecting(true);
    setPhantomError(null);

    try {
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      setFormData(prev => ({ ...prev, walletAddress: publicKey }));
    } catch (err: any) {
      setPhantomError(err.message || 'CONNECTION REJECTED BY USER');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnectWallet = async () => {
    const { solana } = window as any;
    if (solana) {
      try {
        await solana.disconnect();
        setFormData(prev => ({ ...prev, walletAddress: null }));
      } catch (err) {
        console.error('[Wallet] Disconnect failed:', err);
      }
    } else {
      setFormData(prev => ({ ...prev, walletAddress: null }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, email: userEmail });
  };

  const companyTypes = ['Individual', 'Startup', 'Agency', 'Enterprise'];
  const businessTimes = ['Less than 6 months', '6 to 12 months', '1+ year'];
  const industries = ['Crypto', 'Gaming', 'SaaS', 'Ecommerce', 'Media', 'Other'];
  const objectives = ['Brand awareness', 'Product launch', 'Conversions', 'Community growth'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
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
              Stream Branding Asset
            </h2>
            
            <div className="relative flex justify-center">
              <input 
                type="file" 
                id="branding-asset" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
              <label 
                htmlFor="branding-asset"
                className="block w-full max-w-[450px] aspect-square rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue dark:hover:border-jetblue transition-all cursor-pointer overflow-hidden relative group bg-slate-50 dark:bg-slate-950 shadow-inner"
              >
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
                    <p className="text-[10px] font-bold mt-4 opacity-60 italic uppercase tracking-tighter">Square Format (1024x1024) Required for Platform Branding</p>
                  </div>
                )}
              </label>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              Identity & Connectivity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Authenticated Identifier 
                  <svg className="w-3 h-3 text-jetblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </label>
                <div className="relative">
                   <input 
                    type="text" 
                    value={initialTwitterHandle || userEmail}
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold text-slate-400 cursor-not-allowed opacity-80"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-jetblue uppercase tracking-tighter">
                    {initialTwitterHandle ? 'X Verified' : 'Email Verified'}
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Entity Name</label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
                  placeholder="EX: PRIME REACH MEDIA"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            <div className="mb-10">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mission Statement</label>
              <input 
                type="text" 
                value={formData.mission}
                onChange={(e) => setFormData(prev => ({...prev, mission: e.target.value}))}
                placeholder="DEFINE YOUR CORE PURPOSE IN ONE PRECISE SENTENCE"
                className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all shadow-inner"
              />
            </div>

            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all duration-300 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/30' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'} mb-10`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg border border-slate-100 dark:border-slate-800">
                    <svg className="w-8 h-8 text-jetblue dark:text-jetblue-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      Secured Wallet Integration
                      {!formData.walletAddress && <span className="text-[9px] bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded tracking-tighter">OPTIONAL NOW</span>}
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tight max-w-sm leading-relaxed italic">
                      You don't have to connect your wallet now, but you must connect before any purchase.
                    </p>
                  </div>
                </div>

                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-3">
                    <div className="px-6 py-3 bg-white dark:bg-slate-900 border-2 border-green-500/30 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-3 shadow-xl">
                      <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse shadow-sm shadow-green-500/50"></div>
                      SECURED: {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                    </div>
                    <button 
                      type="button" 
                      onClick={handleDisconnectWallet}
                      className="text-[9px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-all hover:tracking-[0.3em]"
                    >
                      [ Terminate Connection ]
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      className="px-10 py-5 bg-jetblue text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl shadow-jetblue/20 flex items-center gap-3 group"
                    >
                      {isConnecting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg className="w-5 h-5 group-hover:rotate-12 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                        </svg>
                      )}
                      {isConnecting ? 'ESTABLISHING HANDSHAKE...' : 'Link Provider Wallet'}
                    </button>
                    {phantomError && <p className="text-[9px] font-black text-red-500 text-center max-w-[220px] leading-tight tracking-widest animate-bounce uppercase">{phantomError}</p>}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Company Structure</label>
                <div className="flex flex-wrap gap-3">
                  {companyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, companyType: type}))}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.companyType === type ? 'bg-jetblue text-white shadow-lg scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-jetblue border-2 border-transparent'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tenure in Business</label>
                <div className="flex flex-wrap gap-3">
                  {businessTimes.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, timeInBusiness: time}))}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.timeInBusiness === time ? 'bg-jetblue text-white shadow-lg scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-jetblue border-2 border-transparent'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Industry</label>
                <div className="flex flex-wrap gap-3">
                  {industries.map(ind => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, industry: ind}))}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.industry === ind ? 'bg-prmgold text-white shadow-lg shadow-prmgold/20 scale-105' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-prmgold border-2 border-transparent'}`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">03</span>
              Strategic Goals
            </h2>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Primary Objective</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {objectives.map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, primaryObjective: obj}))}
                      className={`px-4 py-4 rounded-xl text-[9px] font-black uppercase text-center tracking-tight leading-tight transition-all border-2 ${formData.primaryObjective === obj ? 'bg-jetblue border-jetblue text-white shadow-xl scale-105' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500 hover:border-jetblue/30'}`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Audience Architecture</label>
                <textarea 
                  rows={4}
                  value={formData.audienceDescription}
                  onChange={(e) => setFormData(prev => ({...prev, audienceDescription: e.target.value}))}
                  placeholder="DESCRIBE THE DEMOGRAPHICS, PSYCHOGRAPHICS, AND NICHE SEGMENTS YOU ARE TARGETING..."
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-3xl px-8 py-6 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all resize-none shadow-inner"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row justify-end gap-6 items-center border-t border-slate-100 dark:border-slate-800 pt-12">
            <div className="text-right">
              <p className="text-[9px] font-black text-jetblue uppercase tracking-[0.3em] mb-1">DATA INTEGRITY PROTOCOL</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase max-w-[320px] leading-tight tracking-tight">
                Profile deployment will lock your entity profile to the PRM decentralized marketplace registry. Wallet connectivity can be finalized later.
              </p>
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto px-16 py-6 bg-jetblue text-white rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-2xl hover:-translate-y-1 active:scale-95 border-b-4 border-jetblue-dark flex items-center justify-center gap-3"
            >
              Lock & Deploy Profile
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

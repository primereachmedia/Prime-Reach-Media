
import React, { useState, useEffect } from 'react';

interface ProfileBuilderProps {
  userRole: string;
  userEmail: string;
  onSave: (data: any) => void;
}

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, userEmail, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    mission: '',
    companyType: '',
    timeInBusiness: '',
    industry: '',
    primaryObjective: '',
    audienceDescription: '',
    image: null as string | null,
    walletAddress: null as string | null
  });

  const [isConnecting, setIsConnecting] = useState(false);
  const [phantomError, setPhantomError] = useState<string | null>(null);

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      const { solana } = window as any;
      if (solana?.isPhantom) {
        try {
          const response = await solana.connect({ onlyIfTrusted: true });
          setFormData(prev => ({ ...prev, walletAddress: response.publicKey.toString() }));
        } catch (err) {
          // User has not trusted the site yet, that's fine.
        }
      }
    };
    checkConnection();
  }, []);

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
      setPhantomError('PHANTOM WALLET NOT DETECTED. PLEASE INSTALL THE EXTENSION.');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    setIsConnecting(true);
    setPhantomError(null);

    try {
      const response = await solana.connect();
      const publicKey = response.publicKey.toString();
      setFormData(prev => ({ ...prev, walletAddress: publicKey }));
      console.log('[Wallet] Connected:', publicKey);
    } catch (err: any) {
      console.error('[Wallet] Connection failed:', err);
      setPhantomError(err.message || 'CONNECTION REJECTED BY USER');
    } finally {
      setIsConnecting(false);
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
          <h1 className="text-4xl md:text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter">PROFILE STUDIO</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-2">CONFIGURING IDENTITY FOR: <span className="text-prmgold">{userRole}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-24">
          
          {/* IMAGE BRANDING SECTION - 1024x1024 UI */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
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
                      <span className="text-white font-black text-xs uppercase tracking-widest border-2 border-white px-4 py-2">Change Asset</span>
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

          {/* IDENTITY & WALLET SECTION */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              Identity & Connectivity
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  Authenticated Email 
                  <svg className="w-3 h-3 text-jetblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </label>
                <div className="relative">
                   <input 
                    type="email" 
                    value={userEmail}
                    disabled
                    className="w-full bg-slate-100 dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold text-slate-400 cursor-not-allowed opacity-80"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-[8px] font-black text-jetblue uppercase tracking-tighter">Verified</div>
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

            {/* REAL PHANTOM WALLET INTEGRATION */}
            <div className={`p-8 rounded-[2rem] border-2 border-dashed transition-all ${formData.walletAddress ? 'bg-green-500/5 border-green-500/20' : 'bg-slate-50 dark:bg-slate-950/50 border-slate-200 dark:border-slate-800'} mb-10`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center shadow-md">
                    <img src="https://res.cloudinary.com/dc6u9s76p/image/upload/v1645001309/phantom-logo_d6lqjy.png" className="w-8 h-8 object-contain" alt="Phantom" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      Phantom Wallet Integration
                    </h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase mt-1 tracking-tight max-w-sm">
                      Security protocol: Only use the official Phantom extension. Required for executing trades and automated payouts in USDC.
                    </p>
                  </div>
                </div>

                {formData.walletAddress ? (
                  <div className="flex flex-col items-end gap-2">
                    <div className="px-6 py-3 bg-white dark:bg-slate-900 border border-green-500/30 text-green-500 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-lg">
                      <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                      SECURED: {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                    </div>
                    <button 
                      type="button" 
                      onClick={async () => {
                        const { solana } = window as any;
                        await solana?.disconnect();
                        setFormData(prev => ({ ...prev, walletAddress: null }));
                      }}
                      className="text-[8px] font-black text-slate-400 hover:text-red-500 uppercase tracking-widest transition-colors"
                    >
                      Disconnect Wallet
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <button
                      type="button"
                      onClick={handleConnectWallet}
                      disabled={isConnecting}
                      className="px-10 py-4 bg-[#AB9FF2] text-white rounded-xl text-xs font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl flex items-center gap-3"
                    >
                      {isConnecting ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-2 16h-2v-2h2v2zm0-4h-2v-4h2v4zm4 4h-2v-2h2v2zm0-4h-2v-4h2v4z"/></svg>
                      )}
                      {isConnecting ? 'ESTABLISHING...' : 'Connect Phantom'}
                    </button>
                    {phantomError && <p className="text-[8px] font-black text-red-500 text-center max-w-[180px] leading-tight tracking-widest">{phantomError}</p>}
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

          {/* STRATEGIC BLUEPRINT SECTION */}
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
                      className={`px-4 py-4 rounded-xl text-[9px] font-black uppercase text-center tracking-tight leading-tight transition-all border-2 ${formData.primaryObjective === obj ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
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
                  className="w-full bg-slate-50 dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-6 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all resize-none shadow-inner"
                />
              </div>
            </div>
          </section>

          <div className="flex flex-col md:flex-row justify-end gap-6 items-center border-t border-slate-100 dark:border-slate-800 pt-12">
            <div className="text-right">
              <p className="text-[9px] font-black text-jetblue uppercase tracking-widest mb-1">DATA INTEGRITY CHECK</p>
              <p className="text-[9px] font-bold text-slate-400 uppercase max-w-[280px] leading-tight">
                Profile finalization will lock your business entity and wallet address to the Prime Reach Media smart contracts.
              </p>
            </div>
            <button 
              type="submit"
              className="w-full md:w-auto px-16 py-6 bg-jetblue text-white rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-2xl hover:-translate-y-1 active:scale-95 border-b-4 border-jetblue-dark"
            >
              Lock & Deploy Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

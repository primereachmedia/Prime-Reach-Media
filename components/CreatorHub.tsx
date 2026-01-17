
import React, { useState, useMemo } from 'react';

interface CreatorHubProps {
  onLogout: () => void;
  userEmail: string;
  userWallet?: string | null;
  userName?: string | null;
  userImage?: string | null;
  placements: any[];
  onAddPlacement: (data: any) => void;
  onEditProfile?: () => void;
  onNavigateMarketplace?: () => void;
}

const platformsList = ['YOUTUBE', 'X', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'ZORA', 'PUMPFUN', 'RUMBLE', 'TWITCH', 'KICK', 'DISCORD', 'OTHER'];
const logoPositions = ['TOP LEFT', 'TOP CENTER', 'TOP RIGHT', 'BOTTOM LEFT', 'BOTTOM CENTER', 'BOTTOM RIGHT'];

const WelcomeScreen: React.FC<{
  userImage?: string | null;
  userName?: string | null;
  onEditProfile?: () => void;
  onNavigateMarketplace?: () => void;
  onStartListing: () => void;
}> = ({ userImage, userName, onEditProfile, onNavigateMarketplace, onStartListing }) => (
  <div className="bg-white dark:bg-slate-900 rounded-[2rem] sm:rounded-[3rem] p-8 sm:p-16 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all">
     <div className="max-w-3xl mx-auto text-center space-y-8 sm:space-y-12">
        <div className="space-y-4">
           <div className="w-16 h-16 sm:w-24 sm:h-24 bg-jetblue/5 dark:bg-prmgold/5 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-8 border-2 border-dashed border-jetblue/20 dark:border-prmgold/20 animate-pulse overflow-hidden">
              {userImage ? (
                <img src={userImage} className="w-full h-full object-cover" alt="User Profile" />
              ) : (
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-jetblue dark:text-prmgold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              )}
           </div>
           <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Welcome to the Protocol, {userName || 'Creator'}</h2>
           <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] sm:tracking-[0.4em] italic leading-relaxed">System Initialization Successful // Mainnet Synchronized</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 text-left">
           <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors">
              <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 01</span>
              <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Verify Profile</h4>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Ensure your identity anchors and Phantom wallets are linked for automated settlement.</p>
              <button onClick={onEditProfile} className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-jetblue hover:text-white transition-all">My Profile</button>
           </div>
           <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors relative overflow-hidden">
              <div className="absolute top-0 right-0 p-2"><div className="w-2 h-2 bg-prmgold rounded-full animate-ping"></div></div>
              <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 02</span>
              <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Deploy Slot</h4>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Upload a broadcast preview and define your temporal parameters for targeting.</p>
              <button onClick={onStartListing} className="w-full py-3 bg-jetblue text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-jetblue-bright transition-all">List New Slot</button>
           </div>
           <div className="p-6 sm:p-8 bg-slate-50 dark:bg-slate-950 rounded-2xl sm:rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors">
              <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 03</span>
              <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Yield Status</h4>
              <p className="text-[10px] text-slate-400 font-bold leading-relaxed">View your active deployments in the targeting stack and monitor settlement status.</p>
              <button onClick={onNavigateMarketplace} className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-jetblue hover:text-white transition-all">View Marketplace</button>
           </div>
        </div>
     </div>
  </div>
);

const CreatorHub: React.FC<CreatorHubProps> = ({ 
  onLogout, 
  userEmail, 
  userWallet, 
  userName, 
  userImage, 
  placements,
  onAddPlacement, 
  onEditProfile, 
  onNavigateMarketplace 
}) => {
  const [isListingMode, setIsListingMode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    image: null as string | null,
    platforms: [] as string[],
    genre: 'CRYPTO',
    viewers: '',
    price: '',
    placement: 'TOP RIGHT',
    date: new Date().toISOString().split('T')[0],
  });

  // REAL STATS CALCULATION
  const userSlots = useMemo(() => {
    return Array.isArray(placements) ? placements.filter(p => p.creatorEmail === userEmail) : [];
  }, [placements, userEmail]);

  const totalRevenue = useMemo(() => {
    return userSlots.reduce((acc, curr) => {
      const p = parseFloat(curr.price || "0");
      const b = parseInt(curr.totalBuys || "0", 10);
      return acc + (isNaN(p) || isNaN(b) ? 0 : b * p);
    }, 0);
  }, [userSlots]);

  const stats = [
    { label: 'PENDING PAYOUT', value: `${totalRevenue.toLocaleString()} USDC`, trend: 'SETTLEMENT PENDING' },
    { label: 'ACTIVE SLOTS', value: userSlots.length.toString(), trend: 'LIVE ON MARKET' },
    { label: 'PROTOCOL REACH', value: userSlots.length > 0 ? `${(userSlots.length * 0.15).toFixed(1)}M` : '0', trend: 'ESTIMATED REACH' },
  ];

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
    if (!formData.image) return alert("Broadcast Screen Required: Upload the image where the logo will be placed.");
    if (!formData.price) return alert("Pricing Required.");
    
    onAddPlacement({ 
      ...formData, 
      creatorWallet: userWallet || "ErR6aaQDcaPnx8yi3apPty4T1PeJAmXjuF7ZhTpUjiaw" 
    });
    
    setIsSuccess(true);
    setTimeout(() => { 
      setIsSuccess(false); 
      setIsListingMode(false);
      setFormData({
        title: '',
        image: null,
        platforms: [],
        genre: 'CRYPTO',
        viewers: '',
        price: '',
        placement: 'TOP RIGHT',
        date: new Date().toISOString().split('T')[0],
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-8 sm:py-16 px-4 sm:px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 sm:gap-8 mb-12 sm:mb-16">
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-jetblue border-2 border-slate-100 dark:border-slate-800 overflow-hidden shadow-lg flex items-center justify-center flex-shrink-0">
              {userImage ? (
                <img src={userImage} className="w-full h-full object-cover" alt="User" />
              ) : (
                <span className="text-xl sm:text-2xl font-black text-slate-300">?</span>
              )}
            </div>
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">CREATOR HUB</h1>
              <p className="text-[8px] sm:text-[10px] font-bold text-slate-500 tracking-[0.3em] sm:tracking-[0.4em] uppercase truncate max-w-[150px] xs:max-w-none">{userName || userEmail}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
             <button onClick={() => setIsListingMode(true)} className="flex-1 sm:flex-none px-4 sm:px-8 py-3 sm:py-4 bg-jetblue text-white rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest shadow-xl hover:bg-jetblue-bright transition-all">List New Slot</button>
             <button onClick={onLogout} className="flex-1 sm:flex-none px-4 sm:px-6 py-3 sm:py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-xl sm:rounded-2xl font-black text-[9px] sm:text-[10px] uppercase tracking-widest hover:text-red-500 transition-all">Log Out</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 mb-16 sm:mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-6 sm:p-10 rounded-2xl sm:rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
               <p className="text-[8px] sm:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-2 sm:mb-4">{stat.label}</p>
               <h3 className="text-2xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-1 sm:mb-2 italic">{stat.value}</h3>
               <p className="text-[8px] sm:text-[9px] font-bold text-green-500 uppercase tracking-widest">{stat.trend}</p>
            </div>
          ))}
        </div>

        {isListingMode ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-2xl sm:rounded-[3rem] p-6 sm:p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-8 sm:space-y-12 animate-in slide-in-from-bottom-4 duration-500 pb-16 sm:pb-20">
             <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-6 sm:pb-8">
                <h2 className="text-xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">DEPLOY NEW BROADCAST SLOT</h2>
                <div className="hidden sm:flex items-center gap-2">
                   <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Active</span>
                </div>
             </div>
             
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-16">
                {/* Column 1: Image Upload (THE SCREEN) */}
                <div className="lg:col-span-1 space-y-4 sm:space-y-6">
                  <div className="space-y-1 sm:space-y-2">
                    <label className="block text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Broadcast Screen</label>
                    <p className="text-[8px] sm:text-[9px] text-slate-400 font-medium leading-tight">Upload the frame where the sponsor logo will appear.</p>
                  </div>
                  <input type="file" id="broadcast-image" className="hidden" accept="image/*" onChange={handleImageUpload} />
                  <label htmlFor="broadcast-image" className="block aspect-video bg-slate-50 dark:bg-slate-950 border-4 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-[2.5rem] hover:border-jetblue transition-all cursor-pointer overflow-hidden group relative">
                    {formData.image ? (
                      <div className="relative h-full w-full">
                        <img src={formData.image} className="w-full h-full object-cover" alt="Preview" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all flex items-center justify-center">
                           <span className="px-4 py-2 bg-white text-jetblue text-[8px] sm:text-[10px] font-black rounded-xl opacity-0 group-hover:opacity-100 transition-opacity uppercase tracking-widest">Change Screen</span>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-4 sm:p-8 opacity-40 group-hover:opacity-100 transition-all">
                        <svg className="w-8 h-8 sm:w-12 sm:h-12 mb-2 sm:mb-4 text-jetblue" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        <span className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em]">Upload Stream Screen</span>
                      </div>
                    )}
                  </label>
                </div>

                {/* Column 2: Parameters */}
                <div className="lg:col-span-2 space-y-8 sm:space-y-12">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10">
                      <div className="space-y-3 sm:space-y-4">
                        <label className="block text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest">Broadcast Title</label>
                        <input type="text" required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-lg font-black dark:text-white outline-none focus:border-jetblue shadow-inner" placeholder="E.G. WEEKLY TECH WRAPUP" />
                      </div>
                      <div className="space-y-3 sm:space-y-4">
                        <label className="block text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest">Pricing (USDC)</label>
                        <div className="relative">
                          <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-jetblue rounded-xl sm:rounded-2xl px-6 sm:px-8 py-4 sm:py-6 text-xl sm:text-2xl font-black dark:text-white outline-none shadow-xl" placeholder="50.00" />
                          <span className="absolute right-6 sm:right-8 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px] sm:text-sm">USDC</span>
                        </div>
                      </div>
                   </div>

                   <div className="space-y-4 sm:space-y-6">
                      <div className="flex justify-between items-end">
                         <label className="block text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Logo Anchor Position</label>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-4">
                        {logoPositions.map(pos => (
                          <button key={pos} type="button" onClick={() => setFormData(prev => ({ ...prev, placement: pos }))} className={`px-2 sm:px-4 py-3 sm:py-5 rounded-xl sm:rounded-2xl text-[8px] sm:text-[10px] font-black border-2 transition-all transform hover:scale-[1.02] ${formData.placement === pos ? 'bg-jetblue border-jetblue text-white shadow-2xl' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-400 hover:border-jetblue/30 shadow-sm'}`}>{pos}</button>
                        ))}
                      </div>
                   </div>

                   <div className="space-y-4 sm:space-y-6">
                      <label className="block text-[10px] sm:text-[11px] font-black text-slate-500 uppercase tracking-widest italic">Distribution Channels</label>
                      <div className="flex flex-wrap gap-2 sm:gap-3">
                        {platformsList.map(p => (
                          <button key={p} type="button" onClick={() => setFormData(prev => ({ ...prev, platforms: prev.platforms.includes(p) ? prev.platforms.filter(x => x !== p) : [...prev.platforms, p] }))} className={`px-4 sm:px-6 py-2 sm:py-4 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black border-2 transition-all ${formData.platforms.includes(p) ? 'bg-[#001A41] border-jetblue text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>{p}</button>
                        ))}
                      </div>
                   </div>
                </div>
             </div>

             <div className="flex flex-col-reverse sm:flex-row justify-end items-center gap-6 sm:gap-10 pt-10 sm:pt-16 border-t border-slate-100 dark:border-slate-800">
                <button type="button" onClick={() => setIsListingMode(false)} className="text-[10px] sm:text-[12px] font-black uppercase tracking-[0.3em] sm:tracking-[0.4em] text-slate-400 hover:text-red-500 transition-colors">Discard Deployment</button>
                <button type="submit" disabled={isSuccess} className={`w-full sm:w-auto px-8 sm:px-24 py-6 sm:py-10 rounded-xl sm:rounded-[2.5rem] font-black text-lg sm:text-2xl uppercase tracking-[0.4em] sm:tracking-[0.6em] transition-all flex items-center justify-center gap-4 sm:gap-6 shadow-2xl transform active:scale-95 ${isSuccess ? 'bg-green-500 text-white' : 'bg-jetblue hover:bg-jetblue-bright text-white shadow-jetblue/40'}`}>
                  {isSuccess ? (
                    <>
                      <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      DEPLOYED
                    </>
                  ) : 'DEPLOY NOW'}
                </button>
             </div>
          </form>
        ) : (
          <WelcomeScreen 
            userImage={userImage} 
            userName={userName} 
            onEditProfile={onEditProfile} 
            onNavigateMarketplace={onNavigateMarketplace}
            onStartListing={() => setIsListingMode(true)}
          />
        )}
      </div>
    </div>
  );
};

export default CreatorHub;

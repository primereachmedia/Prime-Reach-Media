
import React, { useState, useMemo } from 'react';

interface CreatorHubProps {
  onLogout: () => void;
  userEmail: string;
  userWallet?: string | null;
  onAddPlacement: (data: any) => void;
  onEditProfile?: () => void;
  onNavigateMarketplace?: () => void;
}

const platformsList = ['YOUTUBE', 'X', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'ZORA', 'PUMPFUN', 'RUMBLE', 'TWITCH', 'KICK', 'DISCORD', 'OTHER'];
const genres = ['CRYPTO', 'GAMING', 'JUST CHATTING', 'TECH', 'SPORTS', 'LIFESTYLE'];

const CreatorHub: React.FC<CreatorHubProps> = ({ onLogout, userEmail, userWallet, onAddPlacement, onEditProfile, onNavigateMarketplace }) => {
  const [activeTab, setActiveTab] = useState<'slots' | 'revenue' | 'analytics'>('slots');
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
    time: '20:00',
    timezone: 'America/New_York'
  });

  const stats = [
    { label: 'PENDING PAYOUT', value: '1,420 USDC', trend: '+12% THIS WEEK' },
    { label: 'ACTIVE SLOTS', value: '14', trend: '3 RESERVED LAST 24H' },
    { label: 'PROTOCOL REACH', value: '2.4M', trend: 'PROTOCOL VERIFIED' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddPlacement({ ...formData, creatorWallet: userWallet || "ErR6aaQDcaPnx8yi3apPty4T1PeJAmXjuF7ZhTpUjiaw" });
    setIsSuccess(true);
    setTimeout(() => { setIsSuccess(false); setIsListingMode(false); }, 2000);
  };

  const WelcomeScreen = () => (
    <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-16 shadow-2xl border border-slate-100 dark:border-slate-800 transition-all">
       <div className="max-w-3xl mx-auto text-center space-y-12">
          <div className="space-y-4">
             <div className="w-24 h-24 bg-jetblue/5 dark:bg-prmgold/5 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-jetblue/20 dark:border-prmgold/20 animate-pulse">
                <svg className="w-10 h-10 text-jetblue dark:text-prmgold" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M5 13l4 4L19 7" strokeWidth={3}/>
                </svg>
             </div>
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">Welcome to the Protocol</h2>
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-relaxed">System Initialization Successful // Mainnet Synchronized</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors">
                <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 01</span>
                <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Verify Profile</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Ensure your identity anchors and Phantom wallets are linked for automated settlement.</p>
                <button 
                  onClick={onEditProfile}
                  className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-jetblue hover:text-white transition-all"
                >
                  My Profile
                </button>
             </div>
             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2"><div className="w-2 h-2 bg-prmgold rounded-full animate-ping"></div></div>
                <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 02</span>
                <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Deploy Slot</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Upload a broadcast preview and define your temporal parameters for 7-day targeting.</p>
                <button 
                  onClick={() => setIsListingMode(true)}
                  className="w-full py-3 bg-jetblue text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-jetblue-bright transition-all"
                >
                  List New Slot
                </button>
             </div>
             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors">
                <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 03</span>
                <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Yield Status</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">View your active deployments in the targeting stack and monitor settlement status.</p>
                <button 
                  onClick={onNavigateMarketplace}
                  className="w-full py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-jetblue hover:text-white transition-all"
                >
                  View Marketplace
                </button>
             </div>
          </div>
       </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">CREATOR HUB</h1>
            <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase">{userEmail}</p>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsListingMode(true)} className="px-8 py-4 bg-jetblue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl hover:bg-jetblue-bright transition-all">List New Slot</button>
             <button onClick={onLogout} className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:text-red-500 transition-all">Log Out</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800 transition-transform hover:-translate-y-1">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic">{stat.value}</h3>
               <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest">{stat.trend}</p>
            </div>
          ))}
        </div>

        {isListingMode ? (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12 animate-in slide-in-from-bottom-4 duration-500">
             <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter mb-8">DEPLOY NEW BROADCAST SLOT</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Broadcast Title</label>
                  <input type="text" required value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-2xl px-8 py-6 text-lg font-black dark:text-white outline-none focus:border-jetblue" />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Pricing (USDC)</label>
                  <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-jetblue rounded-2xl px-8 py-6 text-lg font-black dark:text-white outline-none" />
                </div>
             </div>
             <div className="space-y-6">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest">Active Channels</label>
                <div className="flex flex-wrap gap-3">
                  {platformsList.map(p => (
                    <button key={p} type="button" onClick={() => setFormData(prev => ({ ...prev, platforms: prev.platforms.includes(p) ? prev.platforms.filter(x => x !== p) : [...prev.platforms, p] }))} className={`px-6 py-3 rounded-xl text-[10px] font-black border-2 transition-all ${formData.platforms.includes(p) ? 'bg-[#001A41] border-jetblue text-white' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-400'}`}>{p}</button>
                  ))}
                </div>
             </div>
             <div className="flex justify-end gap-6 pt-10">
                <button type="button" onClick={() => setIsListingMode(false)} className="px-10 py-6 text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-red-500 transition-colors">Discard</button>
                <button type="submit" disabled={isSuccess} className={`px-16 py-8 rounded-3xl font-black text-lg uppercase tracking-[0.5em] transition-all ${isSuccess ? 'bg-green-500 text-white' : 'bg-jetblue hover:bg-jetblue-bright text-white'}`}>{isSuccess ? 'DEPLOYED' : 'DEPLOY TO MAINNET'}</button>
             </div>
          </form>
        ) : (
          <WelcomeScreen />
        )}
      </div>
    </div>
  );
};

export default CreatorHub;

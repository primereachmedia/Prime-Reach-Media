
import React, { useState, useRef } from 'react';

interface CreatorHubProps {
  onLogout: () => void;
  userEmail: string;
}

interface NewSlotData {
  title: string;
  image: string | null;
  platforms: string[];
  genre: string;
  viewers: string;
  price: string;
  placement: string;
  date: string;
}

const CreatorHub: React.FC<CreatorHubProps> = ({ onLogout, userEmail }) => {
  const [activeTab, setActiveTab] = useState<'slots' | 'revenue' | 'analytics'>('slots');
  const [isListingMode, setIsListingMode] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState<NewSlotData>({
    title: '',
    image: null,
    platforms: [],
    genre: 'CRYPTO',
    viewers: '',
    price: '',
    placement: 'TOP RIGHT',
    date: ''
  });

  const placementOptions = [
    'TOP LEFT', 'TOP CENTER', 'TOP RIGHT',
    'BOTTOM LEFT', 'BOTTOM CENTER', 'BOTTOM RIGHT'
  ];

  const platformsList = ['YOUTUBE', 'X', 'TWITCH', 'KICK', 'TIKTOK', 'FACEBOOK', 'RUMBLE'];
  const genres = ['CRYPTO', 'GAMING', 'JUST CHATTING', 'TECH', 'SPORTS', 'LIFESTYLE'];

  const stats = [
    { label: 'PENDING PAYOUT', value: '1,420 USDC', trend: '+12% this week' },
    { label: 'ACTIVE SLOTS', value: '14', trend: '3 sold last 24h' },
    { label: 'TOTAL REACH', value: '2.4M', trend: 'Verified via X' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(p => ({ ...p, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const togglePlatform = (p: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(p) 
        ? prev.platforms.filter(x => x !== p) 
        : [...prev.platforms, p]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call
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
        date: ''
      });
    }, 2000);
  };

  if (isListingMode) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-16">
            <button 
              onClick={() => setIsListingMode(false)}
              className="group flex items-center gap-3 text-slate-400 hover:text-jetblue transition-colors"
            >
              <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                <path d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-[10px] font-black uppercase tracking-[0.3em]">Return to Dash</span>
            </button>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">SPONSORED BROADCAST UNIT</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12">
            {/* Visual Preview Unit */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 italic">1. Broadast Composition (Visual Anchor)</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-8">
                  <div className="relative aspect-video bg-slate-100 dark:bg-slate-950 rounded-3xl border-4 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden group cursor-pointer">
                    <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleImageUpload} accept="image/*" />
                    {formData.image ? (
                      <>
                        <img src={formData.image} className="w-full h-full object-cover" alt="Stream Preview" />
                        <div className={`absolute p-4 bg-jetblue text-white rounded-xl text-[8px] font-black shadow-2xl z-10 uppercase transition-all duration-500 ${
                          formData.placement === 'TOP LEFT' ? 'top-4 left-4' :
                          formData.placement === 'TOP CENTER' ? 'top-4 left-1/2 -translate-x-1/2' :
                          formData.placement === 'TOP RIGHT' ? 'top-4 right-4' :
                          formData.placement === 'BOTTOM LEFT' ? 'bottom-4 left-4' :
                          formData.placement === 'BOTTOM CENTER' ? 'bottom-4 left-1/2 -translate-x-1/2' :
                          'bottom-4 right-4'
                        }`}>
                          SPONSOR LOGO
                        </div>
                      </>
                    ) : (
                      <div className="text-center p-8">
                        <svg className="w-12 h-12 text-slate-300 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Stream Frame (16:9)</p>
                      </div>
                    )}
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 uppercase italic leading-tight">* This image serves as the marketplace preview. Ensure it represents your typical broadcast quality.</p>
                </div>

                <div className="space-y-8">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Set Visual Anchor (Logo Position)</label>
                  <div className="grid grid-cols-3 gap-2">
                    {placementOptions.map(opt => (
                      <button 
                        key={opt}
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, placement: opt }))}
                        className={`py-4 rounded-xl text-[9px] font-black border-2 transition-all text-center leading-tight ${formData.placement === opt ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/30'}`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Distribution Pipeline */}
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">2. Distribution & Reach Parameters</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Title</label>
                  <input 
                    type="text" required placeholder="e.g. MONDAY CHART ANALYSIS LIVE"
                    value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-black dark:text-white outline-none focus:border-jetblue"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Niche Segment</label>
                  <select 
                    value={formData.genre} onChange={e => setFormData(p => ({ ...p, genre: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-black dark:text-white outline-none focus:border-jetblue appearance-none"
                  >
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Distribution Channels</label>
                <div className="flex flex-wrap gap-3">
                  {platformsList.map(p => (
                    <button 
                      key={p} type="button" onClick={() => togglePlatform(p)}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black border-2 transition-all ${formData.platforms.includes(p) ? 'bg-jetblue border-jetblue text-white shadow-md' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Avg Concurrent Viewers (CCV)</label>
                  <div className="relative">
                    <input 
                      type="number" required placeholder="e.g. 5000"
                      value={formData.viewers} onChange={e => setFormData(p => ({ ...p, viewers: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-black dark:text-white outline-none focus:border-jetblue"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">CCV</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Slot Pricing (USDC)</label>
                  <div className="relative">
                    <input 
                      type="number" required placeholder="e.g. 250"
                      value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                      className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-4 text-sm font-black dark:text-white outline-none focus:border-jetblue"
                    />
                    <span className="absolute right-6 top-1/2 -translate-y-1/2 text-[9px] font-black text-slate-400 uppercase tracking-widest">USDC</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6 pb-24">
              <button 
                type="button" 
                onClick={() => setIsListingMode(false)}
                className="px-10 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] hover:text-red-500 transition-colors"
              >
                Abort Draft
              </button>
              <button 
                type="submit" 
                disabled={isSuccess}
                className={`px-16 py-8 rounded-[2rem] font-black text-lg uppercase tracking-[0.5em] transition-all flex items-center gap-6 shadow-2xl ${isSuccess ? 'bg-green-500 text-white' : 'bg-jetblue hover:bg-jetblue-bright text-white hover:-translate-y-2'}`}
              >
                {isSuccess ? (
                  <>
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7"/></svg>
                    SLOT DEPLOYED
                  </>
                ) : (
                  <>
                    DEPLOY TO MARKETPLACE
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">CREATOR HUB</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.4em] uppercase">{userEmail}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button 
               onClick={() => setIsListingMode(true)}
               className="px-8 py-4 bg-jetblue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-jetblue/20 hover:bg-jetblue-bright transition-all"
             >
               List New Slot
             </button>
             <button onClick={onLogout} className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-red-500/20 hover:text-red-500 transition-all">Log Out</button>
          </div>
        </div>

        {/* Rapid Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic">{stat.value}</h3>
               <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-12">
          {(['slots', 'revenue', 'analytics'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-jetblue dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-jetblue rounded-t-full shadow-[0_0_15px_rgba(0,32,91,0.5)]"></div>}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 min-h-[400px] flex items-center justify-center text-center">
           <div className="space-y-6">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-slate-200 dark:border-slate-700">
                 <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">DATA PIPELINE INITIALIZING</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] max-w-sm">No active entries found for {activeTab}. Once you list your first slot and verify reach, metrics will populate here in real-time.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CreatorHub;


import React, { useState, useMemo } from 'react';

interface CreatorHubProps {
  onLogout: () => void;
  userEmail: string;
  userWallet?: string | null;
  onAddPlacement: (data: any) => void;
  onEditProfile?: () => void;
  onNavigateMarketplace?: () => void;
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
  time: string;
  timezone: string;
}

const TIMEZONES = [
  { label: 'EST (UTC-5)', value: 'America/New_York' },
  { label: 'UTC (Greenwich)', value: 'UTC' },
  { label: 'SGT (UTC+8)', value: 'Asia/Singapore' },
  { label: 'PST (UTC-8)', value: 'America/Los_Angeles' },
  { label: 'GMT (London)', value: 'Europe/London' },
  { label: 'JST (Tokyo)', value: 'Asia/Tokyo' },
];

const CreatorHub: React.FC<CreatorHubProps> = ({ onLogout, userEmail, userWallet, onAddPlacement, onEditProfile, onNavigateMarketplace }) => {
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
    date: new Date().toISOString().split('T')[0],
    time: '20:00',
    timezone: 'America/New_York'
  });

  const dateWindow = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 8; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      dates.push({
        full: d.toISOString().split('T')[0],
        day: d.toLocaleDateString('en-US', { weekday: 'short' }),
        num: d.getDate(),
        month: d.toLocaleDateString('en-US', { month: 'short' }),
      });
    }
    return dates;
  }, []);

  const placementOptions = ['TOP LEFT', 'TOP CENTER', 'TOP RIGHT', 'BOTTOM LEFT', 'BOTTOM CENTER', 'BOTTOM RIGHT'];
  const platformsList = ['YOUTUBE', 'X', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'ZORA', 'PUMPFUN', 'RUMBLE', 'TWITCH', 'KICK', 'DISCORD', 'OTHER'];
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

  const getTimeSegment = (hour: number) => {
    if (hour >= 5 && hour < 12) return 'MORNING';
    if (hour >= 12 && hour < 18) return 'AFTERNOON';
    return 'NIGHT';
  };

  const convertToEST = (dateStr: string, timeStr: string, sourceTz: string) => {
    try {
      const dt = new Date(`${dateStr}T${timeStr}:00`);
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
        weekday: 'short'
      });
      
      const parts = formatter.formatToParts(dt);
      const m = parts.find(p => p.type === 'month')?.value;
      const d = parts.find(p => p.type === 'day')?.value;
      const h = parts.find(p => p.type === 'hour')?.value;
      const min = parts.find(p => p.type === 'minute')?.value;
      const ampm = parts.find(p => p.type === 'dayPeriod')?.value;
      const dayShort = parts.find(p => p.type === 'weekday')?.value.toUpperCase();
      
      const hourNum = parseInt(parts.find(p => p.type === 'hour')?.value || '0');
      const timeSegment = getTimeSegment(ampm === 'PM' && hourNum !== 12 ? hourNum + 12 : (ampm === 'AM' && hourNum === 12 ? 0 : hourNum));

      return {
        displayDate: `${m} ${d}`,
        displayTime: `${h}:${min} ${ampm} EST`,
        fullDate: `${m.toUpperCase()} ${d}${getOrdinal(parseInt(d))} ${h}:${min}${ampm} EST`,
        dayShort,
        timeSegment
      };
    } catch (e) {
      return { displayDate: dateStr, displayTime: timeStr, fullDate: `${dateStr} ${timeStr}`, dayShort: 'MON', timeSegment: 'AFTERNOON' };
    }
  };

  const getOrdinal = (n: number) => {
    const s = ["TH", "ST", "ND", "RD"];
    const v = n % 100;
    return s[(v - 20) % 10] || s[v] || s[0];
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const estData = convertToEST(formData.date, formData.time, formData.timezone);
    
    const finalData = {
      ...formData,
      creatorWallet: userWallet || "ErR6aaQDcaPnx8yi3apPty4T1PeJAmXjuF7ZhTpUjiaw", 
      normalizedDate: estData.displayDate,
      normalizedTime: estData.displayTime,
      date: estData.fullDate,
      day: estData.dayShort,
      timeSegment: estData.timeSegment
    };

    onAddPlacement(finalData);
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
        time: '20:00',
        timezone: 'America/New_York'
      });
    }, 2000);
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
             <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic leading-relaxed">System Initialization Successful // Awaiting First Deployment</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors">
                <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 01</span>
                <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Verify Profile</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Ensure your X handles and Phantom wallets are anchored for secure USDC settlement.</p>
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
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">Upload a broadcast preview and set your temporal parameters in our 7-day window.</p>
                <button 
                  onClick={() => setIsListingMode(true)}
                  className="w-full py-3 bg-jetblue text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-jetblue-bright transition-all"
                >
                  List New Slot
                </button>
             </div>
             <div className="p-8 bg-slate-50 dark:bg-slate-950 rounded-3xl border border-slate-100 dark:border-slate-800 space-y-4 group hover:border-jetblue transition-colors">
                <span className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-widest block">Step 03</span>
                <h4 className="font-black text-sm uppercase tracking-tight text-slate-900 dark:text-white">Yield Growth</h4>
                <p className="text-[10px] text-slate-400 font-bold leading-relaxed">View your listings in the targeting stack and monitor automated split transactions.</p>
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

  if (isListingMode) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="max-w-5xl mx-auto">
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
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">TEMPORAL PLACEMENT UNIT</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-12 pb-40">
            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-10 italic">1. Broadcast Composition (Visual Anchor)</label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="relative aspect-video bg-slate-50 dark:bg-slate-950 rounded-3xl border-4 border-dashed border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center overflow-hidden group cursor-pointer shadow-inner">
                  <input type="file" className="absolute inset-0 opacity-0 cursor-pointer z-20" onChange={handleImageUpload} accept="image/*" />
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Stream Preview" />
                  ) : (
                    <div className="text-center p-8">
                      <svg className="w-12 h-12 text-slate-200 mb-4 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Upload Stream Frame (16:9)</p>
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {placementOptions.map(opt => (
                    <button 
                      key={opt} type="button" onClick={() => setFormData(p => ({ ...p, placement: opt }))}
                      className={`py-5 rounded-2xl text-[9px] font-black border-2 transition-all text-center leading-tight uppercase ${formData.placement === opt ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/30'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">2. Temporal Synchronization (7-Day Window)</label>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-6">
                  <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Pick Date (Max +7 Days)</label>
                  <div className="grid grid-cols-4 gap-3">
                    {dateWindow.map(d => (
                      <button 
                        key={d.full} type="button" 
                        onClick={() => setFormData(p => ({ ...p, date: d.full }))}
                        className={`flex flex-col items-center justify-center py-4 rounded-2xl border-2 transition-all ${formData.date === d.full ? 'bg-jetblue border-jetblue text-white shadow-xl translate-y-[-4px]' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/30'}`}
                      >
                        <span className="text-[8px] font-black uppercase mb-1">{d.month}</span>
                        <span className="text-xl font-black italic leading-none">{d.num}</span>
                        <span className="text-[8px] font-black uppercase mt-1 opacity-50">{d.day}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-10">
                   <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Broadcast Time (Local)</label>
                        <input 
                          type="time" required value={formData.time} 
                          onChange={e => setFormData(p => ({ ...p, time: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-base font-black dark:text-white outline-none focus:border-jetblue"
                        />
                      </div>
                      <div className="space-y-4">
                        <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Source Timezone</label>
                        <select 
                          value={formData.timezone} 
                          onChange={e => setFormData(p => ({ ...p, timezone: e.target.value }))}
                          className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-6 py-5 text-[11px] font-black dark:text-white outline-none focus:border-jetblue appearance-none"
                        >
                          {TIMEZONES.map(tz => <option key={tz.value} value={tz.value}>{tz.label}</option>)}
                        </select>
                      </div>
                   </div>

                   <div className="p-8 bg-jetblue/5 dark:bg-white/5 rounded-[2.5rem] border border-jetblue/10 flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Protocol Normalized Display</p>
                        <p className="text-xl font-black text-jetblue dark:text-prmgold italic uppercase tracking-tighter">
                          {convertToEST(formData.date, formData.time, formData.timezone).fullDate}
                        </p>
                      </div>
                      <div className="bg-jetblue text-white px-3 py-1 rounded-lg text-[8px] font-black uppercase italic">SYNCED</div>
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 border border-slate-100 dark:border-slate-800 shadow-2xl space-y-12">
              <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.4em] mb-4 italic">3. Distribution & Reach Parameters</label>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Broadcast Title</label>
                  <input 
                    type="text" required placeholder="Onchain Revolution Live"
                    value={formData.title} onChange={e => setFormData(p => ({ ...p, title: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-2xl px-8 py-6 text-lg font-black dark:text-white outline-none focus:border-jetblue shadow-sm"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Niche Segment</label>
                  <select 
                    value={formData.genre} onChange={e => setFormData(p => ({ ...p, genre: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-2xl px-8 py-6 text-lg font-black dark:text-white outline-none focus:border-jetblue appearance-none shadow-sm uppercase italic"
                  >
                    {genres.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-6">
                <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Active Distribution Channels</label>
                <div className="flex flex-wrap gap-4">
                  {platformsList.map(p => (
                    <button 
                      key={p} type="button" onClick={() => {
                        setFormData(prev => ({
                          ...prev,
                          platforms: prev.platforms.includes(p) ? prev.platforms.filter(x => x !== p) : [...prev.platforms, p]
                        }));
                      }}
                      className={`px-8 py-4 rounded-xl text-[11px] font-black border-2 transition-all shadow-md uppercase ${formData.platforms.includes(p) ? 'bg-[#001A41] border-jetblue text-white' : 'bg-slate-50 dark:bg-slate-950 border-transparent text-slate-400 hover:border-jetblue/20'}`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Avg CCV</label>
                  <input 
                    type="number" required placeholder="1000"
                    value={formData.viewers} onChange={e => setFormData(p => ({ ...p, viewers: e.target.value }))}
                    className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-transparent rounded-2xl px-8 py-6 text-lg font-black dark:text-white outline-none focus:border-jetblue shadow-sm"
                  />
                </div>
                <div className="space-y-4">
                  <label className="block text-[11px] font-black text-slate-500 uppercase tracking-widest mb-3">Slot Pricing (USDC)</label>
                  <div className="relative">
                    <input 
                      type="number" step="0.01" required placeholder="1.00"
                      value={formData.price} onChange={e => setFormData(p => ({ ...p, price: e.target.value }))}
                      className="w-full bg-white dark:bg-slate-950 border-2 border-[#001A41] rounded-2xl px-8 py-6 text-lg font-black dark:text-white outline-none focus:ring-4 focus:ring-jetblue/10 transition-all shadow-sm"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1 text-slate-400">
                      <svg className="w-4 h-4 cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" /></svg>
                      <svg className="w-4 h-4 cursor-pointer" fill="currentColor" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-6">
              <button 
                type="submit" 
                disabled={isSuccess}
                className={`px-16 py-8 rounded-[2.5rem] font-black text-lg uppercase tracking-[0.5em] transition-all flex items-center gap-6 shadow-2xl ${isSuccess ? 'bg-green-500 text-white' : 'bg-jetblue hover:bg-jetblue-bright text-white hover:-translate-y-2'}`}
              >
                {isSuccess ? 'SLOT DEPLOYED' : 'DEPLOY TO MARKETPLACE'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6 transition-colors">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">CREATOR HUB</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.4em] uppercase">{userEmail}</p>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={() => setIsListingMode(true)} className="px-8 py-4 bg-jetblue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-jetblue/20 hover:bg-jetblue-bright transition-all">List New Slot</button>
             <button onClick={onLogout} className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-red-500/20 hover:text-red-500 transition-all">Log Out</button>
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
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-12">
          {(['slots', 'revenue', 'analytics'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-jetblue dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}>{tab}{activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-jetblue rounded-t-full shadow-[0_0_15px_rgba(0,32,91,0.5)]"></div>}</button>
          ))}
        </div>
        
        <WelcomeScreen />

      </div>
    </div>
  );
};

export default CreatorHub;


import React, { useState, useMemo, useEffect } from 'react';

interface CardProps {
  id: string;
  image: string;
  title: string;
  date: string;
  day: string;
  time: string;
  platforms: string[];
  category: string;
  price: string;
  creator: string;
  logoPlacement: string;
  creatorEmail: string;
  twitterHandle: string;
  isVerified: boolean;
  totalBuys: number;
}

const PlacementCard: React.FC<CardProps & { onClick: () => void }> = ({ image, title, date, platforms, category, price, creator, onClick }) => (
  <div 
    className="group flex flex-col items-center cursor-pointer"
    onClick={onClick}
  >
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 mb-6 group-hover:border-prmgold/50 transition-all">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/80 text-white text-[10px] font-black px-2 py-0.5 rounded border border-white/20 tracking-widest uppercase">AD SLOT</div>
      </div>
      <div className="absolute top-4 right-4 bg-jetblue text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">
        {creator}
      </div>
      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
        <span className="bg-white text-jetblue text-[10px] font-black px-4 py-2 rounded-lg uppercase tracking-widest">Inspect Placement</span>
      </div>
    </div>
    
    <div className="text-center w-full">
      <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-1 group-hover:text-jetblue transition-colors">{title}</h3>
      <p className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 tracking-[0.2em] mb-3">{date}</p>
      
      <div className="flex justify-center flex-wrap gap-1.5 mb-4">
        {platforms.map(p => (
          <span key={p} className="text-[9px] font-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded border border-slate-200 dark:border-slate-700 tracking-tighter uppercase">{p}</span>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-2">
        <span className="text-[9px] font-black px-2 py-0.5 bg-jetblue/5 dark:bg-jetblue/20 text-jetblue dark:text-jetblue-light rounded uppercase tracking-widest">{category}</span>
        <span className="text-sm font-black text-slate-900 dark:text-white tracking-tight">{price} USDC</span>
      </div>
    </div>
  </div>
);

const Marketplace: React.FC = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<CardProps | null>(null);
  const [status, setStatus] = useState<'active' | 'ended'>('active');
  
  // Filter States
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [otherPlatform, setOtherPlatform] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [selectedLogoPos, setSelectedLogoPos] = useState('');

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const times = ['MORNING', 'AFTERNOON', 'NIGHT'];
  const platforms = ['YOUTUBE', 'X', 'SPOTIFY', 'KICK', 'TWITCH', 'RUMBLE', 'PUMPFUN', 'ZORA', 'FACEBOOK', 'INSTAGRAM', 'DISCORD', 'OTHER'];
  const genres = ['CRYPTO', 'GAMING', 'JUST CHATTING', 'TECH', 'SPORTS', 'LIFESTYLE'];
  const creators = ['ChartMaster', 'Ninja Clone', 'Just Chatty', 'Aura Stream', 'Bull Run Billy', 'Vibe Check'];
  const placements = ['TOP LEFT', 'TOP MIDDLE', 'TOP RIGHT', 'BOTTOM LEFT', 'BOTTOM MIDDLE', 'BOTTOM RIGHT'];

  useEffect(() => {
    if (isFilterOpen || selectedPlacement) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isFilterOpen, selectedPlacement]);

  const allPlacements: CardProps[] = [
    {
      id: "p1",
      image: "https://images.unsplash.com/photo-1611974714658-75d32b33688e?auto=format&fit=crop&q=80&w=800",
      title: "CHARTMASTER LIVE",
      date: "MONDAY JULY 13TH 2PM - 4PM",
      day: "MON",
      time: "AFTERNOON",
      platforms: ["YOUTUBE", "X"],
      category: "CRYPTO",
      price: "450",
      creator: "ChartMaster",
      logoPlacement: "TOP RIGHT",
      creatorEmail: "verified@chartmaster.prm",
      twitterHandle: "@ChartMaster_PRM",
      isVerified: true,
      totalBuys: 142
    },
    {
      id: "p2",
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      title: "PRO GAMING ARENA",
      date: "TUESDAY JULY 14TH 6PM - 8PM",
      day: "TUE",
      time: "NIGHT",
      platforms: ["TWITCH", "YOUTUBE", "KICK"],
      category: "GAMING",
      price: "1200",
      creator: "Ninja Clone",
      logoPlacement: "TOP LEFT",
      creatorEmail: "contact@ninjaclone.tv",
      twitterHandle: "@NinjaClone_Official",
      isVerified: true,
      totalBuys: 894
    },
    {
      id: "p3",
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
      title: "VIBE TALK SESSIONS",
      date: "WEDNESDAY JULY 15TH 1PM - 3PM",
      day: "WED",
      time: "AFTERNOON",
      platforms: ["KICK", "X"],
      category: "JUST CHATTING",
      price: "820",
      creator: "Just Chatty",
      logoPlacement: "BOTTOM MIDDLE",
      creatorEmail: "vibe@chatty.co",
      twitterHandle: "@JustChattyVibes",
      isVerified: false,
      totalBuys: 54
    }
  ];

  const filteredPlacements = useMemo(() => {
    return allPlacements.filter(p => {
      if (selectedDays.length > 0 && !selectedDays.includes(p.day)) return false;
      if (selectedTimes.length > 0 && !selectedTimes.includes(p.time)) return false;
      if (selectedGenre && p.category !== selectedGenre) return false;
      if (selectedCreator && p.creator !== selectedCreator) return false;
      if (selectedLogoPos && p.logoPlacement !== selectedLogoPos) return false;
      if (selectedPlatforms.length > 0) {
        const hasPlatform = p.platforms.some(plat => selectedPlatforms.includes(plat));
        if (!hasPlatform) return false;
      }
      return true;
    });
  }, [selectedDays, selectedTimes, selectedPlatforms, selectedGenre, selectedCreator, selectedLogoPos]);

  const toggleFilter = (list: string[], item: string, setFn: React.Dispatch<React.SetStateAction<string[]>>) => {
    if (list.includes(item)) {
      setFn(list.filter(i => i !== item));
    } else {
      setFn([...list, item]);
    }
  };

  const resetFilters = () => {
    setSelectedDays([]);
    setSelectedTimes([]);
    setSelectedPlatforms([]);
    setOtherPlatform('');
    setSelectedGenre('');
    setSelectedCreator('');
    setSelectedLogoPos('');
  };

  const activeFilterCount = (
    selectedDays.length + 
    selectedTimes.length + 
    selectedPlatforms.length + 
    (selectedGenre ? 1 : 0) + 
    (selectedCreator ? 1 : 0) + 
    (selectedLogoPos ? 1 : 0)
  );

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
            CONTENT SPONSORSHIP
          </h1>
          <h2 className="text-5xl md:text-7xl font-black text-jetblue dark:text-jetblue-light tracking-tighter uppercase leading-none mb-6">
            MARKETPLACE
          </h2>
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 tracking-[0.5em] uppercase">
            SECURE AD SLOT REGISTRY
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-b border-slate-100 dark:border-slate-900 py-8 mb-16">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-4 px-8 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm hover:border-jetblue transition-all group relative"
          >
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-jetblue">FILTER PLACEMENTS</span>
            {activeFilterCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-jetblue text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold border-2 border-white dark:border-slate-950">
                {activeFilterCount}
              </span>
            )}
            <svg className="w-4 h-4 text-slate-400 group-hover:text-jetblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setStatus('active')}
              className={`px-8 py-2 rounded font-black text-[10px] tracking-widest uppercase transition-all ${status === 'active' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ACTIVE SLOTS
            </button>
            <button 
              onClick={() => setStatus('ended')}
              className={`px-8 py-2 rounded font-black text-[10px] tracking-widest uppercase transition-all ${status === 'ended' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ARCHIVED
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredPlacements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {filteredPlacements.map((item) => (
              <PlacementCard 
                key={item.id} 
                {...item} 
                onClick={() => setSelectedPlacement(item)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-900 rounded-3xl">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No matching placements found.</p>
            <button onClick={resetFilters} className="mt-4 text-jetblue font-black text-xs uppercase underline decoration-2 underline-offset-4">Reset Dashboard Filters</button>
          </div>
        )}

      </div>

      {/* FILTER DRAWER */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">FILTERS</h2>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">SPECIFY YOUR REQUIREMENTS</p>
            </div>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-400 hover:text-jetblue"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Availability Window</label>
              <div className="flex flex-wrap gap-2">{days.map(day => (
                <button key={day} onClick={() => toggleFilter(selectedDays, day, setSelectedDays)} className={`px-3 py-1.5 rounded text-[10px] font-black border transition-all ${selectedDays.includes(day) ? 'bg-jetblue border-jetblue text-white shadow-lg shadow-jetblue/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:border-jetblue'}`}>{day}</button>
              ))}</div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Time Zone Preference</label>
              <div className="flex flex-wrap gap-2">{times.map(time => (
                <button key={time} onClick={() => toggleFilter(selectedTimes, time, setSelectedTimes)} className={`px-3 py-1.5 rounded text-[10px] font-black border transition-all ${selectedTimes.includes(time) ? 'bg-jetblue border-jetblue text-white shadow-lg shadow-jetblue/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 hover:border-jetblue'}`}>{time}</button>
              ))}</div>
            </div>
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Category</label>
              <select value={selectedGenre} onChange={(e) => setSelectedGenre(e.target.value)} className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-jetblue appearance-none">
                <option value="">ALL GENRES</option>{genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>
          <div className="p-8 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex gap-4">
            <button onClick={resetFilters} className="flex-1 px-6 py-4 rounded-xl text-xs font-black text-slate-500 hover:text-jetblue border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 uppercase tracking-widest">Clear</button>
            <button onClick={() => setIsFilterOpen(false)} className="flex-[2] px-6 py-4 rounded-xl text-xs font-black text-white bg-jetblue hover:bg-jetblue-bright uppercase tracking-widest shadow-xl shadow-jetblue/20">Apply Filters</button>
          </div>
        </div>
      </div>

      {/* PLACEMENT DETAIL PANEL */}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${selectedPlacement ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedPlacement(null)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 transform ${selectedPlacement ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          
          {/* Header */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div>
              <div className="inline-block px-2 py-0.5 bg-jetblue text-white text-[8px] font-black rounded uppercase tracking-widest mb-2">PRM SECURE LISTING</div>
              <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">{selectedPlacement?.title}</h2>
            </div>
            <button onClick={() => setSelectedPlacement(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-12">
            
            {/* Visual Preview */}
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl">
               <img src={selectedPlacement?.image} className="w-full h-full object-cover" />
               <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-prmgold uppercase tracking-widest mb-1">DESIGNATED PLACEMENT</p>
                  <p className="text-lg font-black text-white uppercase italic">{selectedPlacement?.logoPlacement}</p>
               </div>
            </div>

            {/* CREATOR PROFILE HUB */}
            <section>
               <div className="flex items-center gap-4 mb-6">
                 <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
                 <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">CREATOR VERIFICATION CORE</h3>
                 <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800"></div>
               </div>

               <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                     <div className="w-24 h-24 bg-jetblue rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl ring-4 ring-white dark:ring-slate-900">
                        {selectedPlacement?.creator.charAt(0)}
                     </div>
                     <div className="flex-1 space-y-4">
                        <div className="flex items-center flex-wrap gap-3">
                           <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedPlacement?.creator}</h4>
                           {selectedPlacement?.isVerified ? (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-blue-500/10 rounded-full border border-blue-500/20">
                                <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z"/></svg>
                                <span className="text-[10px] font-black text-blue-500 uppercase tracking-tighter">PRM VERIFIED</span>
                             </div>
                           ) : (
                             <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 rounded-full border border-red-500/20">
                                <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05z"/></svg>
                                <span className="text-[10px] font-black text-red-500 uppercase tracking-tighter">UNVERIFIED IDENTITY</span>
                             </div>
                           )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Linked X Profile</p>
                              <a href={`https://x.com/${selectedPlacement?.twitterHandle.replace('@','')}`} target="_blank" className="text-xs font-bold text-jetblue hover:underline flex items-center gap-1.5">
                                 <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                 {selectedPlacement?.twitterHandle}
                              </a>
                           </div>
                           <div className="space-y-1">
                              <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Business Email</p>
                              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedPlacement?.creatorEmail}</p>
                           </div>
                        </div>

                        <div className="pt-4 flex items-center gap-6">
                           <div className="text-center">
                              <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{selectedPlacement?.totalBuys}</p>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Confirmed Buys</p>
                           </div>
                           <div className="h-8 w-px bg-slate-200 dark:bg-slate-700"></div>
                           <div className="text-center">
                              <p className="text-2xl font-black text-green-500 leading-none">100%</p>
                              <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1">Completion</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

            {/* Platform Matrix */}
            <section>
               <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-6">LIVE BROADCAST TARGETS</h3>
               <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {selectedPlacement?.platforms.map(p => (
                    <div key={p} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-3 shadow-sm group hover:border-jetblue transition-all">
                       <div className="w-8 h-8 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-jetblue group-hover:scale-110 transition-transform">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>
                       </div>
                       <span className="text-[9px] font-black uppercase tracking-widest">{p}</span>
                    </div>
                  ))}
               </div>
            </section>

          </div>

          {/* Checkout Footer */}
          <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">PLACEMENT PRICE</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{selectedPlacement?.price}</span>
                  <span className="text-sm font-black text-slate-500">USDC</span>
               </div>
            </div>
            <button className="bg-prmgold hover:bg-prmgold-dark text-white px-12 py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-2xl shadow-prmgold/40 hover:-translate-y-1 active:scale-95 transition-all flex items-center gap-4">
               BUY IT NOW
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

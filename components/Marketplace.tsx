
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
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLogoPos, setSelectedLogoPos] = useState('');

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const times = ['MORNING', 'AFTERNOON', 'NIGHT'];
  const platformsList = ['YOUTUBE', 'X', 'TIKTOK', 'FACEBOOK', 'INSTAGRAM', 'TWITCH', 'KICK', 'PUMPFUN', 'ZORA', 'RUMBLE', 'DISCORD', 'OTHER'];
  const genres = ['CRYPTO', 'GAMING', 'JUST CHATTING', 'TECH', 'SPORTS', 'LIFESTYLE'];
  const logoPositions = ['TOP LEFT', 'TOP MIDDLE', 'TOP RIGHT', 'BOTTOM LEFT', 'BOTTOM MIDDLE', 'BOTTOM RIGHT'];

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
      if (selectedLogoPos && p.logoPlacement !== selectedLogoPos) return false;
      if (selectedPlatforms.length > 0) {
        const hasPlatform = p.platforms.some(plat => selectedPlatforms.includes(plat));
        if (!hasPlatform) return false;
      }
      return true;
    });
  }, [selectedDays, selectedTimes, selectedPlatforms, selectedGenre, selectedLogoPos]);

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
    setSelectedGenre('');
    setSelectedLogoPos('');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-24 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter uppercase mb-2">
            CONTENT PLACEMENT
          </h1>
          <h2 className="text-5xl md:text-7xl font-black text-jetblue dark:text-jetblue-light tracking-tighter uppercase leading-none mb-6">
            MARKETPLACE
          </h2>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-b border-slate-100 dark:border-slate-900 py-8 mb-16">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-4 px-8 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm hover:border-jetblue transition-all group"
          >
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-jetblue">FILTER PLACEMENTS</span>
            <svg className="w-4 h-4 text-slate-400 group-hover:text-jetblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4" />
            </svg>
          </button>

          <div className="flex items-center bg-slate-100 dark:bg-slate-900 p-1.5 rounded-lg">
            <button onClick={() => setStatus('active')} className={`px-8 py-2 rounded font-black text-[10px] tracking-widest uppercase ${status === 'active' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}>ACTIVE</button>
            <button onClick={() => setStatus('ended')} className={`px-8 py-2 rounded font-black text-[10px] tracking-widest uppercase ${status === 'ended' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400'}`}>ENDED</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
          {filteredPlacements.map((item) => (
            <PlacementCard 
              key={item.id} 
              {...item} 
              onClick={() => setSelectedPlacement(item)}
            />
          ))}
          {filteredPlacements.length === 0 && (
            <div className="col-span-full py-32 text-center">
               <p className="text-xl font-black text-slate-400 uppercase tracking-widest">No matching placements found.</p>
               <button onClick={resetFilters} className="mt-4 text-jetblue font-bold uppercase text-xs tracking-widest">Reset All Filters</button>
            </div>
          )}
        </div>

      </div>

      {/* PLACEMENT DETAIL PANEL (SIDEBAR) */}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-300 ${selectedPlacement ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-md" onClick={() => setSelectedPlacement(null)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-2xl bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 transform ${selectedPlacement ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedPlacement?.title}</h2>
            <button onClick={() => setSelectedPlacement(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-12">
            <div className="relative aspect-video rounded-3xl overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl">
               <img src={selectedPlacement?.image} className="w-full h-full object-cover" />
               <div className="absolute top-6 left-6 p-4 bg-black/60 backdrop-blur-md rounded-2xl border border-white/10">
                  <p className="text-[10px] font-black text-prmgold uppercase tracking-widest mb-1">PLACEMENT ZONE</p>
                  <p className="text-lg font-black text-white uppercase italic">{selectedPlacement?.logoPlacement}</p>
               </div>
            </div>

            <section className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
               <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 bg-jetblue rounded-3xl flex items-center justify-center text-white text-3xl font-black shadow-xl">
                     {selectedPlacement?.creator.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-6">
                     <div className="flex items-center gap-3 flex-wrap">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">{selectedPlacement?.creator}</h4>
                        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border ${selectedPlacement?.isVerified ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                           <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z"/></svg>
                           <span className="text-[10px] font-black uppercase tracking-tighter">{selectedPlacement?.isVerified ? 'VERIFIED' : 'UNVERIFIED'}</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Authority X Profile</p>
                           <p className="text-xs font-bold text-jetblue dark:text-blue-400 flex items-center gap-1.5">{selectedPlacement?.twitterHandle}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Contact Identity</p>
                           <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{selectedPlacement?.creatorEmail}</p>
                        </div>
                        <div className="space-y-1">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Confirmed Marketplace Buys</p>
                           <p className="text-2xl font-black text-slate-900 dark:text-white leading-none">{selectedPlacement?.totalBuys}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

          </div>

          <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">TRANSACTION PRICE</p>
               <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">{selectedPlacement?.price}</span>
                  <span className="text-sm font-black text-slate-500">USDC</span>
               </div>
            </div>
            <button className="bg-prmgold hover:bg-prmgold-dark text-white px-12 py-6 rounded-2xl font-black text-xl uppercase tracking-[0.2em] shadow-2xl hover:-translate-y-1 transition-all flex items-center gap-4">
               BUY IT NOW
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </div>
      </div>

      {/* FILTER DRAWER (RESTORED) */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">FILTER PLACEMENTS</h2>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-400 hover:text-jetblue"><svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-8 space-y-10">
            {/* Availability Window */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Availability Window</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button 
                    key={day} 
                    onClick={() => toggleFilter(selectedDays, day, setSelectedDays)} 
                    className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${selectedDays.includes(day) ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Broadcast Time */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Broadcasting Time</label>
              <div className="flex flex-wrap gap-2">
                {times.map(t => (
                  <button 
                    key={t} 
                    onClick={() => toggleFilter(selectedTimes, t, setSelectedTimes)} 
                    className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${selectedTimes.includes(t) ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Distribution Channels</label>
              <div className="flex flex-wrap gap-2">
                {platformsList.map(p => (
                  <button 
                    key={p} 
                    onClick={() => toggleFilter(selectedPlatforms, p, setSelectedPlatforms)} 
                    className={`px-4 py-2 rounded-xl text-[10px] font-black border-2 transition-all ${selectedPlatforms.includes(p) ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Content Niche</label>
              <div className="grid grid-cols-2 gap-2">
                {genres.map(g => (
                  <button 
                    key={g} 
                    onClick={() => setSelectedGenre(selectedGenre === g ? '' : g)} 
                    className={`px-4 py-3 rounded-xl text-[10px] font-black border-2 transition-all text-left ${selectedGenre === g ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Position */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Logo Anchor Point</label>
              <div className="grid grid-cols-3 gap-2">
                {logoPositions.map(pos => (
                  <button 
                    key={pos} 
                    onClick={() => setSelectedLogoPos(selectedLogoPos === pos ? '' : pos)} 
                    className={`px-2 py-4 rounded-xl text-[9px] font-black border-2 transition-all text-center leading-tight flex items-center justify-center ${selectedLogoPos === pos ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-8 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex gap-4">
            <button onClick={resetFilters} className="flex-1 px-6 py-4 rounded-xl text-[10px] font-black text-slate-500 border-2 border-slate-200 dark:border-slate-800 uppercase tracking-widest hover:border-red-500 transition-colors">Reset</button>
            <button onClick={() => setIsFilterOpen(false)} className="flex-[2] px-6 py-4 rounded-xl text-[10px] font-black text-white bg-jetblue uppercase tracking-[0.2em] shadow-xl shadow-jetblue/20 hover:bg-jetblue-bright transition-all">Apply Stack</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

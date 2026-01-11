
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

interface MarketplaceProps {
  isLoggedIn?: boolean;
  onAuthRequired?: () => void;
}

const PlacementCard: React.FC<CardProps & { onClick: () => void }> = ({ image, title, date, platforms, category, price, creator, onClick }) => (
  <div 
    className="group flex flex-col items-center cursor-pointer"
    onClick={onClick}
  >
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 mb-8 group-hover:border-jetblue/50 transition-all shadow-lg group-hover:shadow-2xl">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale-[40%] group-hover:grayscale-0" />
      <div className="absolute bottom-6 left-6">
        <div className="bg-black/90 text-white text-[9px] font-black px-3 py-1 rounded-lg border border-white/20 tracking-[0.3em] uppercase backdrop-blur-md">AD SLOT</div>
      </div>
      <div className="absolute top-6 right-6 bg-jetblue text-white text-[10px] font-black px-4 py-1.5 rounded-xl shadow-2xl uppercase tracking-tighter">
        {creator}
      </div>
      <div className="absolute inset-0 bg-jetblue/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[4px]">
        <div className="bg-white text-jetblue px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          Inspect Placement
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
    
    <div className="text-center w-full px-4">
      <h3 className="text-2xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2 group-hover:text-jetblue transition-colors leading-none">{title}</h3>
      <p className="text-[10px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.3em] mb-4 italic leading-none">{date}</p>
      
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {platforms.map(p => (
          <span key={p} className="text-[9px] font-black px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 tracking-tighter uppercase">{p}</span>
        ))}
      </div>
      
      <div className="flex items-center justify-center gap-3">
        <span className="text-[9px] font-black px-3 py-1 bg-jetblue/10 text-jetblue dark:text-jetblue-light rounded-full uppercase tracking-[0.2em]">{category}</span>
        <div className="flex items-baseline gap-1">
           <span className="text-lg font-black text-slate-900 dark:text-white tracking-tighter">{price}</span>
           <span className="text-[10px] font-black text-slate-400">USDC</span>
        </div>
      </div>
    </div>
  </div>
);

const Marketplace: React.FC<MarketplaceProps> = ({ isLoggedIn, onAuthRequired }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<CardProps | null>(null);
  const [status, setStatus] = useState<'active' | 'ended'>('active');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
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
    },
    {
      id: "p4",
      image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=800",
      title: "PUMP WATCHER PRO",
      date: "THURSDAY JULY 16TH 9PM - 12AM",
      day: "THU",
      time: "NIGHT",
      platforms: ["PUMPFUN", "X"],
      category: "CRYPTO",
      price: "680",
      creator: "TokenTrapper",
      logoPlacement: "BOTTOM RIGHT",
      creatorEmail: "team@tokentrapper.prm",
      twitterHandle: "@TokenTrapper_PRM",
      isVerified: true,
      totalBuys: 43
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

  const handleBuy = () => {
    if (!isLoggedIn) {
      onAuthRequired?.();
      return;
    }
    setIsPurchasing(true);
    // Simulate real USDC settlement
    setTimeout(() => {
      setIsPurchasing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setSelectedPlacement(null);
      }, 3000);
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-24 pb-48">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-24">
           <div className="flex items-center justify-center gap-6 mb-8">
              <div className="h-[2px] w-12 bg-jetblue dark:bg-prmgold opacity-30"></div>
              <h1 className="text-6xl md:text-8xl font-black text-jetblue dark:text-jetblue-light tracking-tighter uppercase leading-none italic">
                MARKETPLACE
              </h1>
              <div className="h-[2px] w-12 bg-jetblue dark:bg-prmgold opacity-30"></div>
           </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.5em] italic">Precision Scalable Monetization Layer</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-8 border-t border-b border-slate-100 dark:border-slate-900 py-10 mb-20">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-6 px-10 py-4 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm hover:border-jetblue transition-all group"
          >
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white group-hover:text-jetblue">ADJUST TARGETING STACK</span>
            <div className="w-5 h-5 flex items-center justify-center bg-slate-100 dark:bg-slate-900 rounded-md group-hover:bg-jetblue/10">
               <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-jetblue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4" />
               </svg>
            </div>
          </button>

          <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-2 rounded-2xl shadow-inner border border-slate-100 dark:border-white/5">
            <button onClick={() => setStatus('active')} className={`px-10 py-3 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all ${status === 'active' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>OPEN SLOTS</button>
            <button onClick={() => setStatus('ended')} className={`px-10 py-3 rounded-xl font-black text-[11px] tracking-widest uppercase transition-all ${status === 'ended' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xl' : 'text-slate-400 hover:text-slate-600'}`}>HISTORICAL</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-24">
          {filteredPlacements.map((item) => (
            <PlacementCard 
              key={item.id} 
              {...item} 
              onClick={() => setSelectedPlacement(item)}
            />
          ))}
          {filteredPlacements.length === 0 && (
            <div className="col-span-full py-48 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
               <p className="text-2xl font-black text-slate-400 uppercase tracking-widest italic mb-6">NULL TARGETING RESULTS</p>
               <button onClick={resetFilters} className="text-jetblue font-black uppercase text-xs tracking-[0.4em] hover:underline underline-offset-8 transition-all">Reset Active Stack</button>
            </div>
          )}
        </div>

      </div>

      {/* PLACEMENT DETAIL PANEL (SIDEBAR) */}
      <div className={`fixed inset-0 z-[70] transition-opacity duration-500 ${selectedPlacement ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => !isPurchasing && !isSuccess && setSelectedPlacement(null)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-3xl bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-700 transform ${selectedPlacement ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          
          <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="px-3 py-1 bg-prmgold text-white font-black text-[10px] rounded uppercase italic">SECURED</div>
               <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{selectedPlacement?.title}</h2>
            </div>
            <button onClick={() => setSelectedPlacement(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
              <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-12 space-y-16">
            <div className="relative aspect-video rounded-[3rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl group">
               <img src={selectedPlacement?.image} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700" />
               <div className="absolute top-8 left-8 p-6 bg-black/80 backdrop-blur-xl rounded-[2rem] border border-white/20 shadow-2xl">
                  <p className="text-[10px] font-black text-prmgold uppercase tracking-[0.3em] mb-2">PRECISION ANCHOR</p>
                  <p className="text-2xl font-black text-white uppercase italic tracking-tighter">{selectedPlacement?.logoPlacement}</p>
               </div>
            </div>

            <section className="bg-slate-50 dark:bg-slate-900/50 rounded-[4rem] p-12 border border-slate-100 dark:border-slate-800 space-y-12">
               <div className="flex flex-col md:flex-row gap-10 items-start">
                  <div className="w-32 h-32 bg-jetblue rounded-[2.5rem] flex items-center justify-center text-white text-5xl font-black shadow-2xl transform -rotate-3 group-hover:rotate-0 transition-transform">
                     {selectedPlacement?.creator.charAt(0)}
                  </div>
                  <div className="flex-1 space-y-8">
                     <div className="flex items-center gap-4 flex-wrap">
                        <h4 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{selectedPlacement?.creator}</h4>
                        <div className={`flex items-center gap-2 px-4 py-1.5 rounded-full border shadow-sm ${selectedPlacement?.isVerified ? 'bg-blue-500/10 border-blue-500/20 text-blue-500' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}>
                           <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z"/></svg>
                           <span className="text-[10px] font-black uppercase tracking-widest">{selectedPlacement?.isVerified ? 'SYSTEM VERIFIED' : 'PENDING AUDIT'}</span>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
                        <div className="space-y-2">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">X Identity</p>
                           <p className="text-sm font-black text-jetblue dark:text-blue-400 flex items-center gap-2 italic">{selectedPlacement?.twitterHandle}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Communication</p>
                           <p className="text-sm font-black text-slate-700 dark:text-slate-300">{selectedPlacement?.creatorEmail}</p>
                        </div>
                        <div className="space-y-2">
                           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em]">Marketplace Velocity</p>
                           <p className="text-4xl font-black text-slate-900 dark:text-white leading-none tracking-tighter">{selectedPlacement?.totalBuys}</p>
                        </div>
                     </div>
                  </div>
               </div>
            </section>

          </div>

          <div className="p-12 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-8">
            <div className="space-y-2 text-center sm:text-left">
               <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.4em]">SETTLEMENT AMOUNT</p>
               <div className="flex items-baseline justify-center sm:justify-start gap-3">
                  <span className="text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">{selectedPlacement?.price}</span>
                  <span className="text-xl font-black text-slate-400 tracking-widest">USDC</span>
               </div>
            </div>
            
            <button 
              disabled={isPurchasing || isSuccess}
              onClick={handleBuy}
              className={`w-full sm:w-auto min-w-[300px] h-24 rounded-[2.5rem] font-black text-xl uppercase tracking-[0.4em] shadow-2xl transition-all flex items-center justify-center gap-6 relative overflow-hidden ${
                isSuccess ? 'bg-green-500 text-white' : 
                isPurchasing ? 'bg-slate-100 dark:bg-slate-800 text-slate-400' : 
                'bg-prmgold hover:bg-prmgold-dark text-white hover:-translate-y-2 active:scale-95'
              }`}
            >
               {isSuccess ? (
                 <div className="flex items-center gap-4 animate-in zoom-in duration-300">
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={4}><path d="M5 13l4 4L19 7"/></svg>
                   SLOT RESERVED
                 </div>
               ) : isPurchasing ? (
                 <div className="flex items-center gap-4">
                   <div className="w-6 h-6 border-4 border-slate-300 border-t-jetblue rounded-full animate-spin"></div>
                   EXECUTING
                 </div>
               ) : (
                 <>
                   LOCK IN SLOT
                   <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                 </>
               )}
            </button>
          </div>
        </div>
      </div>

      {/* FILTER DRAWER */}
      <div className={`fixed inset-0 z-[60] transition-opacity duration-500 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-md" onClick={() => setIsFilterOpen(false)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-lg bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-700 transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-10 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">TARGETING STACK</h2>
            <button onClick={() => setIsFilterOpen(false)} className="p-2 text-slate-400 hover:text-jetblue"><svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>
          <div className="flex-1 overflow-y-auto p-10 space-y-12">
            {/* Availability Window */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 italic">Broadcast Calendar</label>
              <div className="flex flex-wrap gap-2.5">
                {days.map(day => (
                  <button 
                    key={day} 
                    onClick={() => toggleFilter(selectedDays, day, setSelectedDays)} 
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black border-2 transition-all ${selectedDays.includes(day) ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-jetblue/30'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Broadcast Time */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 italic">Scheduling Window</label>
              <div className="flex flex-wrap gap-2.5">
                {times.map(t => (
                  <button 
                    key={t} 
                    onClick={() => toggleFilter(selectedTimes, t, setSelectedTimes)} 
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black border-2 transition-all ${selectedTimes.includes(t) ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-jetblue/30'}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Platforms */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 italic">Distribution Pipeline</label>
              <div className="flex flex-wrap gap-2.5">
                {platformsList.map(p => (
                  <button 
                    key={p} 
                    onClick={() => toggleFilter(selectedPlatforms, p, setSelectedPlatforms)} 
                    className={`px-6 py-3 rounded-2xl text-[11px] font-black border-2 transition-all ${selectedPlatforms.includes(p) ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-jetblue/30'}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 italic">Content Niche Segment</label>
              <div className="grid grid-cols-2 gap-3">
                {genres.map(g => (
                  <button 
                    key={g} 
                    onClick={() => setSelectedGenre(selectedGenre === g ? '' : g)} 
                    className={`px-6 py-4 rounded-2xl text-[11px] font-black border-2 transition-all text-left ${selectedGenre === g ? 'bg-jetblue border-jetblue text-white shadow-xl scale-[1.02]' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500'}`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Position */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 italic">Visual Anchor Priority</label>
              <div className="grid grid-cols-3 gap-3">
                {logoPositions.map(pos => (
                  <button 
                    key={pos} 
                    onClick={() => setSelectedLogoPos(selectedLogoPos === pos ? '' : pos)} 
                    className={`px-2 py-5 rounded-2xl text-[10px] font-black border-2 transition-all text-center leading-tight flex items-center justify-center ${selectedLogoPos === pos ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:border-jetblue/30'}`}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="p-10 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex gap-6">
            <button onClick={resetFilters} className="flex-1 px-8 py-5 rounded-2xl text-[10px] font-black text-slate-500 border-2 border-slate-200 dark:border-slate-800 uppercase tracking-[0.3em] hover:border-red-500 transition-colors">Clear Stack</button>
            <button onClick={() => setIsFilterOpen(false)} className="flex-[2] px-8 py-5 rounded-2xl text-[10px] font-black text-white bg-jetblue uppercase tracking-[0.5em] shadow-2xl shadow-jetblue/30 hover:bg-jetblue-bright active:scale-95 transition-all">Apply Parameters</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

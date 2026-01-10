
import React, { useState, useMemo, useEffect } from 'react';

interface CardProps {
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
}

const PlacementCard: React.FC<CardProps> = ({ image, title, date, platforms, category, price, creator }) => (
  <div className="group flex flex-col items-center">
    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 mb-6">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-80 group-hover:opacity-100" />
      <div className="absolute bottom-4 left-4">
        <div className="bg-black/80 text-white text-[10px] font-black px-2 py-0.5 rounded border border-white/20 tracking-widest uppercase">AD</div>
      </div>
      <div className="absolute top-4 right-4 bg-jetblue text-white text-[10px] font-black px-2 py-1 rounded shadow-lg uppercase">
        {creator}
      </div>
    </div>
    
    <div className="text-center w-full">
      <h3 className="text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white mb-1">{title}</h3>
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
  const [status, setStatus] = useState<'active' | 'ended'>('active');
  
  // Filter States
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [otherPlatform, setOtherPlatform] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [selectedPlacement, setSelectedPlacement] = useState('');

  const days = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const times = ['MORNING', 'AFTERNOON', 'NIGHT'];
  const platforms = ['YOUTUBE', 'X', 'SPOTIFY', 'KICK', 'TWITCH', 'RUMBLE', 'PUMPFUN', 'ZORA', 'FACEBOOK', 'INSTAGRAM', 'DISCORD', 'OTHER'];
  const genres = ['CRYPTO', 'GAMING', 'JUST CHATTING', 'TECH', 'SPORTS', 'LIFESTYLE'];
  const creators = ['ChartMaster', 'Ninja Clone', 'Just Chatty', 'Aura Stream', 'Bull Run Billy', 'Vibe Check'];
  const placements = ['TOP LEFT', 'TOP MIDDLE', 'TOP RIGHT', 'BOTTOM LEFT', 'BOTTOM MIDDLE', 'BOTTOM RIGHT'];

  // Prevent body scroll when filter window is open
  useEffect(() => {
    if (isFilterOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isFilterOpen]);

  const allPlacements: CardProps[] = [
    {
      image: "https://images.unsplash.com/photo-1611974714658-75d32b33688e?auto=format&fit=crop&q=80&w=800",
      title: "CHARTMASTER",
      date: "MONDAY JULY 13TH 2PM - 4PM",
      day: "MON",
      time: "AFTERNOON",
      platforms: ["YOUTUBE", "X"],
      category: "CRYPTO",
      price: "450",
      creator: "ChartMaster",
      logoPlacement: "TOP RIGHT"
    },
    {
      image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=800",
      title: "NINJA CLONE",
      date: "TUESDAY JULY 14TH 6PM - 8PM",
      day: "TUE",
      time: "NIGHT",
      platforms: ["TWITCH", "YOUTUBE", "KICK"],
      category: "GAMING",
      price: "1200",
      creator: "Ninja Clone",
      logoPlacement: "TOP LEFT"
    },
    {
      image: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
      title: "JUST CHATTY",
      date: "WEDNESDAY JULY 15TH 1PM - 3PM",
      day: "WED",
      time: "AFTERNOON",
      platforms: ["KICK", "X"],
      category: "JUST CHATTING",
      price: "820",
      creator: "Just Chatty",
      logoPlacement: "BOTTOM MIDDLE"
    }
  ];

  const filteredPlacements = useMemo(() => {
    return allPlacements.filter(p => {
      if (selectedDays.length > 0 && !selectedDays.includes(p.day)) return false;
      if (selectedTimes.length > 0 && !selectedTimes.includes(p.time)) return false;
      if (selectedGenre && p.category !== selectedGenre) return false;
      if (selectedCreator && p.creator !== selectedCreator) return false;
      if (selectedPlacement && p.logoPlacement !== selectedPlacement) return false;
      if (selectedPlatforms.length > 0) {
        const hasPlatform = p.platforms.some(plat => selectedPlatforms.includes(plat));
        if (!hasPlatform) return false;
      }
      return true;
    });
  }, [selectedDays, selectedTimes, selectedPlatforms, selectedGenre, selectedCreator, selectedPlacement]);

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
    setSelectedPlacement('');
  };

  const activeFilterCount = (
    selectedDays.length + 
    selectedTimes.length + 
    selectedPlatforms.length + 
    (selectedGenre ? 1 : 0) + 
    (selectedCreator ? 1 : 0) + 
    (selectedPlacement ? 1 : 0)
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
            LIVE INVENTORY DASHBOARD
          </p>
        </div>

        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 border-t border-b border-slate-100 dark:border-slate-900 py-8 mb-16">
          <button 
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-4 px-8 py-3 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded shadow-sm hover:border-jetblue dark:hover:border-jetblue transition-all group relative"
          >
            <span className="text-xs font-black uppercase tracking-widest text-slate-900 dark:text-white group-hover:text-jetblue">FILTER</span>
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
              ACTIVE
            </button>
            <button 
              onClick={() => setStatus('ended')}
              className={`px-8 py-2 rounded font-black text-[10px] tracking-widest uppercase transition-all ${status === 'ended' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
            >
              ENDED
            </button>
          </div>
        </div>

        {/* Grid */}
        {filteredPlacements.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-20">
            {filteredPlacements.map((item, idx) => (
              <PlacementCard key={idx} {...item} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 dark:border-slate-900 rounded-3xl">
            <p className="text-slate-400 font-bold uppercase tracking-widest">No matching placements found.</p>
            <button onClick={resetFilters} className="mt-4 text-jetblue font-black text-xs uppercase underline decoration-2 underline-offset-4">Clear all filters</button>
          </div>
        )}

      </div>

      {/* Side Drawer Filter Window */}
      <div 
        className={`fixed inset-0 z-[60] transition-opacity duration-300 ${isFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
          onClick={() => setIsFilterOpen(false)}
        />
        
        {/* Drawer Content */}
        <div 
          className={`absolute top-0 right-0 h-full w-full max-w-md bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-500 transform ${isFilterOpen ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}
        >
          {/* Drawer Header */}
          <div className="p-8 border-b border-slate-100 dark:border-slate-900 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">FILTERS</h2>
              <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">REFINE YOUR SEARCH</p>
            </div>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="p-2 text-slate-400 hover:text-jetblue transition-colors"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Drawer Body - Scrollable */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">
            
            {/* Days Section */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Days of the Week</label>
              <div className="flex flex-wrap gap-2">
                {days.map(day => (
                  <button
                    key={day}
                    onClick={() => toggleFilter(selectedDays, day, setSelectedDays)}
                    className={`px-3 py-1.5 rounded text-[10px] font-black border transition-all ${selectedDays.includes(day) ? 'bg-jetblue border-jetblue text-white shadow-lg shadow-jetblue/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-jetblue'}`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>

            {/* Time Section */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Time of Day</label>
              <div className="flex flex-wrap gap-2">
                {times.map(time => (
                  <button
                    key={time}
                    onClick={() => toggleFilter(selectedTimes, time, setSelectedTimes)}
                    className={`px-3 py-1.5 rounded text-[10px] font-black border transition-all ${selectedTimes.includes(time) ? 'bg-jetblue border-jetblue text-white shadow-lg shadow-jetblue/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-jetblue'}`}
                  >
                    {time}
                  </button>
                ))}
              </div>
            </div>

            {/* Genre Section */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Genre</label>
              <select 
                value={selectedGenre}
                onChange={(e) => setSelectedGenre(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-jetblue transition-colors appearance-none"
              >
                <option value="">ALL GENRES</option>
                {genres.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            {/* Platform Section */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Stream Platforms</label>
              <div className="flex flex-wrap gap-2 mb-4">
                {platforms.map(plat => (
                  <button
                    key={plat}
                    onClick={() => toggleFilter(selectedPlatforms, plat, setSelectedPlatforms)}
                    className={`px-3 py-1.5 rounded text-[10px] font-black border transition-all ${selectedPlatforms.includes(plat) ? 'bg-jetblue border-jetblue text-white shadow-lg shadow-jetblue/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-jetblue'}`}
                  >
                    {plat}
                  </button>
                ))}
              </div>
              {selectedPlatforms.includes('OTHER') && (
                <input 
                  type="text"
                  placeholder="SPECIFY OTHER PLATFORM..."
                  value={otherPlatform}
                  onChange={(e) => setOtherPlatform(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-jetblue transition-colors animate-in fade-in"
                />
              )}
            </div>

            {/* Creator Section */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Creator</label>
              <select 
                value={selectedCreator}
                onChange={(e) => setSelectedCreator(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-jetblue appearance-none"
              >
                <option value="">SELECT CREATOR</option>
                {creators.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Logo Placement */}
            <div>
              <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Logo Placement</label>
              <select 
                value={selectedPlacement}
                onChange={(e) => setSelectedPlacement(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-xs font-bold text-slate-900 dark:text-white outline-none focus:border-jetblue appearance-none"
              >
                <option value="">ALL PLACEMENTS</option>
                {placements.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

          </div>

          {/* Drawer Footer */}
          <div className="p-8 border-t border-slate-100 dark:border-slate-900 bg-slate-50 dark:bg-slate-950 flex gap-4">
            <button 
              onClick={resetFilters}
              className="flex-1 px-6 py-4 rounded-xl text-xs font-black text-slate-500 hover:text-jetblue dark:text-slate-400 transition-colors uppercase tracking-widest border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
            >
              Clear All
            </button>
            <button 
              onClick={() => setIsFilterOpen(false)}
              className="flex-[2] px-6 py-4 rounded-xl text-xs font-black text-white bg-jetblue hover:bg-jetblue-bright transition-colors uppercase tracking-widest shadow-xl shadow-jetblue/20"
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

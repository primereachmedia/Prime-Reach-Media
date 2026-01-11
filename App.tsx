
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ValueProp from './components/ValueProp.tsx';
import Marketplace from './components/Marketplace.tsx';
import AuthModal from './components/AuthModal.tsx';
import ProfileBuilder from './components/ProfileBuilder.tsx';
import CreatorHub from './components/CreatorHub.tsx';
import HowItWorks from './components/HowItWorks.tsx';

interface Placement {
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
  viewers?: string;
}

interface UserState {
  isLoggedIn: boolean;
  email: string | null;
  role: 'signin' | 'creator' | 'marketer' | null;
  hasProfile: boolean;
  walletAddress: string | null;
  twitterHandle: string | null;
  isTwitterVerified: boolean;
  companyName?: string;
}

const STORAGE_KEY = 'prm_session_v2';
const PLACEMENTS_KEY = 'prm_placements_v1';

const INITIAL_PLACEMENTS: Placement[] = [
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
    totalBuys: 142,
    viewers: "12,500"
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
    totalBuys: 894,
    viewers: "45,000"
  }
];

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'marketplace' | 'profile' | 'creator_hub' | 'how_it_works'>('landing');
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return {
      isLoggedIn: false,
      email: null,
      role: null,
      hasProfile: false,
      walletAddress: null,
      twitterHandle: null,
      isTwitterVerified: false
    };
  });

  const [placements, setPlacements] = useState<Placement[]>(() => {
    const saved = localStorage.getItem(PLACEMENTS_KEY);
    if (saved) return JSON.parse(saved);
    return INITIAL_PLACEMENTS;
  });

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  }, [placements]);

  useEffect(() => {
    if (user.isLoggedIn) {
      if (!user.hasProfile) {
        setView('profile');
      } else {
        if (view === 'landing' || view === 'profile') {
          setView(user.role === 'creator' ? 'creator_hub' : 'marketplace');
        }
      }
    }
  }, [user.isLoggedIn, user.hasProfile]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      const storedState = localStorage.getItem('prm_x_auth_state');
      if (state === storedState) {
        setUser(prev => ({
          ...prev,
          twitterHandle: '@VerifiedUser',
          isTwitterVerified: true,
          isLoggedIn: true
        }));
        localStorage.removeItem('prm_x_auth_state');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const handleAddPlacement = (data: any) => {
    const newPlacement: Placement = {
      id: `p-${Date.now()}`,
      image: data.image || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
      title: data.title,
      date: data.date || "UPCOMING BROADCAST",
      day: "MON", 
      time: "AFTERNOON",
      platforms: data.platforms,
      category: data.genre,
      price: data.price,
      creator: user.companyName || "Verified Creator",
      logoPlacement: data.placement,
      creatorEmail: user.email || "support@primereach.prm",
      twitterHandle: user.twitterHandle || "Unauthorized X",
      isVerified: user.isTwitterVerified,
      totalBuys: 0,
      viewers: data.viewers
    };
    setPlacements(prev => [newPlacement, ...prev]);
  };

  const handleProfileSave = (data: any) => {
    const updatedUser = { 
      ...user, 
      hasProfile: true,
      walletAddress: data.walletAddress,
      twitterHandle: data.twitterHandle,
      isTwitterVerified: data.isTwitterVerified,
      companyName: data.companyName
    };
    setUser(updatedUser);
    setView(user.role === 'creator' ? 'creator_hub' : 'marketplace');
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      email: null,
      role: null,
      hasProfile: false,
      walletAddress: null,
      twitterHandle: null,
      isTwitterVerified: false
    });
    localStorage.removeItem(STORAGE_KEY);
    setView('landing');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-950">
      <Navbar 
        onLogoClick={() => setView('landing')} 
        onAuthClick={(mode) => setAuthModal({ isOpen: true, mode })}
        isLoggedIn={user.isLoggedIn}
        userRole={user.role}
        onProfileClick={() => setView(user.role === 'creator' ? 'creator_hub' : 'marketplace')}
        twitterHandle={user.twitterHandle}
        isVerified={user.isTwitterVerified}
      />
      
      <main className="flex-grow">
        {view === 'profile' ? (
          <ProfileBuilder 
            userRole={user.role || 'marketer'} 
            userEmail={user.email || ''}
            initialWalletAddress={user.walletAddress}
            initialTwitterHandle={user.twitterHandle}
            isTwitterVerified={user.isTwitterVerified}
            onUpdate={(data) => setUser(prev => ({ ...prev, ...data }))}
            onSave={handleProfileSave}
            onLogout={handleLogout}
          />
        ) : view === 'creator_hub' ? (
          <CreatorHub 
            onLogout={handleLogout} 
            userEmail={user.email || ''} 
            onAddPlacement={handleAddPlacement}
            onEditProfile={() => setView('profile')}
          />
        ) : view === 'marketplace' ? (
          <Marketplace 
            placements={placements}
            isLoggedIn={user.isLoggedIn}
            onAuthRequired={() => setAuthModal({ isOpen: true, mode: 'signin' })}
          />
        ) : view === 'how_it_works' ? (
          <HowItWorks onBack={() => setView('landing')} onGetStarted={() => setAuthModal({ isOpen: true, mode: 'signup' })} />
        ) : (
          <>
            <Hero onEnterMarketplace={() => setView('marketplace')} onSeeHowItWorks={() => setView('how_it_works')} />
            <ValueProp />
          </>
        )}
      </main>

      <footer className="bg-white dark:bg-slate-950 py-16 px-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-12">
          <div className="space-y-6 max-w-sm">
             <div className="flex items-center gap-3">
                <div className="px-2 py-0.5 bg-jetblue rounded text-white font-black text-[10px]">PRM</div>
                <span className="text-xl font-black text-jetblue dark:text-white uppercase tracking-tighter">Prime Reach Media</span>
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Automated placement marketplace for the high-efficiency creator economy.
             </p>
          </div>
          <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
             © 2025 PRIME REACH MEDIA LTD.
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        initialMode={authModal.mode}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))} 
        onLoginSuccess={(email, role) => {
          setUser(prev => ({ ...prev, isLoggedIn: true, email, role: role as any, hasProfile: false }));
          setAuthModal(prev => ({ ...prev, isOpen: false }));
        }}
      />
    </div>
  );
};

export default App;

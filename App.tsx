
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
  creatorLogo: string;
  creatorWallet: string;
  logoPlacement: string;
  creatorEmail: string;
  socialAlias: string;
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
  socialAlias: string | null;
  companyName?: string;
  image?: string | null;
}

const SESSION_KEY = 'prm_session_v3';
const ACCOUNTS_KEY = 'prm_accounts_registry_v1';
const PLACEMENTS_KEY = 'prm_placements_production';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'marketplace' | 'profile' | 'creator_hub' | 'how_it_works'>('landing');
  const [user, setUser] = useState<UserState>(() => {
    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) return JSON.parse(saved);
    return {
      isLoggedIn: false,
      email: null,
      role: null,
      hasProfile: false,
      walletAddress: null,
      socialAlias: null,
      image: null
    };
  });

  const [placements, setPlacements] = useState<Placement[]>(() => {
    const saved = localStorage.getItem(PLACEMENTS_KEY);
    if (saved) return JSON.parse(saved);
    return [];
  });

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });

  useEffect(() => {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem(PLACEMENTS_KEY, JSON.stringify(placements));
  }, [placements]);

  useEffect(() => {
    if (user.isLoggedIn) {
      if (!user.hasProfile) {
        setView('profile');
      } else if (view === 'landing' || view === 'profile') {
        setView(user.role === 'creator' ? 'creator_hub' : 'marketplace');
      }
    }
  }, [user.isLoggedIn, user.hasProfile]);

  const handleLoginSuccess = (email: string, role: string) => {
    const registry = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}');
    const existingAccount = registry[email];

    if (existingAccount) {
      setUser({
        isLoggedIn: true,
        email,
        role: existingAccount.role || (role as any),
        hasProfile: true,
        walletAddress: existingAccount.walletAddress,
        socialAlias: existingAccount.socialAlias,
        companyName: existingAccount.companyName,
        image: existingAccount.image
      });
    } else {
      setUser(prev => ({ 
        ...prev, 
        isLoggedIn: true, 
        email, 
        role: role as any, 
        hasProfile: false 
      }));
    }
    setAuthModal(prev => ({ ...prev, isOpen: false }));
  };

  const handleProfileSave = (data: any) => {
    const updatedUser: UserState = { 
      ...user, 
      hasProfile: true,
      walletAddress: data.walletAddress,
      socialAlias: data.socialAlias,
      companyName: data.companyName,
      image: data.image
    };
    setUser(updatedUser);

    const registry = JSON.parse(localStorage.getItem(ACCOUNTS_KEY) || '{}');
    registry[user.email!] = {
      role: user.role,
      walletAddress: data.walletAddress,
      socialAlias: data.socialAlias,
      companyName: data.companyName,
      image: data.image
    };
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(registry));
    setView(user.role === 'creator' ? 'creator_hub' : 'marketplace');
  };

  const handleLogout = () => {
    setUser({
      isLoggedIn: false,
      email: null,
      role: null,
      hasProfile: false,
      walletAddress: null,
      socialAlias: null,
      image: null
    });
    localStorage.removeItem(SESSION_KEY);
    setView('landing');
  };

  const handleAddPlacement = (data: any) => {
    const newPlacement: Placement = {
      id: `p-${Date.now()}`,
      image: data.image || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&q=80&w=800",
      title: data.title,
      date: data.date || "UPCOMING BROADCAST",
      day: "MON", 
      time: data.time || "20:00",
      platforms: data.platforms,
      category: data.genre || "GENERAL",
      price: data.price,
      creator: user.companyName || user.socialAlias || "Verified Creator",
      creatorLogo: user.image || "https://i.postimg.cc/dQTWQ6bj/Untitled-(1080-x-1000-px)-(3).png",
      creatorWallet: user.walletAddress || "ErR6aaQDcaPnx8yi3apPty4T1PeJAmXjuF7ZhTpUjiaw", 
      logoPlacement: data.placement,
      creatorEmail: user.email || "support@primereach.prm",
      socialAlias: user.socialAlias || "",
      isVerified: true, 
      totalBuys: 0,
      viewers: data.viewers || "TBD"
    };
    setPlacements(prev => [newPlacement, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-950">
      <Navbar 
        onLogoClick={() => setView('landing')} 
        onAuthClick={(mode) => setAuthModal({ isOpen: true, mode })}
        isLoggedIn={user.isLoggedIn}
        userRole={user.role}
        onProfileClick={() => setView(user.role === 'creator' ? 'creator_hub' : 'marketplace')}
        socialAlias={user.socialAlias || user.email}
        userImage={user.image}
      />
      
      <main className="flex-grow">
        {view === 'profile' ? (
          <ProfileBuilder 
            userRole={user.role || 'marketer'} 
            userEmail={user.email || ''}
            initialWalletAddress={user.walletAddress}
            initialSocialAlias={user.socialAlias}
            initialCompanyName={user.companyName}
            initialImage={user.image}
            onUpdate={(data) => setUser(prev => ({ ...prev, ...data }))}
            onSave={handleProfileSave}
            onLogout={handleLogout}
          />
        ) : view === 'creator_hub' ? (
          <CreatorHub 
            onLogout={handleLogout} 
            userEmail={user.email || ''} 
            userWallet={user.walletAddress}
            userName={user.companyName}
            userImage={user.image}
            placements={placements}
            onAddPlacement={handleAddPlacement}
            onEditProfile={() => setView('profile')}
            onNavigateMarketplace={() => setView('marketplace')}
          />
        ) : view === 'marketplace' ? (
          <Marketplace 
            placements={placements}
            isLoggedIn={user.isLoggedIn}
            walletAddress={user.walletAddress}
            onWalletConnect={(address) => setUser(prev => ({ ...prev, walletAddress: address }))}
            onAuthRequired={() => setAuthModal({ isOpen: true, mode: 'signin' })}
            onCreateSlot={() => setView(user.role === 'creator' ? 'creator_hub' : 'marketplace')}
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

      <footer className="bg-white dark:bg-slate-950 py-24 px-6 border-t border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="space-y-8 max-w-lg text-center md:text-left">
             <div className="flex flex-col md:flex-row items-center gap-8">
                <img 
                  src="https://i.postimg.cc/dQTWQ6bj/Untitled-(1080-x-1000-px)-(3).png" 
                  alt="PRM Logo" 
                  className="h-48 w-auto object-contain drop-shadow-lg" 
                />
                <div className="flex flex-col">
                  <span className="text-3xl font-black text-jetblue dark:text-white uppercase tracking-tighter italic">Prime Reach Media</span>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.5em] mt-2">Precision Protocol v3.2</p>
                </div>
             </div>
             <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium max-w-sm">
                The production portal for high-efficiency creator monetization. Scale your brand through the automated Solana settlement layer.
             </p>
          </div>
          <div className="text-[12px] font-black text-slate-400 uppercase tracking-widest border-l border-slate-200 dark:border-slate-800 pl-8 h-12 flex items-center">
             © 2025 PRIME REACH MEDIA LTD.
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={authModal.isOpen} 
        initialMode={authModal.mode}
        onClose={() => setAuthModal(prev => ({ ...prev, isOpen: false }))} 
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;

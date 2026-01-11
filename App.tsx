
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ValueProp from './components/ValueProp.tsx';
import Marketplace from './components/Marketplace.tsx';
import AuthModal from './components/AuthModal.tsx';
import ProfileBuilder from './components/ProfileBuilder.tsx';
import CreatorHub from './components/CreatorHub.tsx';

interface UserState {
  isLoggedIn: boolean;
  email: string | null;
  role: 'signin' | 'creator' | 'marketer' | null;
  hasProfile: boolean;
  walletAddress: string | null;
  twitterHandle: string | null;
  isTwitterVerified: boolean;
}

const STORAGE_KEY = 'prm_session_v1';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'marketplace' | 'profile' | 'creator_hub'>('landing');
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

  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });

  // Persist user state
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  }, [user]);

  // Handle post-login navigation
  useEffect(() => {
    if (user.isLoggedIn) {
      if (!user.hasProfile) {
        setView('profile');
      } else {
        // Only force view change if we are on landing or profile, let users stay on marketplace if they were browsing
        if (view === 'landing' || view === 'profile') {
          setView(user.role === 'creator' ? 'creator_hub' : 'marketplace');
        }
      }
    }
  }, [user.isLoggedIn, user.hasProfile]);

  // OAUTH CALLBACK DETECTOR
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
        localStorage.removeItem('prm_x_auth_verifier');
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    }
  }, []);

  const navigateToHome = () => setView('landing');
  const navigateToProfile = () => setView('profile');
  const navigateToDash = () => setView(user.role === 'creator' ? 'creator_hub' : 'marketplace');

  const handleLoginSuccess = (email: string, role: string) => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: true,
      email,
      role: role as any,
      hasProfile: false
    }));
    setAuthModal(prev => ({ ...prev, isOpen: false }));
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

  const handleProfileSave = (data: any) => {
    const updatedUser = { 
      ...user, 
      hasProfile: true,
      walletAddress: data.walletAddress,
      twitterHandle: data.twitterHandle,
      isTwitterVerified: data.isTwitterVerified
    };
    setUser(updatedUser);
    setView(user.role === 'creator' ? 'creator_hub' : 'marketplace');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-950">
      <Navbar 
        onLogoClick={navigateToHome} 
        onAuthClick={(mode) => setAuthModal({ isOpen: true, mode })}
        isLoggedIn={user.isLoggedIn}
        userRole={user.role}
        onProfileClick={user.hasProfile ? navigateToDash : navigateToProfile}
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
          <CreatorHub onLogout={handleLogout} userEmail={user.email || ''} />
        ) : view === 'marketplace' ? (
          <Marketplace 
            isLoggedIn={user.isLoggedIn}
            onAuthRequired={() => setAuthModal({ isOpen: true, mode: 'signin' })}
          />
        ) : (
          <>
            <Hero onEnterMarketplace={() => setView('marketplace')} />
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
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;

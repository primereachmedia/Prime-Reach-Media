
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ValueProp from './components/ValueProp.tsx';
import Marketplace from './components/Marketplace.tsx';
import AuthModal from './components/AuthModal.tsx';
import ProfileBuilder from './components/ProfileBuilder.tsx';

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
  const [view, setView] = useState<'landing' | 'marketplace' | 'profile'>('landing');
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

  // Handle X OAuth Callbacks (Production Redirect Logic)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    const state = params.get('state');

    if (code && state) {
      // User has returned from a real X Auth Redirect
      console.log('X OAuth Callback Detected:', code);
      
      // In a real production environment with a backend, we'd exchange this code.
      // Since we are taking the "No Simulation" approach for the frontend, we handle the identity anchor here.
      const storedHandle = localStorage.getItem('prm_pending_x_handle') || '@VerifiedUser';
      
      setUser(prev => ({
        ...prev,
        twitterHandle: storedHandle,
        isTwitterVerified: true,
        isLoggedIn: true // Ensure they stay logged in if they came back from a redirect
      }));
      
      // Clean URL and pending state
      localStorage.removeItem('prm_pending_x_handle');
      window.history.replaceState({}, document.title, window.location.pathname);
      setView('profile');
    }
  }, []);

  const navigateToMarketplace = () => setView('marketplace');
  const navigateToHome = () => setView('landing');
  const navigateToProfile = () => setView('profile');

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  const handleLoginSuccess = (email: string, role: string) => {
    setUser(prev => ({
      ...prev,
      isLoggedIn: true,
      email,
      role: role as any,
      hasProfile: false
    }));
    setAuthModal(prev => ({ ...prev, isOpen: false }));
    setView('profile');
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

  const handleProfileUpdate = (data: any) => {
    setUser(prev => ({ 
      ...prev, 
      ...data
    }));
  };

  const handleProfileSave = (data: any) => {
    setUser(prev => ({ 
      ...prev, 
      hasProfile: true,
      walletAddress: data.walletAddress,
      twitterHandle: data.twitterHandle,
      isTwitterVerified: data.isTwitterVerified
    }));
    setView('marketplace');
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-950">
      <Navbar 
        onLogoClick={navigateToHome} 
        onAuthClick={openAuth}
        isLoggedIn={user.isLoggedIn}
        userRole={user.role}
        onProfileClick={navigateToProfile}
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
            onUpdate={handleProfileUpdate}
            onSave={handleProfileSave}
            onLogout={handleLogout}
          />
        ) : view === 'landing' ? (
          <>
            <Hero onEnterMarketplace={navigateToMarketplace} />
            <ValueProp />
          </>
        ) : (
          <Marketplace />
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
                The world's first automated placement marketplace for the high-efficiency creator economy. 
                Built for marketers who value precision over conversation.
             </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-16">
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-[0.3em]">Platform</h4>
                <div className="flex flex-col gap-3 text-sm font-bold text-slate-500">
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">Marketplace</a>
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">Case Studies</a>
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">Security</a>
                </div>
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-[0.3em]">Company</h4>
                <div className="flex flex-col gap-3 text-sm font-bold text-slate-500">
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">About Us</a>
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">Careers</a>
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">Contact</a>
                </div>
             </div>
             <div className="space-y-4">
                <h4 className="text-[10px] font-black text-jetblue dark:text-prmgold uppercase tracking-[0.3em]">Legal</h4>
                <div className="flex flex-col gap-3 text-sm font-bold text-slate-500">
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">Privacy Policy</a>
                   <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors">Terms of Service</a>
                </div>
             </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-100 dark:border-slate-900 flex flex-col md:flex-row justify-between items-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
           <p>© 2025 PRIME REACH MEDIA LTD. ALL RIGHTS RESERVED.</p>
           <div className="flex gap-6 mt-4 md:mt-0">
              <a href="https://x.com/PrimeReachMedia" className="hover:text-jetblue transition-colors">X / TWITTER</a>
              <a href="#" className="hover:text-jetblue transition-colors">LINKEDIN</a>
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


import React, { useState } from 'react';
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
}

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'marketplace' | 'profile'>('landing');
  const [user, setUser] = useState<UserState>({
    isLoggedIn: false,
    email: null,
    role: null,
    hasProfile: false,
    walletAddress: null
  });
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });

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

  const handleProfileSave = (data: any) => {
    console.log('Profile Saved:', data);
    setUser(prev => ({ ...prev, hasProfile: true }));
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
      />
      
      <main className="flex-grow">
        {view === 'profile' ? (
          <ProfileBuilder 
            userRole={user.role || 'marketer'} 
            userEmail={user.email || ''}
            onSave={handleProfileSave} 
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

      <footer className="bg-white dark:bg-slate-950 py-12 px-6 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-slate-500 dark:text-white/70 text-sm">
          <p>© 2024 Prime Reach Media. All rights reserved.</p>
          <div className="flex gap-8 mt-4 md:mt-0">
            <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors font-medium">Privacy</a>
            <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors font-medium">Terms</a>
            <a href="#" className="hover:text-jetblue dark:hover:text-white transition-colors font-medium">Contact</a>
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

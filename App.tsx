
import React, { useState } from 'react';
import Navbar from './components/Navbar.tsx';
import Hero from './components/Hero.tsx';
import ValueProp from './components/ValueProp.tsx';
import Marketplace from './components/Marketplace.tsx';
import AuthModal from './components/AuthModal.tsx';

const App: React.FC = () => {
  const [view, setView] = useState<'landing' | 'marketplace'>('landing');
  const [authModal, setAuthModal] = useState<{ isOpen: boolean; mode: 'signin' | 'signup' }>({
    isOpen: false,
    mode: 'signin',
  });

  const navigateToMarketplace = () => setView('marketplace');
  const navigateToHome = () => setView('landing');

  const openAuth = (mode: 'signin' | 'signup') => {
    setAuthModal({ isOpen: true, mode });
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-900 dark:text-slate-100 transition-colors bg-slate-50 dark:bg-slate-950">
      <Navbar 
        onLogoClick={navigateToHome} 
        onAuthClick={openAuth}
      />
      
      <main className="flex-grow">
        {view === 'landing' ? (
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
      />
    </div>
  );
};

export default App;

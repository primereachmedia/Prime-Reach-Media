
import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onLogoClick: () => void;
  onAuthClick: (mode: 'signin' | 'signup') => void;
  isLoggedIn?: boolean;
  userRole?: string | null;
  onProfileClick?: () => void;
  socialAlias?: string | null;
}

const Navbar: React.FC<NavbarProps> = ({ onLogoClick, onAuthClick, isLoggedIn, userRole, onProfileClick, socialAlias }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  return (
    <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-6 h-36 flex items-center justify-between">
        <div 
          className="flex items-center gap-4 cursor-pointer group"
          onClick={onLogoClick}
        >
          <img 
            src="https://i.postimg.cc/dQTWQ6bj/Untitled-(1080-x-1000-px)-(3).png" 
            alt="Prime Reach Media Logo" 
            className="h-32 w-auto object-contain transition-transform group-hover:scale-110 filter drop-shadow-md" 
          />
          <div className="flex flex-col">
            <span className="text-2xl font-black text-jetblue dark:text-white tracking-tighter leading-none uppercase italic">Prime Reach Media</span>
            <div className="flex items-center gap-2 mt-1">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
               <span className="text-[8px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.4em]">Solana Mainnet Active</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsDark(!isDark)}
            className="p-2 text-slate-500 hover:text-jetblue dark:text-slate-400 dark:hover:text-white transition-colors"
            aria-label="Toggle Dark Mode"
          >
            {isDark ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>

          <a 
            href="https://x.com/PrimeReachMedia" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-slate-900 dark:text-white hover:text-jetblue transition-colors px-2"
            aria-label="Follow us on X"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {isLoggedIn ? (
            <button 
              onClick={onProfileClick}
              className="flex items-center gap-3 bg-white dark:bg-slate-900 border-2 border-jetblue text-jetblue dark:text-white px-6 py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all shadow-xl"
            >
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              {socialAlias ? (
                <span className="flex items-center gap-2">
                   {socialAlias}
                </span>
              ) : 'Protocol Portal'}
              <span className="text-[10px] bg-jetblue text-white px-2 py-0.5 rounded ml-1 opacity-70">{userRole}</span>
            </button>
          ) : (
            <button 
              onClick={() => onAuthClick('signin')}
              className="bg-jetblue text-white px-8 py-3.5 rounded-2xl font-black text-xs uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/20 border border-jetblue/10"
            >
              Secure Portal Access
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

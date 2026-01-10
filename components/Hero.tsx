
import React from 'react';

interface HeroProps {
  onEnterMarketplace: () => void;
}

const Hero: React.FC<HeroProps> = ({ onEnterMarketplace }) => {
  return (
    <section className="relative overflow-hidden bg-white dark:bg-slate-950 pt-20 pb-24 md:pt-32 md:pb-40 transition-colors">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-jetblue/5 dark:bg-jetblue/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[30%] h-[30%] bg-jetblue-light/5 dark:bg-jetblue-light/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-jetblue/10 dark:bg-jetblue/20 text-jetblue dark:text-jetblue-light font-semibold text-sm mb-8">
          For Forward-Thinking Marketing Teams
        </span>
        
        <h1 className="text-6xl md:text-8xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-[0.95] mb-8">
          Easy marketing. <br />
          <span className="text-jetblue dark:text-jetblue-light">No conversations.</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-3xl mx-auto">
          The first automated marketplace where marketers buy precision creator placements in seconds. Stop negotiating and start scaling.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <button 
            onClick={onEnterMarketplace}
            className="w-full sm:w-auto bg-jetblue text-white px-10 py-5 rounded-2xl font-bold text-xl hover:bg-jetblue-bright transition-all shadow-2xl shadow-jetblue/30 transform hover:-translate-y-1"
          >
            Enter Marketplace
          </button>
          <button className="w-full sm:w-auto bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-100 dark:border-slate-800 px-10 py-5 rounded-2xl font-bold text-xl hover:border-jetblue/20 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
};

export default Hero;

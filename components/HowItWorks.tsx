
import React from 'react';

interface HowItWorksProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onGetStarted }) => {
  return (
    <div className="min-h-screen bg-jetblue text-white selection:bg-prmgold selection:text-jetblue animate-in fade-in duration-1000">
      
      {/* Centered Briefing Header */}
      <header className="relative pt-10 pb-20 px-6 border-b border-white/5 overflow-hidden">
        {/* Subtle Background Grid */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="h-full w-full bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[length:40px_40px]"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          {/* Top Navigation & Status */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-16">
            <button 
              onClick={onBack}
              className="group flex items-center gap-4 text-white/40 hover:text-prmgold transition-all order-2 md:order-1"
            >
              <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-prmgold/50 group-hover:bg-prmgold/5">
                <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-[12px] font-black uppercase tracking-[0.4em] italic">Return Home</span>
            </button>

            <div className="flex items-center gap-8 px-10 py-6 bg-white/5 rounded-[2.5rem] border border-white/10 backdrop-blur-xl order-1 md:order-2 shadow-2xl">
              <div className="flex items-center gap-8">
                <img 
                  src="https://i.postimg.cc/dQTWQ6bj/Untitled-(1080-x-1000-px)-(3).png" 
                  alt="PRM Logo" 
                  className="h-32 w-auto object-contain" 
                />
                <div className="flex flex-col">
                  <span className="text-[10px] font-black uppercase tracking-[0.4em] text-white/70">Protocol Unit</span>
                  <span className="text-sm font-black text-white italic">PRM Marketplace V3</span>
                </div>
              </div>
              <div className="w-px h-14 bg-white/10"></div>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black uppercase tracking-widest text-prmgold">Mainnet Operational</span>
                <div className="w-2 h-2 bg-prmgold rounded-full animate-pulse mt-1"></div>
              </div>
            </div>
          </div>

          {/* Centered Main Content */}
          <div className="max-w-3xl mx-auto text-center space-y-7 px-4">
            <div className="inline-flex items-center gap-4 px-4 py-1.5 bg-prmgold/10 rounded-full border border-prmgold/30">
              <span className="text-prmgold font-black text-[10px] tracking-[0.6em] uppercase italic">System Briefing</span>
            </div>
            
            <h1 className="text-5xl md:text-[5.5rem] font-black uppercase italic tracking-tight leading-[1.1] md:leading-[1.0] px-6">
              ZERO <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-prmgold to-white pr-4">FRICTION</span> <br />
              MARKETING
            </h1>
            
            <p className="text-base md:text-lg font-medium text-white/50 leading-relaxed max-w-xl mx-auto">
              Skip the long DM threads and endless negotiations. Prime Reach Media is the first marketplace for booking precision creator placements in seconds.
            </p>

            <div className="pt-6 flex flex-col items-center gap-4">
               <div className="text-[9px] font-black text-white/20 uppercase tracking-[0.5em] animate-bounce">Scroll to Explore</div>
               <div className="h-10 w-px bg-gradient-to-b from-prmgold/50 to-transparent"></div>
            </div>
          </div>
        </div>
      </header>

      {/* The 3-Step Journey */}
      <section className="py-20 px-6 bg-slate-950 relative border-b border-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20 space-y-4">
             <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter">THE MARKETPLACE PROCESS</h2>
             <p className="text-white/30 font-bold text-[10px] tracking-[0.5em] uppercase">How to scale your brand in three steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "EXPLORE THE FEED", 
                desc: "Browse our curated feed of verified creators. Filter by niche, audience size, and broadcast timing to find the perfect match for your campaign goals.",
              },
              { 
                step: "02", 
                title: "RESERVE YOUR WINDOW", 
                desc: "Every creator lists specific 'Open Slots'. Select the date and time that works for you. No negotiations—the price you see is the price you pay.",
              },
              { 
                step: "03", 
                title: "UPLOAD & GO LIVE", 
                desc: "Provide your brand assets and choose your preferred placement corner. Once booked, the creator is notified to feature your logo during the stream.",
              }
            ].map((item, idx) => (
              <div key={idx} className="relative group flex flex-col h-full">
                <div className="p-8 md:p-10 bg-jetblue/40 rounded-[2.5rem] border border-white/5 hover:border-prmgold/40 hover:bg-jetblue/60 transition-all duration-500 flex flex-col items-center text-center gap-5 shadow-xl flex-grow">
                   <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center font-black text-lg italic text-prmgold border border-prmgold/20 group-hover:scale-110 transition-transform mx-auto">
                     {item.step}
                   </div>
                   <div className="space-y-3">
                      <h3 className="text-xl font-black uppercase italic tracking-tighter text-white group-hover:text-prmgold transition-colors">{item.title}</h3>
                      <p className="text-xs text-white/40 leading-relaxed font-medium">{item.desc}</p>
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Action CTA */}
      <section className="py-24 px-6 text-center bg-white text-jetblue">
        <div className="max-w-4xl mx-auto space-y-10">
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter leading-none">START NOW</h2>
            <p className="text-base text-jetblue/60 font-medium max-w-xl mx-auto italic uppercase tracking-tighter">Access the marketplace to book your first precision placement.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
             <button 
              onClick={onGetStarted}
              className="px-12 py-7 bg-jetblue text-white rounded-[2.5rem] font-black text-xl uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/30 transform hover:-translate-y-1"
            >
              Enter Portal
            </button>
            <button 
              onClick={onBack}
              className="px-10 py-7 bg-white border-2 border-jetblue/10 text-jetblue rounded-[2.5rem] font-black text-xl uppercase tracking-[0.2em] hover:bg-slate-50 transition-all italic"
            >
              Back to Home
            </button>
          </div>
        </div>
      </section>

      {/* Simplified Footer */}
      <footer className="py-16 border-t border-white/5 bg-jetblue text-center">
        <div className="max-w-7xl mx-auto px-6 space-y-10">
           <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-60">
              <div className="text-left">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mb-2">Build Version</p>
                <p className="text-transparent bg-clip-text bg-gradient-to-r from-prmgold to-white font-mono italic">PRM_3.2.1</p>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mb-2">Verification</p>
                <p className="text-[10px] font-mono text-white italic">X_AUTH_SECURE</p>
              </div>
              <div className="text-left">
                <p className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em] mb-2">Global Support</p>
                <p className="text-[10px] font-mono text-white italic">24/7 HELPDESK</p>
              </div>
           </div>
           
           <div className="h-px w-20 bg-white/10 mx-auto"></div>
           
           <p className="text-[12px] font-black text-white/20 uppercase tracking-[0.8em] italic">Prime Reach Media // Precision Marketplace</p>
        </div>
      </footer>

    </div>
  );
};

export default HowItWorks;

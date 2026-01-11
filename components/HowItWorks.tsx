
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
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-prmgold/50 group-hover:bg-prmgold/5">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] italic">Back to Home</span>
            </button>

            <div className="flex items-center gap-5 px-6 py-3 bg-white/5 rounded-xl border border-white/10 backdrop-blur-xl order-1 md:order-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/70">PRM Marketplace V3</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-prmgold">Status: Operational</span>
            </div>
          </div>

          {/* Centered Main Content */}
          <div className="max-w-3xl mx-auto text-center space-y-7 px-4">
            <div className="inline-flex items-center gap-4 px-4 py-1.5 bg-prmgold/10 rounded-full border border-prmgold/30">
              <span className="text-prmgold font-black text-[10px] tracking-[0.6em] uppercase italic">System Briefing</span>
            </div>
            
            {/* Reduced size by approx 2% from previous version to prevent clipping and fit better */}
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

      {/* Precision Placement Visual */}
      <section className="py-28 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative text-center lg:text-left">
              <div className="absolute -top-24 -left-24 w-64 h-64 bg-prmgold/10 blur-[120px] rounded-full pointer-events-none"></div>
              <h2 className="text-4xl md:text-5xl font-black uppercase italic tracking-tighter leading-[0.9]">
                GUARANTEED <br />
                <span className="text-prmgold">PLACEMENT</span>
              </h2>
              <p className="text-base text-white/50 leading-relaxed max-w-lg mx-auto lg:mx-0">
                You never have to guess where your ad will be. Our <strong>Anchor Point</strong> system ensures your logo is placed exactly where you requested—locked to the screen coordinates you chose during booking.
              </p>
              
              <ul className="space-y-4">
                {[
                  { label: "LOGO ANCHOR", value: "Fixed screen positions (e.g. Top Right)" },
                  { label: "BROADCAST SYNC", value: "Ads live for the full duration of your slot" },
                  { label: "CREATOR DIRECT", value: "Direct integration into the stream feed" }
                ].map((stat, i) => (
                  <li key={i} className="flex items-center gap-5 p-4 bg-white/5 rounded-2xl border border-white/10 group hover:border-prmgold/30 transition-all">
                    <div className="w-2.5 h-2.5 rounded-full bg-prmgold shadow-[0_0_10px_rgba(212,175,55,0.5)]"></div>
                    <div className="text-left">
                      <p className="text-[9px] font-black text-prmgold uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-xs font-bold uppercase">{stat.value}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="relative group">
               <div className="absolute -inset-1 bg-gradient-to-r from-prmgold to-jetblue rounded-[3rem] blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
               <div className="relative aspect-video bg-black/80 rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden">
                  {/* Simulated Stream Feed */}
                  <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-20 transition-all duration-1000" alt="Stream Preview" />
                  
                  {/* Visual Protocol Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                     <div className="w-full h-full p-8 md:p-10 relative">
                        {/* Anchor Tooltip */}
                        <div className="absolute top-8 right-8 p-5 bg-white text-jetblue rounded-xl shadow-2xl transform rotate-3 animate-float border-2 border-prmgold">
                           <div className="flex flex-col items-center gap-2">
                             <div className="w-14 h-9 bg-jetblue/5 border-2 border-dashed border-jetblue/30 rounded-lg flex items-center justify-center font-black text-[9px] uppercase">Your Logo</div>
                             <p className="text-[7px] font-black italic tracking-tighter uppercase opacity-60">Top Right Anchor</p>
                           </div>
                        </div>

                        {/* Visual Guide */}
                        <div className="absolute bottom-8 left-8 font-mono text-[7px] text-prmgold space-y-1 bg-black/60 p-4 rounded-xl border border-white/10">
                           <p>BROADCAST: LIVE</p>
                           <p>AD_SLOT: 14:00 - 16:00 EST</p>
                           <p>VERIFICATION: PASS</p>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
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
              className="px-10 py-6 bg-jetblue text-white rounded-[2rem] font-black text-lg uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-xl shadow-jetblue/30 transform hover:-translate-y-1"
            >
              Get Started
            </button>
            <button 
              onClick={onBack}
              className="px-8 py-6 bg-white border-2 border-jetblue/10 text-jetblue rounded-[2rem] font-black text-lg uppercase tracking-[0.2em] hover:bg-slate-50 transition-all italic"
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
                <p className="text-[10px] font-mono text-prmgold italic">PRM_3.2.1</p>
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
           
           <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.8em] italic">Prime Reach Media // Precision Marketplace</p>
        </div>
      </footer>

    </div>
  );
};

export default HowItWorks;

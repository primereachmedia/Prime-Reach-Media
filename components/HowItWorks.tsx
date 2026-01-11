
import React from 'react';

interface HowItWorksProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onGetStarted }) => {
  return (
    <div className="min-h-screen bg-jetblue text-white selection:bg-prmgold selection:text-jetblue animate-in fade-in duration-700">
      
      {/* Cinematic Protocol Header */}
      <header className="relative pt-16 pb-24 px-6 border-b border-white/5 overflow-hidden">
        {/* Animated Background Scanline */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="h-full w-full bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_2px,3px_100%]"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-20">
            <button 
              onClick={onBack}
              className="group flex items-center gap-4 text-white/40 hover:text-white transition-all"
            >
              <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-prmgold/50">
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path d="M15 19l-7-7 7-7" />
                </svg>
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.5em]">Abort Briefing</span>
            </button>

            <div className="flex items-center gap-6 px-6 py-3 bg-white/5 rounded-full border border-white/10 backdrop-blur-md">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-[9px] font-black uppercase tracking-widest text-white/60">Protocol: Live</span>
              </div>
              <div className="w-px h-4 bg-white/10"></div>
              <span className="text-[9px] font-black uppercase tracking-widest text-prmgold">EST SYNC: 100%</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-end">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-prmgold/10 rounded-lg border border-prmgold/20">
                <span className="text-prmgold font-black text-[10px] tracking-[0.6em] uppercase">The Automation Directive</span>
              </div>
              <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter leading-[0.85]">
                THE AUTOMATED <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">PLACEMENT</span> <br />
                PROTOCOL
              </h1>
              <p className="max-w-xl text-lg font-medium text-white/50 leading-relaxed">
                We've eliminated the human bottleneck. Prime Reach Media operates on a deterministic settlement layer—removing DMs, negotiation friction, and payment delays.
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="bg-black/40 border border-white/10 p-8 rounded-3xl backdrop-blur-xl font-mono text-[10px] text-prmgold/60 space-y-2">
                <p>> Initializing PRM_MONETIZATION_ENGINE...</p>
                <p>> Scanning creator reach parameters...</p>
                <p className="text-green-500">> [SUCCESS] 2,400+ Active Slots Detected</p>
                <p>> Fetching normalized EST temporal data...</p>
                <p>> Status: Awaiting Deployment.</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Zero-DM Pipeline Section */}
      <section className="py-32 px-6 bg-slate-950 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32 space-y-4">
            <h2 className="text-4xl font-black uppercase italic tracking-tighter">THE ZERO-FRICTION PIPELINE</h2>
            <p className="text-white/30 font-black text-[10px] tracking-[0.5em] uppercase">Human Error Eliminated // Machine Efficiency Enabled</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                step: "01", 
                title: "ALGORITHMIC DISCOVERY", 
                desc: "Marketers filter by CCV, niche, and temporal window. No browsing profiles for hours. The protocol serves matches based on raw reach data.",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" strokeWidth={2}/></svg>
              },
              { 
                step: "02", 
                title: "DETERMINISTIC RESERVATION", 
                desc: "One click locks the slot. The Visual Anchor point is pre-selected and immutable. No back-and-forth about ad placement height or duration.",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" strokeWidth={2}/></svg>
              },
              { 
                step: "03", 
                title: "ATOMIC SETTLEMENT", 
                desc: "The protocol automatically triggers USDC release upon broadcast verification. Payments happen in real-time, not Net-30.",
                icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M13 10V3L4 14h7v7l9-11h-7z" strokeWidth={2}/></svg>
              }
            ].map((item, idx) => (
              <div key={idx} className="group p-12 bg-white/5 rounded-[3rem] border border-white/10 hover:border-prmgold/30 hover:bg-white/[0.08] transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 text-prmgold/10 font-black text-6xl group-hover:text-prmgold/20 transition-colors italic">{item.step}</div>
                <div className="w-16 h-16 bg-jetblue rounded-2xl flex items-center justify-center text-prmgold mb-10 shadow-2xl border border-white/5">
                  {item.icon}
                </div>
                <h3 className="text-xl font-black uppercase italic tracking-tighter mb-4">{item.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed font-medium">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Visual Anchor Simulation */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-5xl font-black uppercase italic tracking-tighter">PHASE 01: <br /> THE VISUAL ANCHOR</h2>
              <p className="text-lg text-white/50 leading-relaxed">
                Ads used to be a guessing game. On PRM, every slot includes a mandatory <strong>Visual Anchor Point</strong>. 
                Creators define the coordinates, and the protocol validates the placement during the broadcast. 
                This ensures your brand lives exactly where you intended—zero negotiation required.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-prmgold font-black text-[10px] uppercase mb-4 tracking-widest">Pixel Perfect</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Anchors are pre-rendered in the marketer dashboard before checkout.</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-prmgold font-black text-[10px] uppercase mb-4 tracking-widest">AI Validation</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Our protocol scans the live broadcast to verify ad presence.</p>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video bg-black rounded-[4rem] border-8 border-white/5 shadow-3xl overflow-hidden group">
               {/* Simulated Stream Feed */}
               <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-30 grayscale blur-[2px] group-hover:blur-0 group-hover:opacity-60 transition-all duration-1000" />
               
               {/* The Anchor Component */}
               <div className="absolute top-12 right-12 p-8 bg-white text-jetblue rounded-2xl shadow-2xl animate-pulse">
                  <div className="flex flex-col items-center gap-3">
                    <div className="text-[10px] font-black uppercase tracking-widest opacity-50">Protocol Anchor</div>
                    <div className="w-20 h-12 bg-jetblue/10 border-2 border-dashed border-jetblue/40 rounded flex items-center justify-center font-black text-xs">YOUR LOGO</div>
                    <div className="text-[9px] font-bold text-jetblue/60 italic">STATION: TOP_RIGHT</div>
                  </div>
               </div>

               {/* Grid Overlay */}
               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')] opacity-20 pointer-events-none"></div>
               
               {/* Scanlines Overlay */}
               <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-transparent via-white/5 to-transparent h-[10%] animate-float"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Automated Security Section */}
      <section className="py-32 px-6 bg-white text-jetblue">
        <div className="max-w-5xl mx-auto text-center space-y-16">
          <div className="space-y-6">
            <h2 className="text-6xl font-black uppercase italic tracking-tighter">THE SETTLEMENT LAYER</h2>
            <p className="text-jetblue/60 font-medium text-xl max-w-2xl mx-auto">We don't do "Invoices" or "Net-30". We do sub-second atomic settlement.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="p-12 bg-jetblue/5 rounded-[3rem] space-y-6">
              <h4 className="font-black text-2xl uppercase tracking-tighter">SOLANA INFRASTRUCTURE</h4>
              <p className="text-sm text-jetblue/70 leading-relaxed font-medium">
                The protocol utilizes the Solana blockchain to automate transactions. This ensures sub-second confirmation times and eliminates the 3-5% transaction fees of legacy payment processors.
              </p>
            </div>
            <div className="p-12 bg-jetblue/5 rounded-[3rem] space-y-6">
              <h4 className="font-black text-2xl uppercase tracking-tighter">SMART CONTRACT ESCROW</h4>
              <p className="text-sm text-jetblue/70 leading-relaxed font-medium">
                Funds are held in an atomic escrow contract. Payouts are triggered instantly once the broadcast window closes and verification is complete.
              </p>
            </div>
          </div>

          <button 
            onClick={onGetStarted}
            className="w-full py-10 bg-jetblue text-white rounded-[2.5rem] font-black text-3xl uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-3xl transform hover:-translate-y-2 hover:shadow-jetblue/40"
          >
            EXECUTE DEPLOYMENT
          </button>
        </div>
      </section>

      {/* Technical Footer */}
      <footer className="py-20 border-t border-white/5 text-center space-y-4">
        <div className="flex justify-center gap-12 mb-8">
           <div className="text-left">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Engine Version</p>
              <p className="text-[10px] font-mono text-prmgold">v3.0.0_STABLE</p>
           </div>
           <div className="text-left">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Network Status</p>
              <p className="text-[10px] font-mono text-green-500 italic uppercase">Optimized</p>
           </div>
           <div className="text-left">
              <p className="text-[8px] font-black text-white/20 uppercase tracking-widest mb-1">Encrypted By</p>
              <p className="text-[10px] font-mono text-white/40">PRM_SHIELD_V2</p>
           </div>
        </div>
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[1em]">PRIME REACH MEDIA PROTOCOL</p>
      </footer>

    </div>
  );
};

export default HowItWorks;

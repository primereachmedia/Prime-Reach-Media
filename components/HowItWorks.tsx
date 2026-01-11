
import React from 'react';

interface HowItWorksProps {
  onBack: () => void;
  onGetStarted: () => void;
}

const HowItWorks: React.FC<HowItWorksProps> = ({ onBack, onGetStarted }) => {
  return (
    <div className="min-h-screen bg-jetblue text-white animate-in fade-in duration-700">
      
      {/* Top Briefing Header */}
      <header className="pt-16 pb-20 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <button 
            onClick={onBack}
            className="group flex items-center gap-3 text-white/50 hover:text-white transition-colors mb-12"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-[10px] font-black uppercase tracking-[0.5em]">Abort Briefing / Return</span>
          </button>

          <div className="space-y-4">
            <span className="text-prmgold font-black text-[10px] tracking-[0.6em] uppercase block">Protocol Briefing</span>
            <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter leading-tight pr-4">
              THE AUTOMATED <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">PLACEMENT</span> <br />
              PROTOCOL
            </h1>
            <p className="max-w-2xl text-lg font-medium text-white/60 leading-relaxed">
              Prime Reach Media replaces human error and negotiation friction with a decentralized, deterministic placement marketplace. 
              No DMs. No back-and-forth. Just reach.
            </p>
          </div>
        </div>
      </header>

      {/* The Core Logic Section */}
      <section className="py-32 px-6 bg-slate-950">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div className="space-y-12">
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">PHASE 01: <br /> THE VISUAL ANCHOR</h2>
              <p className="text-lg text-white/60 leading-relaxed">
                We've solved the "Where is my ad?" problem. Every slot listed on PRM includes a mandatory <strong>Visual Anchor Point</strong>. 
                Creators select exactly where your brand will live on their stream—top right, bottom center, etc.—so you can plan your creative assets with pixel-perfect accuracy.
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-prmgold font-black text-xs uppercase mb-4 tracking-widest">Deterministic</h4>
                  <p className="text-xs text-white/40 leading-relaxed">Know your placement before you buy. No surprises on stream day.</p>
                </div>
                <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                  <h4 className="text-prmgold font-black text-xs uppercase mb-4 tracking-widest">Pre-Validated</h4>
                  <p className="text-xs text-white/40 leading-relaxed">AI and Community verification ensure anchors are honored.</p>
                </div>
              </div>
            </div>
            
            <div className="relative aspect-video bg-jetblue rounded-[3rem] border border-white/20 shadow-3xl overflow-hidden group">
               <img src="https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-80 transition-all duration-1000" />
               <div className="absolute top-8 right-8 p-6 bg-white text-jetblue rounded-2xl font-black text-xs uppercase shadow-2xl animate-pulse">
                 Sponsor Anchor Point
               </div>
               <div className="absolute inset-0 border-[40px] border-white/5 pointer-events-none"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Path Visualization */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-32">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter mb-4">TWO PATHS. ONE DESTINATION.</h2>
            <p className="text-white/40 font-black text-[10px] tracking-[0.5em] uppercase italic">Select your operational protocol</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            
            {/* Marketer Side */}
            <div className="bg-white/5 p-16 rounded-[4rem] border border-white/10 space-y-12 hover:bg-white/[0.07] transition-all">
              <div className="w-20 h-20 bg-white text-jetblue rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl">M</div>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">FOR MARKETERS</h3>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Targeting Stack', desc: 'Filter by CCV, niche, distribution platform, and specific broadcast windows.' },
                  { step: '02', title: 'Visual Inspection', desc: 'Preview the stream frame and confirm the Visual Anchor meets your brand standards.' },
                  { step: '03', title: 'Atomic Lock-in', desc: 'Reserve the slot instantly. Settlement happens via USDC on the Solana blockchain for zero-fee efficiency.' }
                ].map(s => (
                  <div key={s.step} className="flex gap-6">
                    <span className="text-prmgold font-black text-sm">{s.step}</span>
                    <div>
                      <h4 className="font-black text-lg uppercase tracking-tight mb-2">{s.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Creator Side */}
            <div className="bg-prmgold/5 p-16 rounded-[4rem] border border-prmgold/20 space-y-12 hover:bg-prmgold/[0.07] transition-all">
              <div className="w-20 h-20 bg-prmgold text-white rounded-3xl flex items-center justify-center font-black text-2xl shadow-2xl">C</div>
              <h3 className="text-4xl font-black uppercase italic tracking-tighter">FOR CREATORS</h3>
              <div className="space-y-8">
                {[
                  { step: '01', title: 'Identity Anchoring', desc: 'Connect your X profile and Phantom wallet to verify reach and enable payouts.' },
                  { step: '02', title: 'Slot Deployment', desc: 'Upload a broadcast frame, set your CCV expectations, and choose your Anchor Point.' },
                  { step: '03', title: 'Instant Yield', desc: 'Your listed slots hit the global marketplace. Receive automated USDC payouts as brands lock in your reach.' }
                ].map(s => (
                  <div key={s.step} className="flex gap-6">
                    <span className="text-white/40 font-black text-sm">{s.step}</span>
                    <div>
                      <h4 className="font-black text-lg uppercase tracking-tight mb-2">{s.title}</h4>
                      <p className="text-white/50 text-sm leading-relaxed">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Security Deep Dive */}
      <section className="py-32 px-6 bg-white text-jetblue">
        <div className="max-w-4xl mx-auto text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-5xl font-black uppercase italic tracking-tighter">THE SECURITY LAYER</h2>
            <p className="text-jetblue/60 font-medium text-lg">We don't do "Invoices" or "Net-30". We do real-time.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 text-left">
            <div className="space-y-4">
              <h4 className="font-black text-xl uppercase tracking-tighter">SOLANA SETTLEMENT</h4>
              <p className="text-sm text-jetblue/70 leading-relaxed">
                All transactions are routed through the Solana network. This ensures sub-second confirmation times and transaction fees that are fractions of a cent.
              </p>
            </div>
            <div className="space-y-4">
              <h4 className="font-black text-xl uppercase tracking-tighter">USDC STANDARD</h4>
              <p className="text-sm text-jetblue/70 leading-relaxed">
                We utilize Circle's USDC for all payouts. This provides the stability of the US Dollar with the speed and transparency of blockchain technology.
              </p>
            </div>
          </div>

          <button 
            onClick={onGetStarted}
            className="w-full py-10 bg-jetblue text-white rounded-[2.5rem] font-black text-2xl uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-3xl transform hover:-translate-y-2"
          >
            EXECUTE ONBOARDING
          </button>
        </div>
      </section>

      {/* Final Tech Footer */}
      <footer className="py-12 border-t border-white/5 text-center text-[10px] font-black text-white/20 uppercase tracking-[0.8em]">
        PRIME REACH MEDIA PROTOCOL // AUTH_TOKEN_REQUIRED
      </footer>

    </div>
  );
};

export default HowItWorks;

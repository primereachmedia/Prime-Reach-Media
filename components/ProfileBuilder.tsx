
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";

interface ProfileBuilderProps {
  userRole: string;
  userEmail: string;
  initialWalletAddress?: string | null;
  initialTwitterHandle?: string | null;
  isTwitterVerified: boolean;
  onUpdate: (data: any) => void;
  onSave: (data: any) => void;
  onLogout: () => void;
}

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, userEmail, initialWalletAddress, initialTwitterHandle, isTwitterVerified, onUpdate, onSave, onLogout }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    audienceDescription: '',
    image: null as string | null,
    walletAddress: initialWalletAddress || null as string | null,
    twitterHandle: initialTwitterHandle || '' as string,
    isTwitterVerified: isTwitterVerified,
    selectedPlatforms: [] as string[],
    otherPlatformDetail: ''
  });

  // Verification Logic States
  const [verificationStage, setVerificationStage] = useState<'idle' | 'handshake' | 'audit' | 'scanning' | 'success'>('idle');
  const [verificationToken, setVerificationToken] = useState('');
  const [evidenceImage, setEvidenceImage] = useState<string | null>(null);
  const [scanLogs, setScanLogs] = useState<string[]>([]);
  const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);

  const platforms = ['YOUTUBE', 'X', 'TIKTOK', 'KICK', 'TWITCH', 'INSTAGRAM', 'PUMPFUN', 'ZORA', 'DISCORD', 'OTHER'];

  useEffect(() => {
    if (isTwitterVerified) setVerificationStage('success');
  }, [isTwitterVerified]);

  const togglePlatform = (platform: string) => {
    setFormData(prev => {
      const isSelected = prev.selectedPlatforms.includes(platform);
      const newPlatforms = isSelected ? prev.selectedPlatforms.filter(p => p !== platform) : [...prev.selectedPlatforms, platform];
      return { ...prev, selectedPlatforms: newPlatforms };
    });
  };

  const generateSecureHandshake = () => {
    if (!formData.twitterHandle || !formData.walletAddress) {
      alert("WALLET LINK REQUIRED: Identity binding requires an active Phantom session.");
      return;
    }
    const handle = formData.twitterHandle.replace('@', '').toUpperCase();
    const walletTail = formData.walletAddress.slice(-4).toUpperCase();
    const token = `PRM-${handle}-${walletTail}-${Math.floor(1000 + Math.random() * 9000)}`;
    setVerificationToken(token);
    setVerificationStage('handshake');
  };

  const openXToPost = () => {
    const text = encodeURIComponent(`Verified Creator Identity on @PrimeReachMedia\n\nTOKEN: ${verificationToken}\nWALLET_REF: ${formData.walletAddress?.slice(0, 8)}...\n\n#PRM #CreatorEconomy`);
    window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank');
  };

  const handleEvidenceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEvidenceImage(reader.result as string);
        setVerificationStage('audit');
      };
      reader.readAsDataURL(file);
    }
  };

  const runAiForensicAudit = async () => {
    if (!evidenceImage) return;

    setVerificationStage('scanning');
    setIsAiAnalyzing(true);
    setScanLogs(["INITIALIZING AI FORENSIC AGENT...", "ESTABLISHING NEURAL LINK..."]);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = evidenceImage.split(',')[1];
      
      const prompt = `Perform a strict identity audit. 
      1. Extract the X (Twitter) handle from the screenshot.
      2. Extract the PRM token (format: PRM-HANDLE-WALLET-CODE).
      3. Compare the handle found in the image with the expected handle: ${formData.twitterHandle}.
      4. Compare the token found in the image with the expected token: ${verificationToken}.
      5. Is this a real live tweet or a mock-up?
      Respond ONLY with a JSON object: {"handleMatches": boolean, "tokenMatches": boolean, "isRealPost": boolean, "extractedHandle": "string", "reasoning": "string"}`;

      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: [
          { inlineData: { mimeType: 'image/png', data: base64Data } },
          { text: prompt }
        ]
      });

      const auditResult = JSON.parse(response.text || '{}');
      
      const logSequence = [
        `SCANNING HANDLE: Found ${auditResult.extractedHandle}`,
        `CROSS-REFERENCING TOKEN: ${auditResult.tokenMatches ? 'MATCH CONFIRMED' : 'FAIL'}`,
        `ANALYZING UI AUTHENTICITY: ${auditResult.isRealPost ? 'VALIDATED' : 'SPOOF DETECTED'}`,
        auditResult.handleMatches && auditResult.tokenMatches && auditResult.isRealPost 
          ? "IDENTITY ANCHOR SUCCESSFUL" 
          : `AUDIT FAILED: ${auditResult.reasoning}`
      ];

      for (let i = 0; i < logSequence.length; i++) {
        await new Promise(r => setTimeout(r, 800));
        setScanLogs(prev => [...prev, logSequence[i]]);
      }

      if (auditResult.handleMatches && auditResult.tokenMatches && auditResult.isRealPost) {
        setTimeout(() => {
          setFormData(prev => ({ ...prev, isTwitterVerified: true }));
          onUpdate({ twitterHandle: formData.twitterHandle, isTwitterVerified: true });
          setVerificationStage('success');
        }, 1000);
      } else {
        setTimeout(() => {
          alert(`IDENTITY DISCREPANCY: ${auditResult.reasoning}`);
          setVerificationStage('handshake');
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      setScanLogs(prev => [...prev, "ERROR: AI SUBSYSTEM OFFLINE. RETRYING..."]);
    } finally {
      setIsAiAnalyzing(false);
    }
  };

  const handleConnectWallet = async () => {
    const { solana } = window as any;
    if (!solana?.isPhantom) {
      window.open('https://phantom.app/', '_blank');
      return;
    }
    try {
      const response = await solana.connect();
      setFormData(prev => ({ ...prev, walletAddress: response.publicKey.toString() }));
    } catch (err) { console.error(err); }
  };

  const handleLogoutFlow = () => {
    setIsTerminating(true);
    setTimeout(() => onLogout(), 1200);
  };

  if (isTerminating) {
    return (
      <div className="min-h-screen bg-jetblue flex flex-col items-center justify-center p-6 text-center">
        <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin mb-8"></div>
        <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">DESTROYING IDENTITY SESSION</h2>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        
        <div className="flex justify-end mb-8">
           <button onClick={handleLogoutFlow} className="px-6 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl hover:border-red-500 transition-all flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Terminate Session</span>
           </button>
        </div>

        <div className="mb-12 text-center">
          <h1 className="text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter leading-none">COMMAND CENTER</h1>
          <p className="text-[10px] font-bold text-slate-400 tracking-[0.5em] uppercase mt-4 italic">STRICT IDENTITY ARCHITECTURE</p>
        </div>

        <div className="space-y-12">
          
          {/* STEP 1: WALLET BINDING (MANDATORY) */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
               <div className="text-left max-w-sm">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-2">1. Cryptographic Anchor</h3>
                  <p className="text-[11px] text-slate-500 font-bold uppercase italic leading-relaxed">Your identity is bound to your Solana wallet. All tokens are unique to this specific hash.</p>
               </div>
               {formData.walletAddress ? (
                 <div className="px-8 py-4 bg-green-500/5 border-2 border-green-500/20 text-green-600 rounded-2xl text-xs font-black uppercase tracking-widest">
                   {formData.walletAddress.slice(0, 8)}...{formData.walletAddress.slice(-8)}
                 </div>
               ) : (
                 <button onClick={handleConnectWallet} className="px-10 py-5 bg-jetblue text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue-bright transition-all shadow-xl">Link Phantom</button>
               )}
            </div>
          </section>

          {/* STEP 2: AI IDENTITY AUDIT */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden relative">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8">2. Identity Audit</h2>

            <div className={`p-10 rounded-[2.5rem] border-2 border-dashed transition-all duration-300 ${formData.isTwitterVerified ? 'bg-blue-500/5 border-blue-500/30' : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800'}`}>
               <div className="flex flex-col items-center">
                  
                  {verificationStage === 'idle' && (
                    <div className="w-full max-w-sm space-y-6 text-center">
                       <input 
                         type="text" 
                         value={formData.twitterHandle} 
                         onChange={(e) => setFormData(prev => ({...prev, twitterHandle: e.target.value}))}
                         placeholder="@CreatorHandle"
                         className="w-full bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl px-8 py-6 text-xl font-black dark:text-white outline-none focus:border-jetblue text-center"
                       />
                       <button onClick={generateSecureHandshake} className="w-full py-6 bg-jetblue text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue-bright transition-all">Generate Bound Token</button>
                    </div>
                  )}

                  {verificationStage === 'handshake' && (
                    <div className="w-full max-w-lg space-y-8 text-center">
                       <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">CRYPTOGRAPHIC HANDSHAKE</p>
                          <p className="text-2xl font-black text-jetblue dark:text-jetblue-light mb-8 select-all tracking-widest">{verificationToken}</p>
                          
                          <button onClick={openXToPost} className="w-full py-5 bg-black text-white rounded-2xl font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 mb-6">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                            Post to X
                          </button>

                          <div className="relative pt-6 border-t border-slate-100 dark:border-slate-700">
                             <input type="file" id="evidence" className="hidden" accept="image/*" onChange={handleEvidenceUpload} />
                             <label htmlFor="evidence" className="w-full flex items-center justify-center gap-3 py-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 uppercase cursor-pointer hover:border-jetblue transition-all">
                               Upload Screenshot of Post
                             </label>
                          </div>
                       </div>
                    </div>
                  )}

                  {verificationStage === 'audit' && (
                    <div className="w-full max-w-lg text-center space-y-6">
                       <img src={evidenceImage!} className="w-full rounded-3xl border-4 border-white dark:border-slate-800 shadow-2xl mb-6" />
                       <button onClick={runAiForensicAudit} className="w-full py-6 bg-jetblue text-white rounded-2xl font-black text-xs uppercase tracking-[0.4em] shadow-2xl">Execute AI Identity Scan</button>
                    </div>
                  )}

                  {verificationStage === 'scanning' && (
                    <div className="w-full max-w-lg p-10 bg-slate-900 rounded-[3rem] border border-white/10 text-left shadow-2xl">
                       <div className="flex items-center gap-4 mb-8">
                          <div className="w-10 h-10 border-4 border-jetblue-light border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-[11px] font-black text-white uppercase tracking-[0.5em]">AI FORENSIC ANALYSIS...</span>
                       </div>
                       <div className="space-y-3 font-mono text-[11px] text-green-400">
                          {scanLogs.map((log, i) => (
                            <div key={i} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-500">
                               <span className="text-slate-600 opacity-50">[{new Date().toLocaleTimeString()}]</span>
                               <span className="uppercase">{log}</span>
                            </div>
                          ))}
                       </div>
                    </div>
                  )}

                  {verificationStage === 'success' && (
                    <div className="w-full p-12 bg-blue-500/5 rounded-[3rem] border-4 border-blue-500/10 text-center animate-in zoom-in duration-700 shadow-2xl">
                       <div className="flex justify-center mb-6">
                         <div className="bg-blue-600 text-white p-4 rounded-full shadow-2xl transform -translate-y-4 animate-bounce">
                           <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z"/></svg>
                         </div>
                       </div>
                       <h4 className="text-3xl font-black text-blue-600 dark:text-blue-400 uppercase tracking-tighter mb-2">IDENTITY ANCHORED</h4>
                       <p className="text-xl font-black text-slate-900 dark:text-white mb-10">{formData.twitterHandle}</p>
                       <button onClick={() => {setVerificationStage('idle'); setFormData(p => ({...p, isTwitterVerified: false})); onUpdate({isTwitterVerified: false});}} className="px-10 py-4 bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-[10px] font-black text-slate-400 hover:text-red-500 hover:border-red-500 uppercase tracking-widest transition-all">Revoke Authority</button>
                    </div>
                  )}
               </div>
            </div>
          </section>

          {/* Section 3: Distribution Matrix */}
          {userRole === 'creator' && (
            <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[3rem] shadow-xl border border-slate-100 dark:border-slate-800">
              <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8">3. Reach Matrix</h2>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {platforms.map(platform => (
                  <button key={platform} type="button" onClick={() => togglePlatform(platform)} className={`p-5 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all border-2 text-center ${formData.selectedPlatforms.includes(platform) ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/40'}`}>
                    {platform}
                  </button>
                ))}
              </div>
            </section>
          )}

          <div className="flex justify-center md:justify-end pt-12 pb-40">
            <button onClick={() => onSave({...formData, email: userEmail})} className="w-full md:w-auto px-24 py-10 bg-jetblue text-white rounded-[3rem] font-black text-lg uppercase tracking-[0.5em] hover:bg-jetblue-bright transition-all shadow-2xl flex items-center justify-center gap-5">
              DEPLOY PROFILE
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBuilder;

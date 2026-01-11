
import React, { useState, useEffect } from 'react';

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

/**
 * PRODUCTION OAUTH CONFIG
 * To go live: 
 * 1. Go to developer.x.com
 * 2. Create a Project & App
 * 3. Enable User Authentication Settings (OAuth 2.0)
 * 4. Set App Type to 'Public Client'
 * 5. Add your domain (e.g., https://primereach.media) to Redirect URIs
 */
const X_CLIENT_ID = "YOUR_X_CLIENT_ID"; // User must replace this with their real Client ID
const REDIRECT_URI = window.location.origin;

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, userEmail, initialWalletAddress, initialTwitterHandle, isTwitterVerified, onUpdate, onSave, onLogout }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    mission: '',
    industry: '',
    primaryObjective: '',
    audienceDescription: '',
    image: null as string | null,
    walletAddress: initialWalletAddress || null,
    twitterHandle: initialTwitterHandle || '',
    isTwitterVerified: isTwitterVerified,
    selectedPlatforms: [] as string[],
    otherPlatformDetail: ''
  });

  const [isRedirecting, setIsRedirecting] = useState(false);

  // PKCE Helper Functions
  const generateRandomString = (length: number) => {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    let result = '';
    const values = new Uint32Array(length);
    window.crypto.getRandomValues(values);
    for (let i = 0; i < length; i++) {
      result += charset[values[i] % charset.length];
    }
    return result;
  };

  const sha256 = async (plain: string) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(plain);
    return window.crypto.subtle.digest('SHA-256', data);
  };

  const base64urlencode = (a: ArrayBuffer) => {
    return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(a))))
      .replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  };

  const handleXAuthorize = async () => {
    setIsRedirecting(true);

    // 1. Generate PKCE values
    const codeVerifier = generateRandomString(64);
    const challengeBuffer = await sha256(codeVerifier);
    const codeChallenge = base64urlencode(challengeBuffer);
    const state = generateRandomString(16);

    // 2. Store values in localStorage for the callback
    localStorage.setItem('prm_x_auth_state', state);
    localStorage.setItem('prm_x_auth_verifier', codeVerifier);

    // 3. Build Auth URL
    const authUrl = new URL('https://twitter.com/i/oauth2/authorize');
    authUrl.searchParams.append('response_type', 'code');
    authUrl.searchParams.append('client_id', X_CLIENT_ID);
    authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
    authUrl.searchParams.append('scope', 'tweet.read users.read follows.read');
    authUrl.searchParams.append('state', state);
    authUrl.searchParams.append('code_challenge', codeChallenge);
    authUrl.searchParams.append('code_challenge_method', 'S256');

    // 4. PERFORM REAL REDIRECT
    window.location.href = authUrl.toString();
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFormData(prev => ({ ...prev, image: reader.result as string }));
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.isTwitterVerified) {
      alert("X Authentication is required to secure your reach data.");
      return;
    }
    onSave({ ...formData, email: userEmail });
  };

  if (isRedirecting) {
    return (
      <div className="min-h-screen bg-jetblue flex flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
        <div className="w-20 h-20 border-4 border-white border-t-prmgold rounded-full animate-spin mb-8 shadow-2xl"></div>
        <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter mb-2">Redirecting to X</h2>
        <p className="text-white/60 text-xs font-bold uppercase tracking-widest">Securing OAuth Handshake...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-5xl md:text-6xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter leading-none mb-4">IDENTITY SETUP</h1>
          <p className="text-[10px] font-black text-slate-400 tracking-[0.4em] uppercase">PORTAL ACCESS: {userRole}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12">
          {/* Section 1: Visual Identity */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">01</span>
              Visual Identity
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="flex flex-col items-center">
                <input type="file" id="branding-asset" className="hidden" accept="image/*" onChange={handleImageChange} />
                <label htmlFor="branding-asset" className="block w-48 h-48 rounded-[2.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue transition-all cursor-pointer overflow-hidden bg-slate-50 dark:bg-slate-950 shadow-inner group">
                  {formData.image ? (
                    <img src={formData.image} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-jetblue p-6 text-center">
                      <svg className="w-8 h-8 mb-2 opacity-40 group-hover:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
                      <span className="text-[9px] font-black uppercase tracking-widest">UPLOAD LOGO</span>
                    </div>
                  )}
                </label>
              </div>
              <div className="md:col-span-2 space-y-8">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Display Name</label>
                  <input type="text" required value={formData.companyName} onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold dark:text-white outline-none focus:border-jetblue shadow-sm" />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Authenticated System Email</label>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-800 rounded-2xl px-8 py-5 text-sm font-bold text-slate-400 flex items-center gap-3 italic">
                     {userEmail}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: Distribution Matrix */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">02</span>
              Reach Distribution
            </h2>
            <div className="space-y-12">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-8">Verified Distribution Channels</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {['YOUTUBE', 'X', 'TIKTOK', 'FACEBOOK', 'INSTAGRAM', 'TWITCH', 'KICK', 'PUMPFUN', 'ZORA', 'RUMBLE', 'DISCORD', 'OTHER'].map(p => (
                      <button 
                        key={p} 
                        type="button" 
                        onClick={() => {
                          const exists = formData.selectedPlatforms.includes(p);
                          setFormData(prev => ({
                            ...prev, 
                            selectedPlatforms: exists ? prev.selectedPlatforms.filter(x => x !== p) : [...prev.selectedPlatforms, p]
                          }));
                        }} 
                        className={`p-4 rounded-2xl font-black text-[10px] border-2 transition-all ${formData.selectedPlatforms.includes(p) ? 'bg-jetblue border-jetblue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 text-slate-400 hover:border-jetblue/30'}`}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Audience Insights</label>
                  <textarea rows={4} value={formData.audienceDescription} onChange={(e) => setFormData(p => ({...p, audienceDescription: e.target.value}))} className="w-full bg-slate-50 dark:bg-slate-950 border-2 border-slate-100 dark:border-slate-800 rounded-[2rem] px-8 py-8 text-sm font-bold dark:text-white outline-none focus:border-jetblue resize-none shadow-sm" placeholder="Describe your average reach and demographic metrics..." />
                </div>
              </div>
          </section>

          {/* Section 3: REAL PRODUCTION AUTHENTICATION */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-14 rounded-[3.5rem] shadow-2xl border border-slate-100 dark:border-slate-800 space-y-12">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-10 flex items-center gap-4">
              <span className="w-10 h-10 rounded-xl bg-jetblue flex items-center justify-center text-white text-xs font-black shadow-lg">03</span>
              Security & Settlement
            </h2>

            {/* REAL X AUTH CARD */}
            <div className={`p-12 rounded-[3rem] border-2 transition-all duration-500 ${formData.isTwitterVerified ? 'bg-blue-500/5 border-blue-500/20 shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner'}`}>
               <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                  <div className="flex items-center gap-8">
                     <div className="w-20 h-20 bg-black text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                        <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                     </div>
                     <div className="text-left space-y-2">
                        <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">X OAuth 2.0 Channel</h4>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic">
                          {formData.isTwitterVerified ? 'ACCOUNT SECURED & ANCHORED' : 'REQUIRED: OFFICIAL AUTHORITY HANDSHAKE'}
                        </p>
                     </div>
                  </div>

                  {formData.isTwitterVerified ? (
                    <div className="flex items-center gap-4 px-8 py-4 bg-white dark:bg-slate-950 border-2 border-blue-500/20 text-blue-600 rounded-2xl text-[12px] font-black tracking-widest uppercase shadow-sm">
                       <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.5 12.5c0-1.58-.88-2.95-2.18-3.66.26-.55.43-1.16.43-1.81 0-2.32-1.88-4.2-4.2-4.2-.65 0-1.26.17-1.81.43C13.95 2.18 12.58 1.5 11 1.5c-1.58 0-2.95.88-3.66 2.18-.55-.26-1.16-.43-1.81-.43-2.32 0-4.2 1.88-4.2 4.2 0 .65.17 1.26.43 1.81C.5 9.95.5 11.32.5 12.9c0 1.58.88 2.95 2.18 3.66-.26.55-.43 1.16-.43 1.81 0 2.32 1.88 4.2 4.2 4.2.65 0 1.26-.17 1.81-.43 1.1 1.3 2.47 1.98 4.05 1.98 1.58 0 2.95-.88 3.66-2.18.55.26 1.16.43 1.81.43 2.32 0 4.2-1.88 4.2-4.2 0-.65-.17-1.26-.43-1.81 1.3-1.1 1.98-2.47 1.98-4.05zM10.29 16.71l-3.3-3.3c-.39-.39-.39-1.02 0-1.41.39-.39 1.02-.39 1.41 0l2.59 2.59 5.59-5.59c.39-.39 1.02-.39 1.41 0 .39.39.39 1.02 0 1.41l-6.3 6.3c-.39.39-1.02.39-1.4 0z"/></svg>
                       {formData.twitterHandle}
                    </div>
                  ) : (
                    <button 
                      type="button" 
                      onClick={handleXAuthorize} 
                      className="px-12 py-5 bg-black text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-2xl flex items-center justify-center gap-4"
                    >
                      Authorize via X
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                    </button>
                  )}
               </div>
            </div>

            {/* PHANTOM WALLET SETTLEMENT */}
            <div className={`p-12 rounded-[3rem] border-2 transition-all duration-500 ${formData.walletAddress ? 'bg-green-500/5 border-green-500/20 shadow-xl' : 'bg-slate-50 dark:bg-slate-950 border-slate-100 dark:border-slate-800 shadow-inner'}`}>
              <div className="flex flex-col md:flex-row items-center justify-between gap-12">
                <div className="flex items-center gap-8">
                   <div className="w-20 h-20 bg-jetblue text-white rounded-[1.5rem] flex items-center justify-center shadow-xl">
                      <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"/></svg>
                   </div>
                   <div className="text-left space-y-2">
                      <h4 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter italic">Settlement Layer {userRole === 'marketer' && <span className="text-[10px] text-slate-400 font-bold ml-3 italic">(OPTIONAL)</span>}</h4>
                      <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] italic leading-relaxed">
                        {userRole === 'creator' ? 'MANDATORY FOR INSTANT USDC SETTLEMENT' : 'MERCHANT CHECKOUT WALLET'}
                      </p>
                   </div>
                </div>
                {formData.walletAddress ? (
                  <div className="flex items-center gap-4 px-8 py-4 bg-white dark:bg-slate-950 border-2 border-green-500/20 text-green-600 rounded-2xl text-[12px] font-black tracking-widest uppercase shadow-sm">
                    {formData.walletAddress.slice(0, 6)}...{formData.walletAddress.slice(-6)}
                  </div>
                ) : (
                  <button type="button" onClick={handleConnectWallet} className="px-14 py-6 bg-jetblue text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] hover:bg-jetblue-bright transition-all shadow-2xl">Link Phantom</button>
                )}
              </div>
            </div>
          </section>

          <div className="flex justify-center md:justify-end pt-12 pb-40">
            <button type="submit" className="w-full md:w-auto px-24 py-10 bg-jetblue text-white rounded-[3rem] font-black text-lg uppercase tracking-[0.6em] hover:bg-jetblue-bright transition-all shadow-2xl flex items-center justify-center gap-6 group">
              Finalize & Secure Profile
              <svg className="w-8 h-8 group-hover:translate-x-2 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3.5}><path d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

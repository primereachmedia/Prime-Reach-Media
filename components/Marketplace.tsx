
import React, { useState, useMemo, useEffect } from 'react';
import * as solanaWeb3 from '@solana/web3.js';

interface CardProps {
  id: string;
  image: string;
  title: string;
  date: string; 
  day: string;
  time: string;
  platforms: string[];
  category: string;
  price: string;
  creator: string;
  creatorLogo: string;
  creatorWallet: string;
  logoPlacement: string;
  creatorEmail: string;
  socialAlias: string;
  isVerified: boolean;
  totalBuys: number;
  viewers?: string;
}

interface MarketplaceProps {
  placements: CardProps[];
  isLoggedIn?: boolean;
  walletAddress?: string | null;
  onWalletConnect?: (address: string) => void;
  onAuthRequired?: () => void;
  onCreateSlot?: () => void;
}

const TREASURY_WALLET = "ErR6aaQDcaPnx8yi3apPty4T1PeJAmXjuF7ZhTpUjiaw";
const USDC_MINT = new solanaWeb3.PublicKey("EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v");
const TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA");
const ASSOCIATED_TOKEN_PROGRAM_ID = new solanaWeb3.PublicKey("ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL");

async function getAssociatedTokenAddress(
  mint: solanaWeb3.PublicKey,
  owner: solanaWeb3.PublicKey
): Promise<solanaWeb3.PublicKey> {
  const [address] = await solanaWeb3.PublicKey.findProgramAddress(
    [owner.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return address;
}

const PlacementCard: React.FC<CardProps & { onClick: () => void }> = ({ image, title, date, platforms, category, price, creator, creatorLogo, onClick }) => (
  <div 
    className="group flex flex-col items-center cursor-pointer animate-in fade-in duration-700"
    onClick={onClick}
  >
    <div className="relative w-full aspect-video rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 mb-6 group-hover:border-jetblue/50 transition-all shadow-lg group-hover:shadow-2xl">
      <img src={image} alt={title} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100 grayscale-[40%] group-hover:grayscale-0" />
      <div className="absolute bottom-6 left-6">
        <div className="bg-black/90 text-white text-[9px] font-black px-3 py-1 rounded-lg border border-white/20 tracking-[0.3em] uppercase backdrop-blur-md">PRM AD SLOT</div>
      </div>
      
      {/* Creator Branding on Card */}
      <div className="absolute top-6 right-6 flex items-center gap-3 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md pl-2 pr-4 py-1.5 rounded-2xl shadow-2xl border border-white/20">
        <div className="w-6 h-6 rounded-lg overflow-hidden border border-jetblue/10">
          <img src={creatorLogo} className="w-full h-full object-cover" alt={creator} />
        </div>
        <span className="text-jetblue dark:text-white text-[10px] font-black uppercase tracking-tighter">
          {creator}
        </span>
      </div>

      <div className="absolute inset-0 bg-jetblue/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[4px]">
        <div className="bg-white text-jetblue px-6 py-3 rounded-2xl font-black text-[11px] uppercase tracking-[0.3em] shadow-2xl flex items-center gap-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
          Inspect Placement
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path d="M9 5l7 7-7 7" /></svg>
        </div>
      </div>
    </div>
    
    <div className="text-center w-full px-4">
      <h3 className="text-xl font-black uppercase tracking-tighter text-slate-900 dark:text-white mb-2 group-hover:text-jetblue transition-colors leading-none">{title}</h3>
      <p className="text-[9px] uppercase font-black text-slate-400 dark:text-slate-500 tracking-[0.3em] mb-4 italic leading-none">{date}</p>
      
      <div className="flex justify-center flex-wrap gap-2 mb-6">
        {platforms.slice(0, 4).map(p => (
          <span key={p} className="text-[8px] font-black px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 tracking-tighter uppercase">{p}</span>
        ))}
        {platforms.length > 4 && <span className="text-[8px] font-black text-slate-400">+{platforms.length - 4}</span>}
      </div>
      
      <div className="flex items-center justify-center gap-3">
        <span className="text-[8px] font-black px-2.5 py-1 bg-jetblue/10 text-jetblue dark:text-jetblue-light rounded-full uppercase tracking-[0.2em]">{category}</span>
        <div className="flex items-baseline gap-1">
           <span className="text-base font-black text-slate-900 dark:text-white tracking-tighter">{price}</span>
           <span className="text-[9px] font-black text-slate-400">USDC</span>
        </div>
      </div>
    </div>
  </div>
);

const Marketplace: React.FC<MarketplaceProps> = ({ placements, isLoggedIn, walletAddress, onWalletConnect, onAuthRequired, onCreateSlot }) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedPlacement, setSelectedPlacement] = useState<CardProps | null>(null);
  const [status, setStatus] = useState<'active' | 'ended'>('active');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [lastSignature, setLastSignature] = useState<string | null>(null);
  
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedLogoPos, setSelectedLogoPos] = useState('');

  const platformsList = ['YOUTUBE', 'X', 'FACEBOOK', 'INSTAGRAM', 'TIKTOK', 'ZORA', 'PUMPFUN', 'RUMBLE', 'TWITCH', 'KICK', 'DISCORD', 'OTHER'];

  useEffect(() => {
    document.body.style.overflow = (isFilterOpen || selectedPlacement) ? 'hidden' : 'unset';
  }, [isFilterOpen, selectedPlacement]);

  const filteredPlacements = useMemo(() => {
    return placements.filter(p => {
      if (selectedDays.length > 0 && !selectedDays.includes(p.day)) return false;
      if (selectedTimes.length > 0 && !selectedTimes.includes(p.time)) return false;
      if (selectedGenre && p.category !== selectedGenre) return false;
      if (selectedLogoPos && p.logoPlacement !== selectedLogoPos) return false;
      if (selectedPlatforms.length > 0 && !p.platforms.some(plat => selectedPlatforms.includes(plat))) return false;
      return true;
    });
  }, [placements, selectedDays, selectedTimes, selectedPlatforms, selectedGenre, selectedLogoPos]);

  const handleBuy = async () => {
    if (!isLoggedIn) return onAuthRequired?.();
    const { solana } = window as any;
    if (!solana?.isPhantom) return window.open('https://phantom.app/', '_blank');

    let activeWallet = walletAddress;
    if (!activeWallet) {
       try {
         const resp = await solana.connect();
         activeWallet = resp.publicKey.toString();
         onWalletConnect?.(activeWallet);
       } catch (e) { return; }
    }

    if (!selectedPlacement) return;
    setIsPurchasing(true);

    try {
      const connection = new solanaWeb3.Connection(solanaWeb3.clusterApiUrl('mainnet-beta'), 'confirmed');
      const buyerPubKey = new solanaWeb3.PublicKey(activeWallet!);
      const creatorPubKey = new solanaWeb3.PublicKey(selectedPlacement.creatorWallet);
      const treasuryPubKey = new solanaWeb3.PublicKey(TREASURY_WALLET);
      
      const usdcDecimals = 1_000_000;
      const totalAmount = parseFloat(selectedPlacement.price) * usdcDecimals;
      const creatorShare = Math.floor(totalAmount * 0.9);
      const treasuryShare = totalAmount - creatorShare;

      const sourceATA = await getAssociatedTokenAddress(USDC_MINT, buyerPubKey);
      const creatorATA = await getAssociatedTokenAddress(USDC_MINT, creatorPubKey);
      const treasuryATA = await getAssociatedTokenAddress(USDC_MINT, treasuryPubKey);

      const transaction = new solanaWeb3.Transaction();

      const createTransferInstruction = (source: solanaWeb3.PublicKey, dest: solanaWeb3.PublicKey, owner: solanaWeb3.PublicKey, amt: number) => {
        const data = new Uint8Array(9);
        const view = new DataView(data.buffer);
        view.setUint8(0, 3);
        view.setBigUint64(1, BigInt(amt), true);
        return new solanaWeb3.TransactionInstruction({
          keys: [
            { pubkey: source, isSigner: false, isWritable: true },
            { pubkey: dest, isSigner: false, isWritable: true },
            { pubkey: owner, isSigner: true, isWritable: false },
          ],
          programId: TOKEN_PROGRAM_ID,
          data,
        });
      };

      transaction.add(createTransferInstruction(sourceATA, creatorATA, buyerPubKey, creatorShare));
      transaction.add(createTransferInstruction(sourceATA, treasuryATA, buyerPubKey, treasuryShare));

      const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = buyerPubKey;

      const { signature } = await solana.signAndSendTransaction(transaction);
      setLastSignature(signature);

      await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }, 'confirmed');
      
      setIsPurchasing(false);
      setIsSuccess(true);
      setTimeout(() => { setIsSuccess(false); setSelectedPlacement(null); }, 5000);

    } catch (err: any) {
      setIsPurchasing(false);
      alert(`Settlement Error: ${err?.message || "Protocol level failure during SPL transfer."}`);
    }
  };

  const getPlacementClasses = (pos: string) => {
    switch(pos) {
      case 'TOP LEFT': return 'top-8 left-8';
      case 'TOP CENTER': return 'top-8 left-1/2 -translate-x-1/2';
      case 'TOP RIGHT': return 'top-8 right-8';
      case 'BOTTOM LEFT': return 'bottom-8 left-8';
      case 'BOTTOM CENTER': return 'bottom-8 left-1/2 -translate-x-1/2';
      case 'BOTTOM RIGHT': return 'bottom-8 right-8';
      default: return 'top-8 right-8';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors pt-16 pb-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
           <h1 className="text-5xl md:text-7xl font-black text-jetblue dark:text-jetblue-light tracking-tighter uppercase leading-none italic mb-4">MARKETPLACE</h1>
           <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.5em] italic">PRODUCTION USDC SETTLEMENT PROTOCOL</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 border-t border-b border-slate-100 dark:border-slate-900 py-8 mb-16">
          <button onClick={() => setIsFilterOpen(true)} className="flex items-center gap-4 px-8 py-3.5 bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-800 rounded-xl shadow-sm hover:border-jetblue transition-all group">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-900 dark:text-white group-hover:text-jetblue">ADJUST TARGETING STACK</span>
          </button>
          <div className="flex items-center bg-slate-50 dark:bg-slate-900 p-1.5 rounded-xl shadow-inner border border-slate-100 dark:border-white/5">
            <button onClick={() => setStatus('active')} className={`px-8 py-2.5 rounded-lg font-black text-[10px] tracking-widest uppercase transition-all ${status === 'active' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>OPEN SLOTS ({filteredPlacements.length})</button>
            <button onClick={() => setStatus('ended')} className={`px-8 py-2.5 rounded-lg font-black text-[10px] tracking-widest uppercase transition-all ${status === 'ended' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}>HISTORICAL</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-16">
          {filteredPlacements.map(item => <PlacementCard key={item.id} {...item} onClick={() => setSelectedPlacement(item)} />)}
          {filteredPlacements.length === 0 && (
            <div className="col-span-full py-32 text-center bg-slate-50 dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 animate-in fade-in duration-1000">
               <p className="text-xl font-black text-slate-400 uppercase tracking-widest italic mb-4">Awaiting Protocol Broadcasts</p>
               <button onClick={onCreateSlot} className="px-10 py-4 bg-jetblue text-white rounded-xl font-black text-xs uppercase tracking-[0.4em] shadow-xl hover:bg-jetblue-bright transition-all">List First Slot</button>
            </div>
          )}
        </div>
      </div>

      {/* Detail Panel */}
      <div className={`fixed inset-0 z-[90] transition-opacity duration-500 ${selectedPlacement ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-slate-950/95 backdrop-blur-xl" onClick={() => !isPurchasing && !isSuccess && setSelectedPlacement(null)} />
        <div className={`absolute top-0 right-0 h-full w-full max-w-4xl bg-white dark:bg-slate-950 shadow-2xl transition-transform duration-700 transform ${selectedPlacement ? 'translate-x-0' : 'translate-x-full'} flex flex-col`}>
          <div className="p-8 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-6">
               <div className="px-3 py-1 bg-prmgold text-white font-black text-[10px] rounded uppercase italic">ACTIVE SLOT</div>
               <h2 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">{selectedPlacement?.title}</h2>
            </div>
            <button onClick={() => setSelectedPlacement(null)} className="p-2 text-slate-400 hover:text-red-500 transition-colors text-3xl font-black">&times;</button>
          </div>

          <div className="flex-1 overflow-y-auto p-10 space-y-12">
            <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-slate-100 dark:border-slate-800 shadow-2xl bg-slate-950">
               <img src={selectedPlacement?.image} className="w-full h-full object-cover opacity-70" />
               <div className={`absolute p-5 bg-jetblue text-white rounded-xl text-[9px] font-black shadow-2xl z-10 uppercase border border-white/20 backdrop-blur-md animate-pulse ${selectedPlacement ? getPlacementClasses(selectedPlacement.logoPlacement) : ''}`}>SPONSOR ANCHOR</div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
               <section className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800 space-y-4">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic">Targeting Parameters</h4>
                  <p className="text-lg font-black text-slate-900 dark:text-white italic uppercase">{selectedPlacement?.date}</p>
                  <p className="text-lg font-black text-jetblue dark:text-jetblue-light uppercase tracking-tight">{selectedPlacement?.category}</p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {selectedPlacement?.platforms.map(p => <span key={p} className="px-2.5 py-1 bg-white dark:bg-slate-800 rounded-lg text-[8px] font-black border border-slate-200 dark:border-slate-700">{p}</span>)}
                  </div>
               </section>
               <section className="bg-slate-50 dark:bg-slate-900/50 rounded-[2rem] p-8 border border-slate-100 dark:border-slate-800">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] italic mb-6">Identity Anchor</h4>
                  <div className="flex items-center gap-5 mb-8">
                    <div className="w-16 h-16 bg-jetblue rounded-2xl overflow-hidden flex items-center justify-center border border-jetblue/20 shadow-xl">
                      <img src={selectedPlacement?.creatorLogo} className="w-full h-full object-cover" alt={selectedPlacement?.creator} />
                    </div>
                    <h5 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-tighter">{selectedPlacement?.creator}</h5>
                  </div>
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Avg Concurrent Reach</p>
                  <p className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter italic">{selectedPlacement?.viewers || 'N/A'}</p>
               </section>
            </div>
          </div>

          <div className="p-8 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
               <p className="text-[9px] font-black text-slate-500 uppercase tracking-[0.4em]">USDC SETTLEMENT</p>
               <div className="flex items-baseline gap-2"><span className="text-5xl font-black text-slate-900 dark:text-white tracking-tighter">{selectedPlacement?.price}</span><span className="text-lg font-black text-slate-400">USDC</span></div>
            </div>
            <div className="flex flex-col gap-3 w-full sm:w-auto">
              <button disabled={isPurchasing || isSuccess} onClick={handleBuy} className={`w-full sm:w-auto min-w-[280px] h-20 rounded-[1.5rem] font-black text-lg uppercase tracking-[0.4em] shadow-xl transition-all flex items-center justify-center gap-4 relative overflow-hidden ${isSuccess ? 'bg-green-500 text-white' : isPurchasing ? 'bg-slate-800 text-slate-400' : 'bg-prmgold hover:bg-prmgold-dark text-white'}`}>
                {isSuccess ? 'SLOT RESERVED' : isPurchasing ? 'SETTLING SPL...' : 'PAY & LOCK IN SLOT'}
              </button>
              {isSuccess && lastSignature && (
                <a href={`https://explorer.solana.com/tx/${lastSignature}`} target="_blank" rel="noopener noreferrer" className="text-[9px] font-black text-slate-400 hover:text-jetblue text-center uppercase tracking-widest">VERIFY TRANSACTION ON MAINNET</a>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace;

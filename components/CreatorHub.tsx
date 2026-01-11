
import React, { useState } from 'react';

interface CreatorHubProps {
  onLogout: () => void;
  userEmail: string;
}

const CreatorHub: React.FC<CreatorHubProps> = ({ onLogout, userEmail }) => {
  const [activeTab, setActiveTab] = useState<'slots' | 'revenue' | 'analytics'>('slots');

  const stats = [
    { label: 'PENDING PAYOUT', value: '1,420 USDC', trend: '+12% this week' },
    { label: 'ACTIVE SLOTS', value: '14', trend: '3 sold last 24h' },
    { label: 'TOTAL REACH', value: '2.4M', trend: 'Verified via X' },
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-16 px-6">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-16">
          <div className="space-y-2">
            <h1 className="text-5xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter leading-none">CREATOR HUB</h1>
            <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 tracking-[0.4em] uppercase">{userEmail}</p>
          </div>
          
          <div className="flex items-center gap-4">
             <button className="px-8 py-4 bg-jetblue text-white rounded-2xl font-black text-[10px] uppercase tracking-widest shadow-xl shadow-jetblue/20 hover:bg-jetblue-bright transition-all">List New Slot</button>
             <button onClick={onLogout} className="px-6 py-4 bg-white dark:bg-slate-900 border-2 border-slate-100 dark:border-slate-800 text-slate-400 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:border-red-500/20 hover:text-red-500 transition-all">Log Out</button>
          </div>
        </div>

        {/* Rapid Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white dark:bg-slate-900 p-10 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-4">{stat.label}</p>
               <h3 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-2 italic">{stat.value}</h3>
               <p className="text-[9px] font-bold text-green-500 uppercase tracking-widest">{stat.trend}</p>
            </div>
          ))}
        </div>

        {/* Dashboard Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 mb-12">
          {(['slots', 'revenue', 'analytics'] as const).map(tab => (
            <button 
              key={tab} 
              onClick={() => setActiveTab(tab)}
              className={`px-12 py-6 text-[11px] font-black uppercase tracking-[0.3em] transition-all relative ${activeTab === tab ? 'text-jetblue dark:text-white' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-1 bg-jetblue rounded-t-full shadow-[0_0_15px_rgba(0,32,91,0.5)]"></div>}
            </button>
          ))}
        </div>

        {/* Tab Content Area */}
        <div className="bg-white dark:bg-slate-900 rounded-[3rem] p-12 shadow-2xl border border-slate-100 dark:border-slate-800 min-h-[400px] flex items-center justify-center text-center">
           <div className="space-y-6">
              <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-dashed border-slate-200 dark:border-slate-700">
                 <svg className="w-8 h-8 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M12 4v16m8-8H4" strokeWidth={3}/></svg>
              </div>
              <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">DATA PIPELINE INITIALIZING</h4>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-[0.3em] max-w-sm">No active entries found for {activeTab}. Once you list your first slot and verify reach, metrics will populate here in real-time.</p>
           </div>
        </div>

      </div>
    </div>
  );
};

export default CreatorHub;

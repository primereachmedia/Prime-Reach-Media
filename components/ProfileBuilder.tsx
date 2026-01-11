
import React, { useState } from 'react';

interface ProfileBuilderProps {
  userRole: string;
  onSave: (data: any) => void;
}

const ProfileBuilder: React.FC<ProfileBuilderProps> = ({ userRole, onSave }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    mission: '',
    companyType: '',
    timeInBusiness: '',
    industry: '',
    primaryObjective: '',
    audienceDescription: '',
    image: null as string | null
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const companyTypes = ['Individual', 'Startup', 'Agency', 'Enterprise'];
  const businessTimes = ['Less than 6 months', '6 to 12 months', '1+ year'];
  const industries = ['Crypto', 'Gaming', 'SaaS', 'Ecommerce', 'Media', 'Other'];
  const objectives = ['Brand awareness', 'Product launch', 'Conversions', 'Community growth'];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-jetblue dark:text-white uppercase italic tracking-tighter">PROFILE STUDIO</h1>
          <p className="text-[10px] font-bold text-slate-500 tracking-[0.4em] uppercase mt-2">CONFIGURING IDENTITY FOR: <span className="text-prmgold">{userRole}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-12 pb-24">
          
          {/* IMAGE BRANDING SECTION */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">01</span>
              Branding Assets
            </h2>
            
            <div className="relative group">
              <input 
                type="file" 
                id="branding-asset" 
                className="hidden" 
                accept="image/*"
                onChange={handleImageChange}
              />
              <label 
                htmlFor="branding-asset"
                className="block w-full aspect-[21/9] rounded-3xl border-4 border-dashed border-slate-200 dark:border-slate-800 hover:border-jetblue dark:hover:border-jetblue transition-all cursor-pointer overflow-hidden relative group"
              >
                {formData.image ? (
                  <div className="relative w-full h-full">
                    <img src={formData.image} className="w-full h-full object-cover" alt="Branding" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white font-black text-xs uppercase tracking-widest">Update Asset</span>
                    </div>
                  </div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 group-hover:text-jetblue">
                    <svg className="w-12 h-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-xs font-black uppercase tracking-[0.2em]">Upload Stream Branding Asset</span>
                    <p className="text-[10px] font-bold mt-2 opacity-60 italic">Recommended: 1920x820 PNG/SVG</p>
                  </div>
                )}
              </label>
            </div>
          </section>

          {/* BUSINESS VERIFICATION SECTION */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">02</span>
              Identity Verification
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Entity Name</label>
                <input 
                  type="text" 
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({...prev, companyName: e.target.value}))}
                  placeholder="EX: PRIME REACH MEDIA"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all"
                />
              </div>
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Mission Statement</label>
                <input 
                  type="text" 
                  value={formData.mission}
                  onChange={(e) => setFormData(prev => ({...prev, mission: e.target.value}))}
                  placeholder="ONE SENTENCE IMPACT"
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-xl px-6 py-4 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Company Structure</label>
                <div className="flex flex-wrap gap-3">
                  {companyTypes.map(type => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, companyType: type}))}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.companyType === type ? 'bg-jetblue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-jetblue border-2 border-transparent'}`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Tenure in Business</label>
                <div className="flex flex-wrap gap-3">
                  {businessTimes.map(time => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, timeInBusiness: time}))}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.timeInBusiness === time ? 'bg-jetblue text-white shadow-lg' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-jetblue border-2 border-transparent'}`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Core Industry</label>
                <div className="flex flex-wrap gap-3">
                  {industries.map(ind => (
                    <button
                      key={ind}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, industry: ind}))}
                      className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${formData.industry === ind ? 'bg-prmgold text-white shadow-lg shadow-prmgold/20' : 'bg-slate-50 dark:bg-slate-800 text-slate-500 hover:border-prmgold border-2 border-transparent'}`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* MARKETING STRATEGY SECTION */}
          <section className="bg-white dark:bg-slate-900 p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-jetblue/5 border border-slate-100 dark:border-slate-800">
            <h2 className="text-xl font-black text-slate-900 dark:text-white uppercase mb-8 flex items-center gap-3">
              <span className="w-8 h-8 rounded-lg bg-jetblue flex items-center justify-center text-white text-xs">03</span>
              Strategic Goals
            </h2>

            <div className="space-y-10">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Primary Objective</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {objectives.map(obj => (
                    <button
                      key={obj}
                      type="button"
                      onClick={() => setFormData(prev => ({...prev, primaryObjective: obj}))}
                      className={`px-4 py-4 rounded-xl text-[9px] font-black uppercase text-center tracking-tight leading-tight transition-all border-2 ${formData.primaryObjective === obj ? 'bg-jetblue border-jetblue text-white shadow-xl' : 'bg-slate-50 dark:bg-slate-800 border-transparent text-slate-500'}`}
                    >
                      {obj}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">Target Audience Architecture</label>
                <textarea 
                  rows={4}
                  value={formData.audienceDescription}
                  onChange={(e) => setFormData(prev => ({...prev, audienceDescription: e.target.value}))}
                  placeholder="DESCRIBE THE DEMOGRAPHICS, PSYCHOGRAPHICS, AND NICHE SEGMENTS YOU ARE TARGETING..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-800 rounded-2xl px-8 py-6 text-xs font-bold dark:text-white focus:border-jetblue outline-none transition-all resize-none"
                />
              </div>
            </div>
          </section>

          <div className="flex justify-end">
            <button 
              type="submit"
              className="px-16 py-6 bg-jetblue text-white rounded-2xl font-black text-sm uppercase tracking-[0.4em] hover:bg-jetblue-bright transition-all shadow-2xl hover:-translate-y-1 active:scale-95"
            >
              Finalize & Save Profile
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ProfileBuilder;

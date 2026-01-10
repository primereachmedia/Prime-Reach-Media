
import React from 'react';

const ValueProp: React.FC = () => {
  return (
    <section className="py-24 bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Zero Friction, Maximum Reach</h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            We’ve removed the obstacles that slow down creator marketing. Set your criteria, find your match, and launch.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* For Marketers */}
          <div id="marketers" className="bg-white dark:bg-slate-950 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-jetblue/10 dark:bg-jetblue/20 rounded-2xl flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-jetblue dark:text-jetblue-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">For Marketing Teams</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Find the exact placement and time you need. Filter by audience, niche, and timing to ensure your message hits exactly when you want it to—no long negotiation threads required.
            </p>
            <ul className="space-y-4">
              {['Precision timing controls', 'Instant slot booking', 'Verified audience data'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                  <svg className="w-5 h-5 text-jetblue dark:text-jetblue-light" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* For Creators */}
          <div id="creators" className="bg-white dark:bg-slate-950 p-10 rounded-3xl shadow-sm border border-slate-200 dark:border-slate-800">
            <div className="w-16 h-16 bg-jetblue/10 dark:bg-jetblue/20 rounded-2xl flex items-center justify-center mb-8">
              <svg className="w-8 h-8 text-jetblue dark:text-jetblue-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">For Creators</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
              Monetize your audience effortlessly. List your available slots, set your price, and let marketing teams buy what they need. You focus on content; we handle the transactions.
            </p>
            <ul className="space-y-4">
              {['Guaranteed payouts', 'Full schedule control', 'Passive income stream'].map((item, idx) => (
                <li key={idx} className="flex items-center gap-3 text-slate-700 dark:text-slate-300 font-medium">
                  <svg className="w-5 h-5 text-jetblue dark:text-jetblue-light" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ValueProp;

import React, { useState, useEffect } from 'react';
import { useEscalation } from './hooks/useEscalation';
import { useVoiceTrigger } from './hooks/useVoiceTrigger';
import EscalationScreen from './components/escalation/EscalationScreen';
import ActivityLog from './components/dashboard/ActivityLog';
import SettingsDrawer from './components/settings/SettingsDrawer';
import { EscalationState, Contact } from './types';

// Default initial contacts
const INITIAL_CONTACTS: Contact[] = [
  { id: '1', name: "Mom", phone: "555-0101", role: "PRIMARY" },
  { id: '2', name: "Emergency Services", phone: "911", role: "EMERGENCY" }
];

const App: React.FC = () => {
  const { 
    state, 
    timeLeft, 
    startCheckIn, 
    reportSafe, 
    reportDanger, 
    config,
    logs 
  } = useEscalation();

  // App Level State
  const [safeWord, setSafeWord] = useState<string>("help");
  const [contacts, setContacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Theme State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check local storage or system preference
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('theme');
        if (saved) return saved === 'dark';
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return true; // Default to dark
  });

  // Apply Theme Side Effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  // Voice Trigger
  const { isListening, lastHeard } = useVoiceTrigger(startCheckIn, safeWord);

  const isOverlayVisible = state !== EscalationState.IDLE;

  return (
    <div className="min-h-screen transition-colors duration-500 bg-slate-50 dark:bg-slate-950 pb-20 selection:bg-brand-500/30">
      
      {/* Settings Drawer */}
      <SettingsDrawer 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        safeWord={safeWord}
        setSafeWord={setSafeWord}
        contacts={contacts}
        setContacts={setContacts}
      />

      {/* Aesthetic Gradient Header */}
      <div className="relative overflow-hidden bg-slate-900 text-white pb-24 rounded-b-[40px] shadow-2xl shadow-blue-900/20 dark:shadow-black/50 border-b border-white/5 transition-all duration-500">
        
        {/* Dynamic Background Gradient */}
        <div className={`absolute inset-0 bg-gradient-to-br transition-opacity duration-1000 ${isDarkMode ? 'from-slate-900 via-slate-900 to-slate-900 opacity-100' : 'from-brand-600 via-brand-500 to-blue-400 opacity-100'}`}></div>
        
        <header className="relative px-6 py-6 flex justify-between items-start z-10">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-sm">SilentSignals</h1>
                <p className="text-blue-100/80 text-sm font-medium">Personal Safety Monitor</p>
            </div>
            
            <div className="flex items-center gap-3">
                {/* Theme Toggle */}
                <button 
                    onClick={toggleTheme}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all border border-white/10"
                    aria-label="Toggle Dark Mode"
                >
                    {isDarkMode ? (
                        <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                    ) : (
                        <svg className="w-5 h-5 text-blue-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                        </svg>
                    )}
                </button>

                {/* Settings Button */}
                <button 
                    onClick={() => setIsSettingsOpen(true)}
                    className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center transition-all border border-white/10"
                >
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
            </div>
        </header>
        
        {/* Voice Status Indicator */}
        <div className="relative px-6 mt-2 flex items-center gap-3 z-10">
             <div className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-md border flex items-center gap-2 transition-colors duration-300 ${isListening ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-100' : 'bg-white/10 border-white/10 text-slate-200'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isListening ? 'bg-emerald-400 animate-pulse' : 'bg-slate-400'}`}></span>
                {isListening ? 'Listening for trigger...' : 'Mic Inactive'}
             </div>
             {lastHeard && (
                 <div className="text-xs text-white/70 italic">
                     Heard: "{lastHeard}"
                 </div>
             )}
        </div>
      </div>

      <main className="max-w-xl mx-auto px-4 -mt-20 space-y-5 relative z-10">
        
        {/* Main Status Card */}
        <section className="bg-white dark:bg-slate-900 p-6 rounded-[28px] shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 transition-all duration-300 flex flex-col items-center text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shadow-inner dark:shadow-none dark:border dark:border-emerald-500/20">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
            <div>
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">You are Protected</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Automatic escalation is active.</p>
                <div className="mt-4 inline-block px-4 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700">
                    <p className="text-slate-600 dark:text-slate-300 text-xs font-medium">
                        Say <span className="text-brand-600 dark:text-brand-400 font-bold">"{safeWord}"</span> to trigger check-in
                    </p>
                </div>
            </div>
        </section>

        {/* Action Grid */}
        <section className="grid grid-cols-2 gap-4">
             {/* Manual Check-in */}
             <button 
                onClick={startCheckIn}
                disabled={isOverlayVisible}
                className="group col-span-1 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-white p-6 rounded-[24px] shadow-lg shadow-slate-200/50 dark:shadow-black/50 transition-all active:scale-[0.98] flex flex-col justify-between h-36 border border-slate-100 dark:border-slate-800 duration-300"
             >
                <div className="w-10 h-10 rounded-2xl bg-brand-50 dark:bg-brand-500/10 flex items-center justify-center text-brand-600 dark:text-brand-400 group-hover:bg-brand-600 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                <div className="text-left">
                    <span className="block font-bold text-lg">Check In</span>
                    <span className="text-xs text-slate-400 dark:text-slate-500">Trigger manual timer</span>
                </div>
             </button>

             {/* Immediate SOS */}
             <button 
                onClick={reportDanger}
                disabled={isOverlayVisible}
                className="group col-span-1 bg-gradient-to-br from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white p-6 rounded-[24px] shadow-lg shadow-red-500/20 dark:shadow-red-900/40 transition-all active:scale-[0.98] flex flex-col justify-between h-36 relative overflow-hidden"
             >
                 <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                 <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center text-white border border-white/10">
                     <svg className="w-6 h-6 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                     </svg>
                 </div>
                 <div className="text-left relative z-10">
                    <span className="block font-bold text-xl tracking-tight">SOS NOW</span>
                    <span className="text-xs text-red-100 font-medium">Skip to emergency</span>
                </div>
             </button>

             {/* Contacts Summary Card */}
             <div className="col-span-2 bg-white dark:bg-slate-900 p-5 rounded-[24px] shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 transition-all duration-300 flex items-center justify-between">
                 <div className="flex flex-col">
                     <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">Trusted Circle</span>
                     <div className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                         <span className="text-slate-800 dark:text-white">{contacts.length} Active Contacts</span>
                         <div className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-600"></div>
                         <span className="text-slate-500 dark:text-slate-400">Ready</span>
                     </div>
                 </div>
                 <div className="flex -space-x-3">
                    {contacts.slice(0,3).map((c, i) => (
                        <div key={c.id} className={`w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${i % 2 === 0 ? 'bg-slate-400 dark:bg-slate-600' : 'bg-brand-500'}`}>
                            {c.name.charAt(0)}
                        </div>
                    ))}
                    {contacts.length > 3 && (
                        <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-white dark:border-slate-800 flex items-center justify-center text-[10px] text-slate-500 dark:text-slate-400 font-bold">
                            +{contacts.length - 3}
                        </div>
                    )}
                    <button 
                        onClick={() => setIsSettingsOpen(true)}
                        className="w-10 h-10 rounded-full border-2 border-white dark:border-slate-800 border-dashed bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 dark:text-slate-500 hover:text-brand-600 dark:hover:text-brand-400 hover:border-brand-200 dark:hover:border-brand-800 transition-all"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                    </button>
                 </div>
             </div>
        </section>

        {/* Activity Feed */}
        <section>
            <ActivityLog logs={logs} />
        </section>

      </main>

      {/* The Escalation Overlay */}
      {isOverlayVisible && (
        <EscalationScreen
          state={state}
          timeLeft={timeLeft}
          totalTime={state === EscalationState.CHECK_IN ? config.checkInDuration : config.primaryAlertDuration}
          onSafe={reportSafe}
          onDanger={reportDanger}
        />
      )}
    </div>
  );
};

export default App;
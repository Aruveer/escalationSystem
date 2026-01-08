import React, { useMemo } from 'react';
import { EscalationState } from '../types';
import CountdownTimer from './CountdownTimer';

interface EscalationScreenProps {
  state: EscalationState;
  timeLeft: number;
  totalTime: number;
  onSafe: () => void;
  onDanger: () => void;
}

const EscalationScreen: React.FC<EscalationScreenProps> = ({
  state,
  timeLeft,
  totalTime,
  onSafe,
  onDanger
}) => {
  
  // UI Configuration based on state
  const uiConfig = useMemo(() => {
    switch (state) {
      case EscalationState.CHECK_IN:
        return {
          title: "Are you okay?",
          subtitle: "We noticed some unusual inactivity.",
          color: "#60A5FA", // Blue 400
          showTimer: true,
          statusText: "Waiting for response..."
        };
      case EscalationState.ALERT_PRIMARY:
        return {
          title: "Contacting Trusted Contact",
          subtitle: "We're letting your primary contact know.",
          color: "#F87171", // Red 400
          showTimer: true,
          statusText: "Alert sent. Waiting..."
        };
      case EscalationState.ALERT_SECONDARY:
        return {
          title: "Escalating Emergency",
          subtitle: "Calling emergency services/secondary contact.",
          color: "#EF4444", // Red 500
          showTimer: false,
          statusText: "Help is on the way."
        };
      case EscalationState.RESOLVED:
        return {
          title: "Glad you're safe!",
          subtitle: "Resuming normal monitoring.",
          color: "#4ADE80", // Green 400
          showTimer: false,
          statusText: "Resolved"
        };
      default:
        return null;
    }
  }, [state]);

  if (!uiConfig) return null;

  return (
    <div className="fixed inset-0 z-50 bg-white/95 dark:bg-[#0F172A]/95 backdrop-blur-xl flex flex-col items-center justify-between p-8 animate-fade-in text-slate-800 dark:text-white transition-colors duration-300">
      
      {/* Header Section */}
      <div className="text-center mt-12 space-y-4 max-w-xs">
        <h1 className="text-4xl font-bold tracking-tight leading-tight">
          {uiConfig.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400 text-lg font-medium leading-relaxed">
          {uiConfig.subtitle}
        </p>
      </div>

      {/* Timer / Visual Indicator */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        {uiConfig.showTimer ? (
          <div className="relative">
              {/* Pulse effect behind timer */}
              <div className="absolute inset-0 bg-slate-100 dark:bg-white/5 rounded-full animate-pulse-slow scale-90"></div>
              <CountdownTimer 
                current={timeLeft} 
                total={totalTime} 
                color={uiConfig.color}
                size={280}
                strokeWidth={12}
              />
          </div>
        ) : (
          <div className="w-64 h-64 rounded-full flex items-center justify-center bg-slate-50 dark:bg-slate-900 border-8 border-slate-100 dark:border-slate-800 shadow-2xl relative">
             {state === EscalationState.RESOLVED ? (
               <svg className="w-32 h-32 text-emerald-500 dark:text-emerald-400 drop-shadow-sm animate-bounce-short" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
               </svg>
             ) : (
                <>
                <div className="absolute inset-0 border-4 border-red-500/30 rounded-full animate-ping"></div>
                <svg className="w-32 h-32 text-red-500 animate-pulse drop-shadow-sm relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                </>
             )}
          </div>
        )}
        <div className="mt-8 text-slate-500 dark:text-slate-300 font-bold uppercase tracking-widest text-xs bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-4 py-1.5 rounded-full">
            {uiConfig.statusText}
        </div>
      </div>


      {/* Actions */}
      <div className="w-full max-w-sm space-y-4 mb-8">
        {state !== EscalationState.RESOLVED && (
          <>
            {/* Primary Action - I'm Safe */}
            <button
              onClick={onSafe}
              className="group w-full relative overflow-hidden bg-brand-600 hover:bg-brand-700 active:scale-[0.98] transition-all text-white rounded-[28px] p-6 shadow-xl shadow-brand-500/30 ring-4 ring-transparent hover:ring-brand-200 dark:hover:ring-brand-900"
            >
              <div className="relative z-10 flex items-center justify-center gap-3">
                 <div className="bg-white/20 p-2 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                 </div>
                 <span className="text-2xl font-bold tracking-tight">I am Safe</span>
              </div>
            </button>
            
            {/* Secondary Action - Need Help */}
            <button
              onClick={onDanger}
              className="w-full py-5 bg-transparent text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 active:bg-red-100 dark:active:bg-red-900/20 border border-red-200 dark:border-red-500/30 rounded-[28px] text-lg font-bold transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>SOS / Need Help</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default EscalationScreen;
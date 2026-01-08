import React from 'react';
import { AlertLog, EscalationState } from '../types';

interface ActivityLogProps {
  logs: AlertLog[];
}

const ActivityLog: React.FC<ActivityLogProps> = ({ logs }) => {
  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-slate-400 dark:text-slate-500 bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[24px] p-6 shadow-sm transition-colors duration-300">
        <svg className="w-8 h-8 mb-2 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-sm font-medium">Activity Log is Empty</span>
        <span className="text-xs opacity-75">Events will appear here</span>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-900 rounded-[28px] shadow-lg shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-slate-800 overflow-hidden flex flex-col max-h-96 transition-all duration-300">
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/80 dark:bg-slate-800/40">
        <h3 className="font-bold text-slate-600 dark:text-slate-300 text-sm tracking-wide">Recent Activity</h3>
        <span className="px-2 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-[10px] font-bold text-slate-500 dark:text-slate-300 uppercase">{logs.length} events</span>
      </div>
      
      <div className="overflow-y-auto p-5 space-y-5">
        {logs.map((log, index) => {
            const isAlert = log.state === EscalationState.ALERT_SECONDARY || log.state === EscalationState.ALERT_PRIMARY;
            const isResolved = log.state === EscalationState.RESOLVED;
            
            return (
                <div key={index} className="flex gap-4 relative animate-fade-in-up">
                    {/* Timeline Line */}
                    {index !== logs.length - 1 && (
                        <div className="absolute left-[9px] top-8 bottom-[-20px] w-0.5 bg-slate-100 dark:bg-slate-800"></div>
                    )}
                    
                    {/* Dot */}
                    <div className={`relative z-10 w-5 h-5 rounded-full flex-shrink-0 border-4 border-white dark:border-slate-900 shadow-sm ${
                        isAlert ? 'bg-status-alert' : 
                        isResolved ? 'bg-status-ok' : 
                        'bg-brand-500'
                    }`}></div>

                    <div className="flex-1 -mt-1">
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                                isAlert ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20' : 
                                isResolved ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/20' : 
                                'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-500/20'
                            }`}>
                                {log.state.replace(/_/g, " ")}
                            </span>
                            <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono">
                                {log.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug font-medium">
                            {log.message}
                        </p>
                    </div>
                </div>
            )
        })}
      </div>
    </div>
  );
};

export default ActivityLog;
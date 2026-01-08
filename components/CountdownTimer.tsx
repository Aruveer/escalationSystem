import React from 'react';

interface CountdownTimerProps {
  current: number;
  total: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ 
  current, 
  total, 
  size = 200, 
  strokeWidth = 8,
  color = '#8BA6C9'
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progress = Math.max(0, Math.min(1, current / total));
  const dashOffset = circumference - progress * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background Circle */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          className="stroke-slate-200 dark:stroke-slate-700 transition-colors duration-300"
        />
        {/* Progress Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      {/* Text in Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-light text-slate-800 dark:text-white font-sans">
          {current}
        </span>
        <span className="text-xs uppercase tracking-widest text-slate-500 mt-1">seconds</span>
      </div>
    </div>
  );
};

export default CountdownTimer;
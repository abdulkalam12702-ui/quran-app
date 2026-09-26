import React from 'react';

export const WaveVisualizer = ({ isPlaying = false, barCount = 5, color = 'bg-sky-400' }) => {
  return (
    <div className="flex items-center gap-[3px] h-6 px-1">
      {Array.from({ length: barCount }).map((_, i) => {
        const delays = ['0.1s', '0.3s', '0s', '0.4s', '0.2s', '0.5s', '0.25s'];
        const delay = delays[i % delays.length];
        
        return (
          <span
            key={i}
            className={`w-[3px] rounded-full ${color} transition-all duration-300 ${
              isPlaying ? 'animate-wave-bar' : 'h-[4px] opacity-40'
            }`}
            style={{
              animationDelay: delay,
              minHeight: '4px',
            }}
          />
        );
      })}
    </div>
  );
};

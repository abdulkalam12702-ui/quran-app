import React from 'react';
import { Play, Pause, Square, Loader2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { WaveVisualizer } from './WaveVisualizer';

export const MiniPlayer = () => {
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    isLoading,
    togglePlayPause,
    stopAudio,
    currentTime,
    duration,
    openFullScreen,
    isFullScreenOpen,
    activeVisual,
  } = useAudio();

  // If full screen player is already open or no Surah selected, don't show mini player
  if (isFullScreenOpen || !currentSurah) {
    return null;
  }

  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div 
      className="fixed bottom-[65px] sm:bottom-[70px] left-0 right-0 z-30 px-3 py-1 pointer-events-none max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
    >
      <div 
        onClick={openFullScreen}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openFullScreen()}
        className="pointer-events-auto w-full group relative overflow-hidden rounded-2xl glass-panel bg-theme-card border border-theme-border shadow-[0_8px_30px_rgba(0,0,0,0.3)] p-2.5 flex items-center gap-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        {/* Progress track at top of mini player */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-theme-border">
          <div 
            className="h-full bg-theme-accent transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Thumbnail Artwork with Reciter or Visual overlay */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-theme-surface border border-theme-border shadow-inner">
          <img 
            src={activeVisual?.thumb || activeVisual?.url} 
            alt={currentSurah.name_en} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/35 flex items-center justify-center">
            {isPlaying ? (
              <WaveVisualizer isPlaying={true} barCount={3} color="bg-white" />
            ) : (
              <span className="text-[11px] font-bold text-white font-mono">
                #{currentSurah.id}
              </span>
            )}
          </div>
        </div>

        {/* Surah details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-theme-primary truncate group-hover:text-theme-accent transition-colors">
              {currentSurah.id}. {currentSurah.name_en}
            </span>
            <span 
              className="text-xs font-arabic font-medium px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20"
              style={{ color: 'var(--theme-calligraphy)' }}
            >
              {currentSurah.name_ar}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-theme-muted truncate">
              {currentReciter.name_en}
            </span>
          </div>
        </div>

        {/* Controls: Stop & Play/Pause */}
        <div className="flex items-center gap-2 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          {/* Explicit Stop Control */}
          <button
            type="button"
            onClick={stopAudio}
            aria-label="Stop Playback"
            title="Stop and reset to beginning"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-theme-surface text-theme-muted hover:text-rose-500 hover:bg-rose-500/15 border border-theme-border active:scale-95 transition-all cursor-pointer"
          >
            <Square className="w-3.5 h-3.5 fill-current" />
          </button>

          {/* Play / Pause Toggle Button */}
          <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause Surah' : 'Play Surah'}
            title={isPlaying ? "Pause" : "Play"}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-theme-accent text-slate-950 shadow-md shadow-theme-accent/25 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-950" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

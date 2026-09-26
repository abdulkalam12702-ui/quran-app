import React from 'react';
import { Play, Pause, X, Loader2, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { WaveVisualizer } from './WaveVisualizer';

export const MiniPlayer = () => {
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    isLoading,
    togglePlayPause,
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
        className="pointer-events-auto w-full group relative overflow-hidden rounded-2xl glass-panel bg-slate-900/90 border border-slate-700/60 shadow-[0_8px_30px_rgba(0,0,0,0.7)] p-2.5 flex items-center gap-3 transition-all duration-300 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
      >
        {/* Progress track at top of mini player */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-slate-800/80">
          <div 
            className="h-full bg-gradient-to-r from-sky-400 to-indigo-500 transition-all duration-200"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Thumbnail Artwork with Reciter or Visual overlay */}
        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 bg-slate-800 border border-white/10 shadow-inner">
          <img 
            src={activeVisual?.thumb || activeVisual?.url} 
            alt={currentSurah.name_en} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
            {isPlaying ? (
              <WaveVisualizer isPlaying={true} barCount={3} color="bg-sky-300" />
            ) : (
              <span className="text-[11px] font-bold text-sky-300 font-mono">
                #{currentSurah.id}
              </span>
            )}
          </div>
        </div>

        {/* Surah details */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-100 truncate group-hover:text-sky-300 transition-colors">
              {currentSurah.id}. {currentSurah.name_en}
            </span>
            <span className="text-xs font-arabic text-amber-300/90 font-medium px-1.5 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">
              {currentSurah.name_ar}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="text-xs text-slate-400 truncate">
              {currentReciter.name_en}
            </span>
          </div>
        </div>

        {/* Play / Pause button */}
        <div className="flex items-center gap-1.5 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            onClick={togglePlayPause}
            aria-label={isPlaying ? 'Pause Surah' : 'Play Surah'}
            className="w-10 h-10 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/20 hover:scale-105 active:scale-95 transition-transform"
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-white" />
            ) : isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white translate-x-0.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

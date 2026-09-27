import React, { useState } from 'react';
import { 
  ChevronDown, 
  Heart, 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  RotateCcw, 
  RotateCw, 
  Repeat, 
  Repeat1, 
  Sliders, 
  Volume2, 
  VolumeX, 
  Loader2, 
  AlertCircle,
  Share2,
  Mountain,
  CloudRain,
  Waves,
  Moon,
  Trees,
  Sunset,
  Flame,
  Shuffle,
  Check,
  X,
  Square
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatTime } from '../utils/formatters';
import { WaveVisualizer } from './WaveVisualizer';
import { AnimatedEnvironment } from './AnimatedEnvironment';
import { AudioSettingsModal } from './AudioSettingsModal';
import { DualVolumeControl } from './DualVolumeControl';
import { ENVIRONMENTS } from '../data/backgroundVisualsData';

export const FullScreenPlayer = () => {
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    isLoading,
    hasError,
    errorMessage,
    currentTime,
    duration,
    bufferedPercent,
    seek,
    skipTime,
    playNext,
    playPrevious,
    togglePlayPause,
    stopAudio,
    isFullScreenOpen,
    closeFullScreen,
    activeEnvironment,
    activeEnvironmentId,
    setEnvironment,
    isAutoBackground,
    toggleAutoBackground,
    playbackRate,
    setPlaybackRate,
    repeatMode,
    setRepeatMode,
    playSurah,
    currentSurahId,
    currentReciterId,
  } = useAudio();

  const { isFavoriteSurah, toggleFavoriteSurah } = usePreferences();

  // Floating menus & modals
  const [showEnvDropdown, setShowEnvDropdown] = useState(false);
  const [showVolumeMixer, setShowVolumeMixer] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  if (!isFullScreenOpen || !currentSurah) return null;

  const isFav = isFavoriteSurah(currentSurah.id);
  const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  const cycleRepeat = () => {
    if (repeatMode === 'off') setRepeatMode('one');
    else if (repeatMode === 'one') setRepeatMode('all');
    else setRepeatMode('off');
  };

  const cycleSpeed = () => {
    const speeds = [0.75, 1.0, 1.25, 1.5, 2.0];
    const nextIdx = (speeds.indexOf(playbackRate) + 1) % speeds.length;
    setPlaybackRate(speeds[nextIdx]);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Listen to Surah ${currentSurah.name_en}`,
          text: `Listening to Surah ${currentSurah.name_en} (${currentSurah.name_ar}) recited by ${currentReciter.name_en}`,
          url: window.location.href,
        });
      } catch (err) {
        // Ignored
      }
    }
  };

  const getEnvIcon = (iconName) => {
    switch (iconName) {
      case 'Mountain': return Mountain;
      case 'CloudRain': return CloudRain;
      case 'Waves': return Waves;
      case 'Moon': return Moon;
      case 'Trees': return Trees;
      case 'Sunset': return Sunset;
      case 'Flame': return Flame;
      default: return Mountain;
    }
  };

  const CurrentEnvIcon = getEnvIcon(activeEnvironment?.icon);

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-slate-950 select-none"
        style={{
          paddingTop: 'calc(env(safe-area-inset-top, 12px) + 8px)',
          paddingBottom: 'calc(env(safe-area-inset-bottom, 12px) + 10px)',
        }}
      >
        {/* ================================================================= */}
        {/* 1. REAL FULL-SCREEN ANIMATED ENVIRONMENT (NO BLUR, VISIBLE MOVEMENT) */}
        {/* ================================================================= */}
        <AnimatedEnvironment
          environmentId={activeEnvironmentId}
          isPlaying={isPlaying}
        />

        {/* ================================================================= */}
        {/* 2. TOP BAR: MINIMIZE BUTTON, ENVIRONMENT PILL SELECTOR, FAVORITE */}
        {/*    (Highest stacking context: z-50 to guarantee dropdown is on top)*/}
        {/* ================================================================= */}
        <div className="relative z-50 w-full max-w-lg mx-auto px-4 flex items-center justify-between flex-shrink-0">
          {/* Minimize Chevron */}
          <button
            type="button"
            onClick={closeFullScreen}
            aria-label="Minimize Player"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/95 border border-white/15 backdrop-blur-md active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <ChevronDown className="w-6 h-6 stroke-[2.5]" />
          </button>

          {/* ENVIRONMENT PILL SELECTOR (REFERENCE STYLE: [ 🌧️ Rain ▾ ]) */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowEnvDropdown(!showEnvDropdown)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/25 backdrop-blur-md text-xs font-bold text-white shadow-2xl active:scale-95 transition-all cursor-pointer ring-1 ring-white/10"
            >
              <CurrentEnvIcon className="w-3.5 h-3.5 text-sky-300" />
              <span>{activeEnvironment?.name}</span>
              <span className="text-[10px] text-slate-300">▼</span>
              {isAutoBackground && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" title="Auto Background enabled" />
              )}
            </button>

            {/* FLOATING ENVIRONMENT SELECTION DROPDOWN MENU */}
            {showEnvDropdown && (
              <>
                {/* Backdrop overlay to close when clicking outside */}
                <div 
                  className="fixed inset-0 z-40 bg-black/30" 
                  onClick={() => setShowEnvDropdown(false)} 
                />

                <div 
                  className="absolute top-12 left-1/2 -translate-x-1/2 w-72 bg-slate-950/98 border border-slate-700/90 rounded-2xl p-2.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-2xl z-50 flex flex-col gap-1 animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between px-2.5 py-1.5 border-b border-slate-800 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Choose Environment</span>
                    <button 
                      type="button"
                      onClick={() => setShowEnvDropdown(false)}
                      className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* 6 Environments list */}
                  <div className="flex flex-col gap-1 py-1">
                    {ENVIRONMENTS.map((env) => {
                      const Icon = getEnvIcon(env.icon);
                      const isSelected = activeEnvironmentId === env.id;

                      return (
                        <button
                          key={env.id}
                          type="button"
                          onClick={() => {
                            setEnvironment(env.id);
                            setShowEnvDropdown(false);
                          }}
                          className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                            isSelected 
                              ? 'bg-sky-500/25 text-sky-200 border border-sky-500/50 shadow-sm' 
                              : 'text-slate-200 hover:bg-white/15 hover:text-white border border-transparent'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-sky-500/20 text-sky-300' : 'bg-slate-800 text-slate-400'}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex flex-col text-left">
                              <span className="font-bold">{env.name}</span>
                              <span className="text-[10px] text-slate-400 font-normal">{env.tagline}</span>
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-sky-400 stroke-[3]" />}
                        </button>
                      );
                    })}
                  </div>

                  {/* Auto Rotate Toggle */}
                  <div className="pt-2 border-t border-slate-800 mt-0.5">
                    <button
                      type="button"
                      onClick={() => {
                        toggleAutoBackground();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 hover:bg-white/15 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2">
                        <Shuffle className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Auto Rotate on Next Surah</span>
                      </div>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        isAutoBackground ? 'bg-emerald-500/30 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-400'
                      }`}>
                        {isAutoBackground ? 'ACTIVE' : 'OFF'}
                      </span>
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Favorite Heart Button */}
          <button
            type="button"
            onClick={() => toggleFavoriteSurah(currentSurah.id)}
            aria-label="Favorite Surah"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/95 border border-white/15 backdrop-blur-md active:scale-95 transition-all shadow-lg cursor-pointer"
          >
            <Heart
              className={`w-5 h-5 transition-transform duration-200 ${
                isFav ? 'fill-rose-500 text-rose-500 scale-110' : 'text-white/90'
              }`}
            />
          </button>
        </div>

        {/* ERROR NOTIFICATION BANNER */}
        {hasError && (
          <div className="relative z-30 mx-4 my-2 p-3 rounded-2xl bg-rose-950/90 border border-rose-500/50 backdrop-blur-md text-xs text-rose-200 flex items-center justify-between shadow-2xl">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage || "Audio streaming issue."}</span>
            </div>
            <button
              type="button"
              onClick={() => playSurah(currentSurahId, currentReciterId)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-500 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* ================================================================= */}
        {/* 3. CENTERPIECE: SURAH INFORMATION FLOATING DIRECTLY OVER SCENERY */}
        {/*    (z-10 so top bar dropdown z-50 never gets overlapped by text)  */}
        {/* ================================================================= */}
        <div className="relative z-10 w-full max-w-lg mx-auto px-6 flex-1 min-h-0 flex flex-col items-center justify-center text-center my-auto py-2">
          {/* Bismillah Header (except for Surah 9 At-Tawbah) */}
          {currentSurah.id !== 9 && (
            <div 
              className="text-base sm:text-xl font-arabic text-amber-200/95 mb-4 tracking-widest select-none"
              style={{
                textShadow: '0 2px 14px rgba(0, 0, 0, 0.95), 0 0 4px rgba(0, 0, 0, 1)'
              }}
            >
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}

          {/* Large Floating Arabic Calligraphy Surah Name */}
          <div className="my-2">
            <h1 
              className="text-5xl sm:text-7xl font-arabic font-bold text-white tracking-normal"
              style={{
                textShadow: '0 4px 24px rgba(0, 0, 0, 0.95), 0 1px 6px rgba(0, 0, 0, 1)'
              }}
            >
              {currentSurah.name_ar}
            </h1>
          </div>

          {/* Transliterated English Surah Name */}
          <h2 
            className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1"
            style={{
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.9), 0 1px 4px rgba(0, 0, 0, 1)'
            }}
          >
            {currentSurah.name_en}
          </h2>

          {/* Surah Meaning & Details */}
          <p 
            className="text-sm font-medium text-slate-100/95 mt-1"
            style={{
              textShadow: '0 2px 10px rgba(0, 0, 0, 0.9)'
            }}
          >
            "{currentSurah.translation}" &bull; {currentSurah.verses} Verses &bull; {currentSurah.type}
          </p>

          {/* Floating Reciter Badge */}
          <div className="mt-4 inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-black/45 border border-white/20 backdrop-blur-md shadow-2xl">
            <img
              src={currentReciter.avatar}
              alt={currentReciter.name_en}
              className="w-5 h-5 rounded-full object-cover border border-sky-400/60"
            />
            <span 
              className="text-xs font-bold text-white"
              style={{ textShadow: '0 1px 6px rgba(0, 0, 0, 0.8)' }}
            >
              {currentReciter.name_en}
            </span>
          </div>

          {/* Subtle Live Audio Visualizer Bars */}
          {isPlaying && (
            <div className="mt-4 flex items-center justify-center">
              <WaveVisualizer isPlaying={true} barCount={5} color="bg-sky-300" />
            </div>
          )}
        </div>

        {/* ================================================================= */}
        {/* 4. FLOATING AUDIO MIXING PANEL (POPOVER OVERLAY, NEVER PUSHES CONTROLS) */}
        {/* ================================================================= */}
        {showVolumeMixer && (
          <>
            {/* Transparent backdrop so clicking outside closes it */}
            <div 
              className="fixed inset-0 z-30 bg-black/40 backdrop-blur-[2px]"
              onClick={() => setShowVolumeMixer(false)}
            />
            <div 
              className="absolute bottom-[145px] sm:bottom-[155px] left-4 right-4 max-w-lg mx-auto z-40 animate-fadeIn"
              onClick={(e) => e.stopPropagation()}
            >
              <DualVolumeControl 
                compact={true} 
                onClose={() => setShowVolumeMixer(false)} 
              />
            </div>
          </>
        )}

        {/* ================================================================= */}
        {/* 5. BOTTOM SECTION: PROGRESS BAR & TOUCH CONTROLS FLOATING OVER SCENE */}
        {/*    (flex-shrink-0 guarantees controls never get pushed off screen) */}
        {/* ================================================================= */}
        <div className="relative z-20 w-full max-w-lg mx-auto px-6 pb-2 flex flex-col gap-3.5 flex-shrink-0">
          {/* Progress Bar & Timestamps */}
          <div className="flex flex-col gap-1.5">
            <div className="relative w-full h-6 flex items-center group cursor-pointer">
              {/* Buffer track */}
              <div className="absolute left-0 right-0 h-1.5 rounded-full bg-white/25 overflow-hidden shadow-inner">
                <div
                  className="h-full bg-white/35 transition-all duration-300"
                  style={{ width: `${bufferedPercent}%` }}
                />
              </div>

              {/* Played track */}
              <div 
                className="absolute left-0 h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 pointer-events-none shadow-glow"
                style={{ width: `${progressPercent}%` }}
              />

              {/* Slider Input */}
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.5"
                value={currentTime}
                onChange={(e) => seek(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />

              {/* Handle Thumb */}
              <div
                className="absolute w-4 h-4 rounded-full bg-white shadow-[0_0_12px_rgba(56,189,248,0.9)] pointer-events-none -ml-2 transition-transform group-hover:scale-125"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <div 
              className="flex items-center justify-between text-xs text-white/95 font-mono font-medium"
              style={{ textShadow: '0 1px 8px rgba(0, 0, 0, 0.95)' }}
            >
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* MAIN CONTROLS ROW */}
          <div className="flex items-center justify-between gap-1 py-1">
            {/* Speed Pill (e.g. 1x) */}
            <button
              type="button"
              onClick={cycleSpeed}
              aria-label="Change Speed"
              title="Playback Speed"
              className="px-2.5 py-1 rounded-xl text-xs font-mono font-bold bg-black/45 hover:bg-black/65 text-sky-300 border border-white/15 backdrop-blur-md shadow-md active:scale-95 transition-all cursor-pointer"
            >
              {playbackRate}x
            </button>

            {/* Rewind 10 seconds */}
            <button
              type="button"
              onClick={() => skipTime(-10)}
              aria-label="Rewind 10 Seconds"
              className="p-2.5 rounded-full text-white/90 hover:text-white active:scale-90 transition-transform relative group cursor-pointer"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}
            >
              <RotateCcw className="w-5 h-5" />
              <span className="absolute text-[8px] font-bold top-3 left-3 text-white">10</span>
            </button>

            {/* Previous Surah */}
            <button
              type="button"
              onClick={playPrevious}
              aria-label="Previous Surah"
              className="p-3 rounded-full text-white hover:text-sky-300 active:scale-90 transition-transform cursor-pointer"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}
            >
              <SkipBack className="w-6 h-6 fill-white" />
            </button>

            {/* Stop Button (Halts playback completely and resets to beginning) */}
            <button
              type="button"
              onClick={stopAudio}
              aria-label="Stop Recitation"
              title="Stop and reset to beginning"
              className="w-11 h-11 rounded-full flex items-center justify-center bg-black/45 hover:bg-rose-500/25 text-white/90 hover:text-rose-400 border border-white/20 hover:border-rose-400/50 backdrop-blur-md shadow-lg active:scale-90 transition-all cursor-pointer"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            {/* MAIN PLAY / PAUSE BUTTON (PROMINENT, FLOATING, TOUCH-FRIENDLY) */}
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause Recitation" : "Play Recitation"}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center bg-white text-slate-950 shadow-[0_0_35px_rgba(255,255,255,0.45)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-slate-950" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8 fill-slate-950" />
              ) : (
                <Play className="w-8 h-8 fill-slate-950 translate-x-0.5" />
              )}
            </button>

            {/* Next Surah */}
            <button
              type="button"
              onClick={playNext}
              aria-label="Next Surah"
              className="p-3 rounded-full text-white hover:text-sky-300 active:scale-90 transition-transform cursor-pointer"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}
            >
              <SkipForward className="w-6 h-6 fill-white" />
            </button>

            {/* Fast-Forward 10 seconds */}
            <button
              type="button"
              onClick={() => skipTime(10)}
              aria-label="Skip Forward 10 Seconds"
              className="p-2.5 rounded-full text-white/90 hover:text-white active:scale-90 transition-transform relative group cursor-pointer"
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}
            >
              <RotateCw className="w-5 h-5" />
              <span className="absolute text-[8px] font-bold top-3 left-3 text-white">10</span>
            </button>

            {/* Repeat Mode Toggle */}
            <button
              type="button"
              onClick={cycleRepeat}
              aria-label="Cycle Repeat Mode"
              title={`Repeat: ${repeatMode}`}
              className={`p-2.5 rounded-full transition-all cursor-pointer ${
                repeatMode !== 'off' 
                  ? 'text-sky-300 bg-sky-500/25 border border-sky-400/40' 
                  : 'text-white/80 hover:text-white'
              }`}
              style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))' }}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>
          </div>

          {/* SECONDARY UTILITIES ROW: Floating Audio Mixing Trigger & Settings */}
          <div className="flex items-center justify-between pt-1 border-t border-white/15">
            <button
              type="button"
              onClick={() => setShowVolumeMixer(!showVolumeMixer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                showVolumeMixer 
                  ? 'bg-sky-500/30 text-sky-200 border border-sky-400/60' 
                  : 'bg-black/45 text-white hover:bg-black/65 border border-white/20 backdrop-blur-md'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5 text-sky-300" />
              <span>Audio Mixing</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-full text-white/90 hover:text-white bg-black/45 hover:bg-black/65 border border-white/20 backdrop-blur-md transition-colors shadow-md cursor-pointer"
              title="Share Surah"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold bg-black/45 text-white hover:bg-black/65 border border-white/20 backdrop-blur-md transition-all shadow-md cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-300" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODAL: AUDIO & PLAYBACK SETTINGS */}
      <AudioSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
};

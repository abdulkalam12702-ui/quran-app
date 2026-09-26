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
  Image as ImageIcon, 
  Volume2, 
  VolumeX, 
  Loader2, 
  AlertCircle,
  Share2
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { usePreferences } from '../context/PreferencesContext';
import { formatTime } from '../utils/formatters';
import { WaveVisualizer } from './WaveVisualizer';
import { BackgroundSelectorModal } from './BackgroundSelectorModal';
import { AudioSettingsModal } from './AudioSettingsModal';
import { DualVolumeControl } from './DualVolumeControl';

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
    isFullScreenOpen,
    closeFullScreen,
    activeVisual,
    playbackRate,
    setPlaybackRate,
    repeatMode,
    setRepeatMode,
    playSurah,
    currentSurahId,
    currentReciterId,
  } = useAudio();

  const { isFavoriteSurah, toggleFavoriteSurah } = usePreferences();

  const [showBgModal, setShowBgModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showVolumeMixer, setShowVolumeMixer] = useState(false);

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
        // Share cancelled or unsupported
      }
    }
  };

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex flex-col justify-between overflow-hidden bg-slate-950 animate-fadeIn select-none"
        style={{
          paddingTop: 'env(safe-area-inset-top, 16px)',
          paddingBottom: 'env(safe-area-inset-bottom, 16px)',
        }}
      >
        {/* IMMERSIVE BACKGROUND VISUAL WITH SMOOTH FADE */}
        <div className="absolute inset-0 z-0">
          <img
            src={activeVisual?.url}
            alt={activeVisual?.name || "Player Background"}
            className="w-full h-full object-cover object-center transform scale-105 transition-all duration-1000 ease-out"
          />
          {/* Multi-layered dark & blurred transparent overlay for ultimate readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/80 via-slate-950/65 to-slate-950/95 backdrop-blur-[6px]" />
          {/* Subtle vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(7,11,19,0.85)_100%)]" />
        </div>

        {/* TOP BAR / NAVIGATION */}
        <div className="relative z-10 w-full max-w-lg mx-auto px-4 pt-3 flex items-center justify-between">
          <button
            type="button"
            onClick={closeFullScreen}
            aria-label="Minimize Player"
            className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/90 border border-white/10 backdrop-blur-md active:scale-95 transition-all"
          >
            <ChevronDown className="w-6 h-6 stroke-[2.5]" />
          </button>

          <div className="flex flex-col items-center">
            <span className="text-[10px] tracking-widest uppercase font-semibold text-sky-400/90 flex items-center gap-1.5">
              <span>NOW RECITING</span>
              {isPlaying && <WaveVisualizer isPlaying={true} barCount={3} color="bg-sky-400" />}
            </span>
            <span className="text-xs font-medium text-slate-300">
              Surah {currentSurah.id} of 114
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {/* Background Image Selector Button */}
            <button
              type="button"
              onClick={() => setShowBgModal(true)}
              aria-label="Change Background"
              title="Change Background"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/90 border border-white/10 backdrop-blur-md active:scale-95 transition-all"
            >
              <ImageIcon className="w-4 h-4 text-sky-300" />
            </button>

            {/* Favorite Button */}
            <button
              type="button"
              onClick={() => toggleFavoriteSurah(currentSurah.id)}
              aria-label="Favorite Surah"
              className="w-10 h-10 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/60 text-white/90 border border-white/10 backdrop-blur-md active:scale-95 transition-all"
            >
              <Heart
                className={`w-5 h-5 transition-transform duration-200 ${
                  isFav ? 'fill-rose-500 text-rose-500 scale-110' : 'text-slate-300'
                }`}
              />
            </button>
          </div>
        </div>

        {/* ERROR NOTIFICATION BANNER */}
        {hasError && (
          <div className="relative z-10 mx-4 my-2 p-3 rounded-2xl bg-rose-950/80 border border-rose-500/50 backdrop-blur-md text-xs text-rose-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
              <span>{errorMessage || "Audio streaming issue."}</span>
            </div>
            <button
              type="button"
              onClick={() => playSurah(currentSurahId, currentReciterId)}
              className="px-2.5 py-1 rounded-lg bg-rose-600 text-white text-[11px] font-semibold hover:bg-rose-500"
            >
              Retry
            </button>
          </div>
        )}

        {/* CENTERPIECE: SURAH CALLIGRAPHY & DETAILS */}
        <div className="relative z-10 w-full max-w-lg mx-auto px-6 flex-1 flex flex-col items-center justify-center text-center my-auto py-2">
          {/* Bismillah Header (except for Surah 9 At-Tawbah) */}
          {currentSurah.id !== 9 && (
            <div className="text-base sm:text-lg font-arabic text-amber-200/80 mb-3 tracking-wider select-none">
              بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ
            </div>
          )}

          {/* Central Artwork / Geometric Emblem */}
          <div className="relative group my-3">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl p-1 bg-gradient-to-tr from-sky-500/30 via-indigo-500/20 to-amber-500/30 border border-white/15 backdrop-blur-xl shadow-2xl flex items-center justify-center relative overflow-hidden">
              {/* Rotating soft inner ring */}
              <div className={`absolute inset-0 bg-gradient-to-r from-sky-500/10 to-indigo-500/10 rounded-3xl ${isPlaying ? 'animate-pulse-slow' : ''}`} />
              
              <div className="flex flex-col items-center justify-center p-4 text-center z-10">
                <span className="text-4xl sm:text-5xl font-arabic font-bold text-amber-300 drop-shadow-[0_2px_15px_rgba(245,158,11,0.5)]">
                  {currentSurah.name_ar}
                </span>
                <span className="mt-2 text-xs font-mono font-medium text-sky-300/90 tracking-widest uppercase">
                  Surah {currentSurah.id}
                </span>
              </div>
            </div>
          </div>

          {/* Surah Name & Meaning */}
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight drop-shadow-md">
            {currentSurah.name_en}
          </h2>
          <p className="text-sm font-medium text-slate-300/90 mt-1">
            "{currentSurah.translation}" &bull; {currentSurah.verses} Verses &bull; {currentSurah.type}
          </p>

          {/* Reciter Badge */}
          <div className="mt-3.5 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 border border-slate-700/60 backdrop-blur-md">
            <img
              src={currentReciter.avatar}
              alt={currentReciter.name_en}
              className="w-5 h-5 rounded-full object-cover border border-sky-400/40"
            />
            <span className="text-xs font-semibold text-slate-200">
              {currentReciter.name_en}
            </span>
          </div>
        </div>

        {/* FLOATING QUICK VOLUME MIXER ACCORDION */}
        {showVolumeMixer && (
          <div className="relative z-20 w-full max-w-lg mx-auto px-4 mb-3 animate-fadeIn">
            <DualVolumeControl compact={true} />
          </div>
        )}

        {/* BOTTOM SECTION: PROGRESS BAR & CONTROLS */}
        <div className="relative z-10 w-full max-w-lg mx-auto px-6 pb-4 sm:pb-6 flex flex-col gap-4">
          {/* Progress Bar & Timestamps */}
          <div className="flex flex-col gap-1.5">
            <div className="relative w-full h-6 flex items-center group cursor-pointer">
              {/* Buffer track */}
              <div className="absolute left-0 right-0 h-1.5 rounded-full bg-white/15 overflow-hidden">
                <div
                  className="h-full bg-white/20 transition-all duration-300"
                  style={{ width: `${bufferedPercent}%` }}
                />
              </div>

              {/* Played track */}
              <div 
                className="absolute left-0 h-1.5 rounded-full bg-gradient-to-r from-sky-400 to-indigo-500 pointer-events-none"
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
                className="absolute w-3.5 h-3.5 rounded-full bg-white shadow-glow pointer-events-none -ml-1.5 transition-transform group-hover:scale-125"
                style={{ left: `${progressPercent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-300 font-mono">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* MAIN CONTROLS ROW */}
          <div className="flex items-center justify-between gap-2 py-1">
            {/* Repeat Mode Toggle */}
            <button
              type="button"
              onClick={cycleRepeat}
              aria-label="Cycle Repeat Mode"
              title={`Repeat: ${repeatMode}`}
              className={`p-2.5 rounded-full transition-colors ${
                repeatMode !== 'off' ? 'text-indigo-400 bg-indigo-500/20' : 'text-slate-400 hover:text-white'
              }`}
            >
              {repeatMode === 'one' ? <Repeat1 className="w-5 h-5" /> : <Repeat className="w-5 h-5" />}
            </button>

            {/* Rewind 10 seconds */}
            <button
              type="button"
              onClick={() => skipTime(-10)}
              aria-label="Rewind 10 Seconds"
              className="p-2.5 rounded-full text-slate-300 hover:text-white active:scale-90 transition-transform relative group"
            >
              <RotateCcw className="w-5 h-5" />
              <span className="absolute text-[8px] font-bold top-3 left-3 text-slate-300">10</span>
            </button>

            {/* Previous Surah */}
            <button
              type="button"
              onClick={playPrevious}
              aria-label="Previous Surah"
              className="p-3 rounded-full text-white hover:bg-white/10 active:scale-90 transition-transform"
            >
              <SkipBack className="w-6 h-6 fill-white" />
            </button>

            {/* MAIN PLAY / PAUSE BUTTON (PROMINENT & LARGE) */}
            <button
              type="button"
              onClick={togglePlayPause}
              aria-label={isPlaying ? "Pause Recitation" : "Play Recitation"}
              className="w-16 h-16 sm:w-18 sm:h-18 rounded-full flex items-center justify-center bg-gradient-to-tr from-sky-400 via-sky-500 to-indigo-600 text-white shadow-[0_0_35px_rgba(56,189,248,0.5)] hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {isLoading ? (
                <Loader2 className="w-8 h-8 animate-spin text-white" />
              ) : isPlaying ? (
                <Pause className="w-8 h-8 fill-white" />
              ) : (
                <Play className="w-8 h-8 fill-white translate-x-0.5" />
              )}
            </button>

            {/* Next Surah */}
            <button
              type="button"
              onClick={playNext}
              aria-label="Next Surah"
              className="p-3 rounded-full text-white hover:bg-white/10 active:scale-90 transition-transform"
            >
              <SkipForward className="w-6 h-6 fill-white" />
            </button>

            {/* Fast-Forward 10 seconds */}
            <button
              type="button"
              onClick={() => skipTime(10)}
              aria-label="Skip Forward 10 Seconds"
              className="p-2.5 rounded-full text-slate-300 hover:text-white active:scale-90 transition-transform relative group"
            >
              <RotateCw className="w-5 h-5" />
              <span className="absolute text-[8px] font-bold top-3 left-3 text-slate-300">10</span>
            </button>

            {/* Playback Speed Quick Cycle */}
            <button
              type="button"
              onClick={cycleSpeed}
              aria-label="Change Speed"
              title="Playback Speed"
              className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-white/10 hover:bg-white/20 text-sky-300 border border-white/10"
            >
              {playbackRate}x
            </button>
          </div>

          {/* SECONDARY UTILITIES ROW: Volume Mixer Toggle, Audio Settings, Share */}
          <div className="flex items-center justify-between pt-1 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowVolumeMixer(!showVolumeMixer)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                showVolumeMixer 
                  ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40' 
                  : 'bg-black/30 text-slate-300 hover:text-white hover:bg-black/50 border border-white/10'
              }`}
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>Audio Mixing</span>
            </button>

            <button
              type="button"
              onClick={handleShare}
              className="p-2 rounded-xl text-slate-300 hover:text-white hover:bg-black/30 transition-colors"
              title="Share Surah"
            >
              <Share2 className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => setShowSettingsModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-black/30 text-slate-300 hover:text-white hover:bg-black/50 border border-white/10"
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* MODALS */}
      <BackgroundSelectorModal
        isOpen={showBgModal}
        onClose={() => setShowBgModal(false)}
      />

      <AudioSettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
};

import React from 'react';
import { Volume2, VolumeX, CloudRain, Waves, Wind, Droplets, Sparkles, Volume1, X } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { AMBIENT_SOUNDS } from '../data/ambientSoundsData';

export const DualVolumeControl = ({ compact = false, onClose }) => {
  const {
    quranVolume,
    setQuranVolume,
    isQuranMuted,
    toggleMuteQuran,
    ambientSound,
    setAmbientSound,
    ambientVolume,
    setAmbientVolume,
    isAmbientMuted,
    toggleMuteAmbient,
  } = useAudio();

  const getAmbientIcon = (id) => {
    switch (id) {
      case 'rain': return CloudRain;
      case 'ocean': return Waves;
      case 'wind': return Wind;
      case 'stream': return Droplets;
      case 'pad': return Sparkles;
      default: return VolumeX;
    }
  };

  const CurrentAmbientIcon = getAmbientIcon(ambientSound);

  return (
    <div className={`w-full rounded-2xl glass-panel p-4 flex flex-col gap-3.5 border border-theme-border bg-theme-card/95 shadow-xl ${compact ? 'text-xs' : 'text-sm'}`}>
      <div className="flex items-center justify-between border-b border-theme-border pb-2.5">
        <span className="font-semibold text-theme-primary tracking-wide flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-theme-accent" />
          Independent Audio Mixing
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-theme-muted hidden xs:inline">
            Quran & Ambient Blend
          </span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              aria-label="Close mixer"
              className="p-1 rounded-lg text-theme-muted hover:text-theme-primary hover:bg-theme-surface transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 1. QURAN RECITATION VOLUME */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-theme-accent font-medium">
            <Volume2 className="w-3.5 h-3.5" />
            <span>Quran Recitation</span>
          </div>
          <span className="text-theme-muted font-mono text-[11px]">
            {isQuranMuted ? 'Muted' : `${Math.round(quranVolume * 100)}%`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMuteQuran}
            aria-label="Toggle Quran Mute"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              isQuranMuted ? 'bg-rose-500/20 text-rose-400' : 'bg-theme-surface text-theme-accent hover:bg-theme-card-hover border border-theme-border'
            }`}
          >
            {isQuranMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={isQuranMuted ? 0 : quranVolume}
              onChange={(e) => {
                if (isQuranMuted) toggleMuteQuran();
                setQuranVolume(parseFloat(e.target.value));
              }}
              className="w-full h-2 rounded-lg bg-theme-surface accent-theme-accent cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--theme-accent) 0%, var(--theme-accent) ${(isQuranMuted ? 0 : quranVolume) * 100}%, var(--theme-border) ${(isQuranMuted ? 0 : quranVolume) * 100}%, var(--theme-border) 100%)`
              }}
            />
          </div>
        </div>
      </div>

      {/* 2. BACKGROUND AMBIENT SOUND VOLUME */}
      <div className="flex flex-col gap-1.5 pt-1">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-amber-400 font-medium">
            <CurrentAmbientIcon className="w-3.5 h-3.5" />
            <span>Background Ambience ({ambientSound === 'none' ? 'Off' : AMBIENT_SOUNDS.find(s => s.id === ambientSound)?.name})</span>
          </div>
          <span className="text-theme-muted font-mono text-[11px]">
            {ambientSound === 'none' || isAmbientMuted ? 'Off / Muted' : `${Math.round(ambientVolume * 100)}%`}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleMuteAmbient}
            disabled={ambientSound === 'none'}
            aria-label="Toggle Ambient Sound Mute"
            className={`p-2 rounded-xl transition-colors cursor-pointer ${
              ambientSound === 'none' 
                ? 'opacity-40 cursor-not-allowed bg-theme-surface text-theme-muted' 
                : isAmbientMuted 
                  ? 'bg-rose-500/20 text-rose-400' 
                  : 'bg-theme-surface text-amber-400 hover:bg-theme-card-hover border border-theme-border'
            }`}
          >
            {isAmbientMuted || ambientSound === 'none' ? <VolumeX className="w-4 h-4" /> : <Volume1 className="w-4 h-4" />}
          </button>

          <div className="flex-1 relative flex items-center">
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={ambientSound === 'none' || isAmbientMuted ? 0 : ambientVolume}
              disabled={ambientSound === 'none'}
              onChange={(e) => {
                if (isAmbientMuted) toggleMuteAmbient();
                setAmbientVolume(parseFloat(e.target.value));
              }}
              className="w-full h-2 rounded-lg bg-theme-surface accent-amber-400 cursor-pointer disabled:opacity-40"
              style={{
                background: ambientSound === 'none' || isAmbientMuted 
                  ? 'var(--theme-border)' 
                  : `linear-gradient(to right, #f59e0b 0%, #fbbf24 ${ambientVolume * 100}%, var(--theme-border) ${ambientVolume * 100}%, var(--theme-border) 100%)`
              }}
            />
          </div>
        </div>

        {/* Ambient Sound Selector Chips */}
        <div className="mt-1 flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {AMBIENT_SOUNDS.map((sound) => {
            const Icon = getAmbientIcon(sound.id);
            const isSelected = ambientSound === sound.id;

            return (
              <button
                key={sound.id}
                type="button"
                onClick={() => setAmbientSound(sound.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm font-semibold'
                    : 'bg-theme-surface text-theme-muted hover:text-theme-primary hover:bg-theme-card-hover border border-theme-border'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sound.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

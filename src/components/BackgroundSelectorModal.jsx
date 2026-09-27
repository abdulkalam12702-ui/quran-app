import React from 'react';
import { 
  X, 
  Check, 
  Mountain, 
  CloudRain, 
  Waves, 
  Moon, 
  Trees, 
  Sunset,
  Flame,
  Sparkles,
  Shuffle,
  Volume2
} from 'lucide-react';
import { ENVIRONMENTS } from '../data/backgroundVisualsData';
import { useAudio } from '../context/AudioContext';

export const BackgroundSelectorModal = ({ isOpen, onClose }) => {
  const { 
    activeEnvironmentId, 
    setEnvironment, 
    isAutoBackground, 
    toggleAutoBackground 
  } = useAudio();

  if (!isOpen) return null;

  const getEnvIcon = (iconName) => {
    switch (iconName) {
      case 'Mountain': return Mountain;
      case 'CloudRain': return CloudRain;
      case 'Waves': return Waves;
      case 'Moon': return Moon;
      case 'Trees': return Trees;
      case 'Sunset': return Sunset;
      case 'Flame': return Flame;
      default: return Sparkles;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-lg bg-theme-card border border-theme-border rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-theme-border">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-theme-surface text-theme-accent border border-theme-border">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-theme-primary">Animated Environments</h3>
              <p className="text-xs text-theme-muted">Choose a peaceful living recitation scene</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="p-2 rounded-full hover:bg-theme-surface text-theme-muted hover:text-theme-primary transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AUTO BACKGROUND VS MANUAL TOGGLE */}
        <div className="pt-3 pb-2">
          <div className="flex items-center justify-between p-3 rounded-2xl bg-theme-surface border border-theme-border">
            <div className="flex items-center gap-2.5">
              <div className={`p-2 rounded-xl ${isAutoBackground ? 'bg-theme-accent/20 text-theme-accent' : 'bg-theme-card text-theme-muted'}`}>
                <Shuffle className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-theme-primary">
                  {isAutoBackground ? "Auto Background: Active" : "Manual Environment Selected"}
                </h4>
                <p className="text-[11px] text-theme-muted">
                  {isAutoBackground 
                    ? "Environments smoothly rotate across Surahs" 
                    : "Locks player to your selected environment"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={toggleAutoBackground}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                isAutoBackground
                  ? 'bg-theme-accent text-slate-950 font-bold shadow-md shadow-theme-accent/20'
                  : 'bg-theme-card text-theme-secondary hover:bg-theme-card-hover border border-theme-border'
              }`}
            >
              {isAutoBackground ? 'Auto ON' : 'Turn Auto ON'}
            </button>
          </div>
        </div>

        {/* ENVIRONMENTS GRID */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto py-2 px-1 pr-1.5 scrollbar-thin">
          {ENVIRONMENTS.map((env) => {
            const isSelected = activeEnvironmentId === env.id;
            const Icon = getEnvIcon(env.icon);

            return (
              <button
                key={env.id}
                type="button"
                onClick={() => {
                  setEnvironment(env.id);
                }}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 aspect-[4/3] focus:outline-none cursor-pointer ${
                  isSelected
                    ? 'border-theme-accent shadow-lg scale-[1.02]'
                    : 'border-theme-border hover:border-theme-accent/60 opacity-80 hover:opacity-100'
                }`}
              >
                {/* Thumbnail Image */}
                <img
                  src={env.thumb}
                  alt={env.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Dark Gradient Overlay for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-black/30" />

                {/* Selected Checkmark Badge */}
                {isSelected && (
                  <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg animate-pulse">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                {/* Environment Icon Badge */}
                <div className="absolute top-2.5 left-2.5 p-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-white/10 text-white">
                  <Icon className="w-3.5 h-3.5" />
                </div>

                {/* Bottom Details */}
                <div className="absolute bottom-2.5 left-2.5 right-2.5 flex flex-col">
                  <span className="text-xs font-bold text-white drop-shadow-md truncate">
                    {env.name}
                  </span>
                  <span className="text-[10px] text-slate-300/90 truncate mt-0.5">
                    {env.tagline}
                  </span>
                  <span className="text-[9px] text-amber-300 font-medium flex items-center gap-1 mt-1 truncate">
                    <Volume2 className="w-2.5 h-2.5 flex-shrink-0" />
                    <span>{env.ambientName}</span>
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="pt-3 border-t border-slate-800 text-center">
          <p className="text-[11px] text-slate-400">
            Selected environment plays with living clouds, wind, and particle motion.
          </p>
        </div>
      </div>
    </div>
  );
};

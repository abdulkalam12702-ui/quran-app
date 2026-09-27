import React from 'react';
import { Heart, Mic2, Play, Check } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { usePreferences } from '../context/PreferencesContext';

export const ReciterCard = ({ reciter, onSelect, isSelected = false }) => {
  const { currentReciterId } = useAudio();
  const { isFavoriteReciter, toggleFavoriteReciter } = usePreferences();

  const isCurrentActive = currentReciterId === reciter.id;
  const isFav = isFavoriteReciter(reciter.id);

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavoriteReciter(reciter.id);
  };

  return (
    <div
      onClick={() => onSelect(reciter)}
      className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex items-center justify-between border ${
        isSelected || isCurrentActive
          ? 'bg-theme-card border-theme-accent/70 shadow-[0_4px_25px_var(--theme-ring)] ring-1 ring-theme-accent/40'
          : 'bg-theme-card/80 hover:bg-theme-card-hover border-theme-border hover:border-theme-border-light shadow-sm'
      }`}
    >
      {/* Left column: Reciter Avatar & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-theme-border shadow-md">
          <img
            src={reciter.avatar}
            alt={reciter.name_en}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          {reciter.featured && (
            <div className="absolute top-1 left-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-black" />
          )}
        </div>

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-sm sm:text-base font-bold truncate transition-colors ${
              isSelected || isCurrentActive ? 'text-theme-accent' : 'text-theme-primary group-hover:text-theme-accent'
            }`}>
              {reciter.name_en}
            </h3>
            {isCurrentActive && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-theme-accent/20 text-theme-accent border border-theme-accent/30">
                ACTIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mt-0.5">
            <span className="truncate">{reciter.style}</span>
            <span>&bull;</span>
            <span>{reciter.totalSurahs} Surahs</span>
          </div>
        </div>
      </div>

      {/* Right Column: Arabic Name, Favorite, Select indicator */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        <span 
          className="hidden sm:inline font-arabic text-sm font-semibold"
          style={{ color: 'var(--theme-calligraphy)' }}
        >
          {reciter.name_ar}
        </span>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remove from favorite reciters" : "Favorite reciter"}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isFav
              ? 'text-rose-500 hover:text-rose-400'
              : 'text-theme-muted hover:text-theme-primary hover:bg-theme-surface'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isSelected || isCurrentActive
              ? 'bg-theme-accent text-slate-950 font-bold shadow-md shadow-theme-accent/20'
              : 'bg-theme-surface text-theme-secondary group-hover:bg-theme-accent group-hover:text-slate-950 border border-theme-border'
          }`}
        >
          {isSelected || isCurrentActive ? (
            <Check className="w-4 h-4 stroke-[3]" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </div>
      </div>
    </div>
  );
};

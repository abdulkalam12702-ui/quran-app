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
          ? 'bg-slate-900/90 border-sky-500/60 shadow-[0_4px_25px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/30'
          : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Left column: Reciter Avatar & Info */}
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-700 shadow-md">
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
              isSelected || isCurrentActive ? 'text-sky-300' : 'text-slate-100 group-hover:text-white'
            }`}>
              {reciter.name_en}
            </h3>
            {isCurrentActive && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-sky-500/20 text-sky-400 border border-sky-500/30">
                ACTIVE
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="truncate">{reciter.style}</span>
            <span>&bull;</span>
            <span>{reciter.totalSurahs} Surahs</span>
          </div>
        </div>
      </div>

      {/* Right Column: Arabic Name, Favorite, Select indicator */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-3">
        <span className="hidden sm:inline font-arabic text-amber-300/90 text-sm font-semibold">
          {reciter.name_ar}
        </span>

        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remove from favorite reciters" : "Favorite reciter"}
          className={`p-2 rounded-xl transition-all ${
            isFav
              ? 'text-rose-500 hover:text-rose-400'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>

        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            isSelected || isCurrentActive
              ? 'bg-sky-500 text-slate-950 shadow-md'
              : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700 group-hover:text-white'
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

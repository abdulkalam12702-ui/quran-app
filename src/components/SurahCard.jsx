import React from 'react';
import { Play, Pause, Heart, Loader2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { usePreferences } from '../context/PreferencesContext';
import { WaveVisualizer } from './WaveVisualizer';

export const SurahCard = ({ surah, onPlay }) => {
  const { currentSurahId, isPlaying, isLoading, togglePlayPause, openFullScreen } = useAudio();
  const { isFavoriteSurah, toggleFavoriteSurah, arabicSize } = usePreferences();

  const isCurrent = currentSurahId === surah.id;
  const isFav = isFavoriteSurah(surah.id);

  const handleCardClick = () => {
    if (isCurrent) {
      openFullScreen();
    } else {
      if (onPlay) onPlay(surah.id);
    }
  };

  const handlePlayButtonClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      if (onPlay) onPlay(surah.id);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavoriteSurah(surah.id);
  };

  const getArabicClass = () => {
    if (arabicSize === 'normal') return 'text-xl';
    if (arabicSize === 'xl') return 'text-3xl';
    return 'text-2xl'; // large default
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex items-center justify-between border ${
        isCurrent
          ? 'bg-slate-900/90 border-sky-500/60 shadow-[0_4px_25px_rgba(56,189,248,0.15)] ring-1 ring-sky-500/30'
          : 'bg-slate-900/50 hover:bg-slate-900/80 border-slate-800/80 hover:border-slate-700/80'
      }`}
    >
      {/* Left Column: Number Badge & Names */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Surah Number Islamic Badge */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 transition-all ${
            isCurrent
              ? 'bg-gradient-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-sky-500/30'
              : 'bg-slate-800/80 text-slate-300 group-hover:bg-slate-700/80 group-hover:text-white'
          }`}
        >
          {surah.id}
        </div>

        {/* English & Transliterated Details */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-bold truncate transition-colors ${
              isCurrent ? 'text-sky-300' : 'text-slate-100 group-hover:text-white'
            }`}>
              {surah.name_en}
            </h3>
            {isCurrent && isPlaying && (
              <WaveVisualizer isPlaying={true} barCount={3} color="bg-sky-400" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
            <span className="truncate">{surah.translation}</span>
            <span>&bull;</span>
            <span className="whitespace-nowrap">{surah.verses} Verses</span>
            <span>&bull;</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
              surah.type === 'Meccan' ? 'text-amber-400/90 bg-amber-500/10' : 'text-teal-400/90 bg-teal-500/10'
            }`}>
              {surah.type}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Arabic Calligraphy, Favorite, Play Button */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        {/* Arabic Name */}
        <span className={`font-arabic font-bold text-amber-300/95 tracking-normal ${getArabicClass()}`}>
          {surah.name_ar}
        </span>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          className={`p-2 rounded-xl transition-all ${
            isFav
              ? 'text-rose-500 hover:text-rose-400'
              : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800/50'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Play / Pause Button */}
        <button
          type="button"
          onClick={handlePlayButtonClick}
          aria-label={isCurrent && isPlaying ? "Pause Surah" : "Play Surah"}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 ${
            isCurrent && isPlaying
              ? 'bg-sky-500 text-slate-950 shadow-md shadow-sky-500/30'
              : 'bg-slate-800 text-slate-200 hover:bg-sky-500 hover:text-slate-950 group-hover:bg-slate-700'
          }`}
        >
          {isCurrent && isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-current" />
          ) : isCurrent && isPlaying ? (
            <Pause className="w-4 h-4 fill-current" />
          ) : (
            <Play className="w-4 h-4 fill-current translate-x-0.5" />
          )}
        </button>
      </div>
    </div>
  );
};

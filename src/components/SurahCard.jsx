import React from 'react';
import { Play, Pause, Heart, Loader2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { usePreferences } from '../context/PreferencesContext';
import { WaveVisualizer } from './WaveVisualizer';

export const SurahCard = ({ surah }) => {
  const { currentSurahId, isPlaying, isLoading, togglePlayPause, playSurah, selectSurah, openFullScreen } = useAudio();
  const { isFavoriteSurah, toggleFavoriteSurah } = usePreferences();

  const isCurrent = currentSurahId === surah.id;
  const isFav = isFavoriteSurah(surah.id);

  // Clicking card body selects or opens full screen without autoplaying
  const handleCardClick = () => {
    if (isCurrent) {
      openFullScreen();
    } else {
      selectSurah(surah.id);
    }
  };

  // Only explicit click on the Play/Pause button starts/toggles audio
  const handlePlayButtonClick = (e) => {
    e.stopPropagation();
    if (isCurrent) {
      togglePlayPause();
    } else {
      playSurah(surah.id);
    }
  };

  const handleFavoriteClick = (e) => {
    e.stopPropagation();
    toggleFavoriteSurah(surah.id);
  };

  return (
    <div
      onClick={handleCardClick}
      className={`group relative rounded-2xl p-4 transition-all duration-300 cursor-pointer flex items-center justify-between border ${
        isCurrent
          ? 'bg-theme-card border-theme-accent/70 shadow-[0_4px_25px_var(--theme-ring)] ring-1 ring-theme-accent/40'
          : 'bg-theme-card/80 hover:bg-theme-card-hover border-theme-border hover:border-theme-border-light shadow-sm'
      }`}
    >
      {/* Left Column: Number Badge & Names */}
      <div className="flex items-center gap-3.5 min-w-0">
        {/* Surah Number Islamic Badge */}
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center font-mono text-sm font-bold flex-shrink-0 transition-all ${
            isCurrent
              ? 'bg-theme-accent text-slate-950 font-extrabold shadow-md'
              : 'bg-theme-surface text-theme-secondary group-hover:bg-theme-card-hover group-hover:text-theme-primary border border-theme-border'
          }`}
        >
          {surah.id}
        </div>

        {/* English & Transliterated Details */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`text-base font-bold truncate transition-colors ${
              isCurrent ? 'text-theme-accent' : 'text-theme-primary group-hover:text-theme-accent'
            }`}>
              {surah.name_en}
            </h3>
            {isCurrent && isPlaying && (
              <WaveVisualizer isPlaying={true} barCount={3} color="bg-theme-accent" />
            )}
          </div>
          <div className="flex items-center gap-2 text-xs text-theme-muted mt-0.5">
            <span className="truncate">{surah.translation}</span>
            <span>&bull;</span>
            <span className="whitespace-nowrap">{surah.verses} Verses</span>
            <span>&bull;</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded font-medium ${
              surah.type === 'Meccan' ? 'text-amber-500/90 bg-amber-500/10' : 'text-teal-500/90 bg-teal-500/10'
            }`}>
              {surah.type === 'Meccan' ? 'Mecca' : 'Medina'}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: Arabic Calligraphy, Favorite, Play Button */}
      <div className="flex items-center gap-3 flex-shrink-0 ml-3">
        {/* Arabic Name */}
        <span 
          className="font-arabic font-bold text-2xl tracking-normal"
          style={{ color: 'var(--theme-calligraphy)' }}
        >
          {surah.name_ar}
        </span>

        {/* Favorite Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          aria-label={isFav ? "Remove from favorites" : "Add to favorites"}
          className={`p-2 rounded-xl transition-all cursor-pointer ${
            isFav
              ? 'text-rose-500 hover:text-rose-400'
              : 'text-theme-muted hover:text-theme-primary hover:bg-theme-surface'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Play / Pause Button */}
        <button
          type="button"
          onClick={handlePlayButtonClick}
          aria-label={isCurrent && isPlaying ? "Pause Surah" : "Play Surah"}
          title={isCurrent && isPlaying ? "Pause recitation" : "Play recitation"}
          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer ${
            isCurrent && isPlaying
              ? 'bg-theme-accent text-slate-950 shadow-md shadow-theme-accent/30'
              : 'bg-theme-surface text-theme-primary hover:bg-theme-accent hover:text-slate-950 border border-theme-border'
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

import React from 'react';
import { 
  Play, 
  Pause, 
  Square,
  BookOpen, 
  Mic2, 
  Heart, 
  Sparkles, 
  ChevronRight, 
  Clock, 
  Headphones
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { usePreferences } from '../context/PreferencesContext';
import { POPULAR_SURAHS_IDS, getSurahById } from '../data/surahsData';
import { getReciterById } from '../data/recitersData';
import { WaveVisualizer } from '../components/WaveVisualizer';

export const HomePage = ({ onNavigate }) => {
  const {
    currentSurah,
    currentReciter,
    isPlaying,
    currentTime,
    playSurah,
    selectSurah,
    togglePlayPause,
    stopAudio,
    openFullScreen,
    activeVisual,
  } = useAudio();

  const { recentlyPlayed, favoriteSurahs } = usePreferences();

  const popularSurahs = POPULAR_SURAHS_IDS.map(id => getSurahById(id));

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl animate-fadeIn">
      {/* HEADER GREETING & ISLAMIC CREST */}
      <header className="flex items-center justify-between pt-2">
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-500">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Assalamu Alaikum</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-theme-primary tracking-tight mt-0.5">
            Listen to the Holy Quran
          </h1>
        </div>

        {/* Current Reciter Quick Pill */}
        <button
          type="button"
          onClick={() => onNavigate('reciters')}
          className="flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full bg-theme-card border border-theme-border hover:border-theme-accent transition-all text-xs font-medium text-theme-secondary shadow-sm cursor-pointer"
        >
          <img
            src={currentReciter.avatar}
            alt={currentReciter.name_en}
            className="w-6 h-6 rounded-full object-cover border border-theme-accent/60"
          />
          <span className="hidden xs:inline max-w-[100px] truncate">{currentReciter.name_en.split(' ')[0]}</span>
          <ChevronRight className="w-3.5 h-3.5 text-theme-muted" />
        </button>
      </header>

      {/* HERO: CONTINUE LISTENING / NOW PLAYING BANNER */}
      <section aria-label="Continue Listening">
        <div 
          onClick={openFullScreen}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && openFullScreen()}
          className="relative group rounded-3xl overflow-hidden p-5 sm:p-6 border border-theme-border shadow-xl transition-all duration-300 hover:border-theme-accent/60 cursor-pointer"
        >
          {/* Background image preview */}
          <div className="absolute inset-0 z-0">
            <img
              src={activeVisual?.url}
              alt="Atmosphere"
              className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-950/85 to-slate-950/65 backdrop-blur-[2px]" />
          </div>

          <div className="relative z-10 flex flex-col justify-between min-h-[140px]">
            <div className="flex items-start justify-between">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-sky-300 bg-sky-500/20 px-2.5 py-1 rounded-full border border-sky-400/30">
                  <Headphones className="w-3 h-3" />
                  {isPlaying ? 'Now Playing' : 'Continue Listening'}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-white mt-2">
                  {currentSurah.name_en}
                </h2>
                <p className="text-xs text-slate-200 mt-0.5">
                  Surah {currentSurah.id} &bull; {currentSurah.verses} Verses &bull; {currentReciter.name_en}
                </p>
              </div>

              {/* Arabic Calligraphy Emblem */}
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-arabic font-bold text-amber-300 drop-shadow-md">
                  {currentSurah.name_ar}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/15">
              <div className="flex items-center gap-2">
                {isPlaying ? (
                  <WaveVisualizer isPlaying={true} barCount={4} color="bg-sky-400" />
                ) : (
                  <span className="text-xs text-slate-300">Tap to expand immersive player</span>
                )}
              </div>

              {/* Action Controls: Stop & Play/Pause */}
              <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                {/* Stop button: resets verse to 00:00 */}
                <button
                  type="button"
                  onClick={stopAudio}
                  aria-label="Stop Playback"
                  title="Stop and reset to beginning"
                  className="w-10 h-10 rounded-full flex items-center justify-center bg-black/50 hover:bg-rose-500/25 text-white/90 hover:text-rose-400 border border-white/20 active:scale-95 transition-all cursor-pointer shadow-md"
                >
                  <Square className="w-4 h-4 fill-current" />
                </button>

                {/* Play / Pause button */}
                <button
                  type="button"
                  onClick={togglePlayPause}
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                  title={isPlaying ? "Pause" : "Play"}
                  className="w-11 h-11 rounded-full flex items-center justify-center bg-white text-slate-950 shadow-lg hover:scale-105 active:scale-95 transition-transform cursor-pointer font-bold"
                >
                  {isPlaying ? (
                    <Pause className="w-5 h-5 fill-slate-950" />
                  ) : (
                    <Play className="w-5 h-5 fill-slate-950 translate-x-0.5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUICK SHORTCUTS ROW */}
      <section className="grid grid-cols-2 gap-3" aria-label="Quick Actions">
        <button
          type="button"
          onClick={() => onNavigate('quran')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-theme-card hover:bg-theme-card-hover border border-theme-border transition-all text-left group shadow-sm cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-theme-accent/15 text-theme-accent flex items-center justify-center group-hover:scale-110 transition-transform">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-theme-primary group-hover:text-theme-accent">All 114 Surahs</h4>
            <p className="text-[11px] text-theme-muted">Browse & Search</p>
          </div>
        </button>

        <button
          type="button"
          onClick={() => onNavigate('reciters')}
          className="flex items-center gap-3 p-3.5 rounded-2xl bg-theme-card hover:bg-theme-card-hover border border-theme-border transition-all text-left group shadow-sm cursor-pointer"
        >
          <div className="w-10 h-10 rounded-xl bg-indigo-500/15 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Mic2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-theme-primary group-hover:text-indigo-400">Qaris & Reciters</h4>
            <p className="text-[11px] text-theme-muted">Top World Voices</p>
          </div>
        </button>
      </section>

      {/* POPULAR SURAHS SECTION */}
      <section aria-label="Popular Surahs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-theme-primary">Popular Surahs</h3>
          </div>
          <button
            type="button"
            onClick={() => onNavigate('quran')}
            className="text-xs font-semibold text-theme-accent hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {popularSurahs.map((surah) => {
            const isCurrent = currentSurah.id === surah.id;
            return (
              <div
                key={surah.id}
                onClick={() => selectSurah(surah.id)}
                className={`relative group p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isCurrent
                    ? 'bg-theme-card border-theme-accent/70 ring-1 ring-theme-accent/40 shadow-sm'
                    : 'bg-theme-card hover:bg-theme-card-hover border-theme-border shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <span className="w-7 h-7 rounded-lg bg-theme-surface text-theme-secondary flex items-center justify-center text-xs font-mono font-bold border border-theme-border">
                    {surah.id}
                  </span>
                  <span 
                    className="font-arabic font-bold text-lg"
                    style={{ color: 'var(--theme-calligraphy)' }}
                  >
                    {surah.name_ar}
                  </span>
                </div>

                <div className="mt-4 flex items-end justify-between">
                  <div className="min-w-0 flex-1 pr-2">
                    <h4 className="text-sm font-bold text-theme-primary group-hover:text-theme-accent truncate">
                      {surah.name_en}
                    </h4>
                    <p className="text-[11px] text-theme-muted truncate mt-0.5">
                      {surah.translation}
                    </p>
                  </div>

                  {/* Explicit Play Button */}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isCurrent) {
                        togglePlayPause();
                      } else {
                        playSurah(surah.id);
                      }
                    }}
                    aria-label={`Play Surah ${surah.name_en}`}
                    title={isCurrent && isPlaying ? "Pause" : "Play"}
                    className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors cursor-pointer ${
                      isCurrent && isPlaying
                        ? 'bg-theme-accent text-slate-950 font-bold'
                        : 'bg-theme-surface hover:bg-theme-accent text-theme-secondary hover:text-slate-950 border border-theme-border'
                    }`}
                  >
                    {isCurrent && isPlaying ? (
                      <Pause className="w-3.5 h-3.5 fill-current" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* RECENTLY PLAYED SECTION */}
      {recentlyPlayed.length > 0 && (
        <section aria-label="Recently Played">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-theme-accent" />
              <h3 className="text-base font-bold text-theme-primary">Recently Played</h3>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            {recentlyPlayed.slice(0, 4).map((item, idx) => {
              const surah = getSurahById(item.surahId);
              const reciter = getReciterById(item.reciterId);
              const isCurrent = currentSurah.id === surah.id;

              return (
                <div
                  key={`${item.surahId}-${item.reciterId}-${idx}`}
                  onClick={() => selectSurah(surah.id, reciter.id)}
                  className="flex items-center justify-between p-3 rounded-2xl bg-theme-card hover:bg-theme-card-hover border border-theme-border cursor-pointer transition-all shadow-sm"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-theme-surface text-theme-secondary flex items-center justify-center text-xs font-mono font-bold flex-shrink-0 border border-theme-border">
                      {surah.id}
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="text-sm font-bold text-theme-primary truncate">
                        {surah.name_en}
                      </span>
                      <span className="text-xs text-theme-muted truncate">
                        {reciter.name_en}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span 
                      className="font-arabic font-bold text-sm"
                      style={{ color: 'var(--theme-calligraphy)' }}
                    >
                      {surah.name_ar}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          togglePlayPause();
                        } else {
                          playSurah(surah.id, reciter.id);
                        }
                      }}
                      aria-label="Play Surah"
                      title={isCurrent && isPlaying ? "Pause" : "Play"}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                        isCurrent && isPlaying
                          ? 'bg-theme-accent text-slate-950 font-bold'
                          : 'bg-theme-surface hover:bg-theme-accent text-theme-secondary hover:text-slate-950 border border-theme-border'
                      }`}
                    >
                      {isCurrent && isPlaying ? (
                        <Pause className="w-3.5 h-3.5 fill-current" />
                      ) : (
                        <Play className="w-3.5 h-3.5 fill-current translate-x-0.5" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* FAVORITES PREVIEW SECTION */}
      {favoriteSurahs.length > 0 && (
        <section aria-label="Favorites Quick Access">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <h3 className="text-base font-bold text-theme-primary">Favorite Surahs</h3>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('favorites')}
              className="text-xs font-semibold text-theme-accent hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>See All ({favoriteSurahs.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {favoriteSurahs.slice(0, 6).map((id) => {
              const surah = getSurahById(id);
              const isCurrent = currentSurah.id === surah.id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => selectSurah(surah.id)}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-2xl bg-theme-card hover:bg-theme-card-hover border whitespace-nowrap transition-all shadow-sm cursor-pointer ${
                    isCurrent ? 'border-theme-accent' : 'border-theme-border'
                  }`}
                >
                  <span className="font-mono text-xs text-theme-accent font-bold">#{surah.id}</span>
                  <span className="text-xs font-bold text-theme-primary">{surah.name_en}</span>
                  <span 
                    className="font-arabic text-xs font-semibold"
                    style={{ color: 'var(--theme-calligraphy)' }}
                  >
                    {surah.name_ar}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
};

import React, { useState, useMemo } from 'react';
import { 
  Mic2, 
  Heart, 
  ChevronLeft, 
  SearchX, 
  MapPin, 
  Music,
  CheckCircle2
} from 'lucide-react';
import { RECITERS_DATA } from '../data/recitersData';
import { SURAHS_DATA } from '../data/surahsData';
import { ReciterCard } from '../components/ReciterCard';
import { SurahCard } from '../components/SurahCard';
import { SearchBar } from '../components/SearchBar';
import { useAudio } from '../context/AudioContext';
import { usePreferences } from '../context/PreferencesContext';

export const RecitersPage = () => {
  const { currentReciterId, selectSurah } = useAudio();
  const { favoriteReciters, isFavoriteReciter, toggleFavoriteReciter, setDefaultReciterId } = usePreferences();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'featured', 'favorites'
  const [selectedReciter, setSelectedReciter] = useState(null); // When opened in detail view
  const [surahSearchQuery, setSurahSearchQuery] = useState('');

  // Filter reciters
  const filteredReciters = useMemo(() => {
    return RECITERS_DATA.filter((reciter) => {
      // Filter tab
      if (activeFilter === 'featured' && !reciter.featured) return false;
      if (activeFilter === 'favorites' && !favoriteReciters.includes(reciter.id)) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (
        reciter.name_en.toLowerCase().includes(q) ||
        reciter.name_ar.includes(q) ||
        reciter.country.toLowerCase().includes(q) ||
        reciter.style.toLowerCase().includes(q)
      );
    });
  }, [searchQuery, activeFilter, favoriteReciters]);

  // Filter surahs for selected reciter
  const reciterSurahs = useMemo(() => {
    if (!selectedReciter) return [];
    if (!surahSearchQuery.trim()) return SURAHS_DATA;
    const q = surahSearchQuery.toLowerCase().trim();
    return SURAHS_DATA.filter(s => 
      s.name_en.toLowerCase().includes(q) ||
      s.name_ar.includes(q) ||
      String(s.id) === q ||
      s.translation.toLowerCase().includes(q)
    );
  }, [selectedReciter, surahSearchQuery]);

  // IF A RECITER DETAIL VIEW IS ACTIVE:
  if (selectedReciter) {
    const isFav = isFavoriteReciter(selectedReciter.id);
    const isActiveReciter = currentReciterId === selectedReciter.id;

    return (
      <div className="flex flex-col gap-5 pb-28 pt-2 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl animate-fadeIn">
        {/* BACK BUTTON */}
        <div className="flex items-center justify-between pt-2">
          <button
            type="button"
            onClick={() => setSelectedReciter(null)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-theme-card border border-theme-border text-theme-secondary hover:text-theme-primary transition-colors text-xs font-semibold cursor-pointer shadow-sm"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>All Reciters</span>
          </button>

          <div className="flex items-center gap-2">
            {!isActiveReciter && (
              <button
                type="button"
                onClick={() => {
                  setDefaultReciterId(selectedReciter.id);
                  selectSurah(1, selectedReciter.id);
                }}
                className="px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-accent hover:text-slate-950 text-theme-accent border border-theme-border text-xs font-semibold transition-all cursor-pointer"
              >
                Set as Default Qari
              </button>
            )}

            <button
              type="button"
              onClick={() => toggleFavoriteReciter(selectedReciter.id)}
              className={`p-2 rounded-xl border transition-all cursor-pointer ${
                isFav 
                  ? 'bg-rose-500/10 border-rose-500/40 text-rose-500' 
                  : 'bg-theme-card border-theme-border text-theme-muted hover:text-theme-primary'
              }`}
            >
              <Heart className={`w-4 h-4 ${isFav ? 'fill-rose-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* RECITER HERO HEADER */}
        <div className="relative rounded-3xl overflow-hidden p-6 border border-theme-border shadow-xl bg-theme-card">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <img
              src={selectedReciter.avatar}
              alt={selectedReciter.name_en}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-theme-accent/40 shadow-lg"
            />
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h2 className="text-xl sm:text-2xl font-bold text-theme-primary">
                  {selectedReciter.name_en}
                </h2>
                {isActiveReciter && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-md bg-theme-accent/20 text-theme-accent border border-theme-accent/30">
                    <CheckCircle2 className="w-3 h-3" />
                    ACTIVE QARI
                  </span>
                )}
              </div>

              <div 
                className="font-arabic font-bold text-lg mt-0.5"
                style={{ color: 'var(--theme-calligraphy)' }}
              >
                {selectedReciter.name_ar}
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-xs text-theme-muted mt-2">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-theme-accent" />
                  {selectedReciter.country}
                </span>
                <span>&bull;</span>
                <span className="flex items-center gap-1">
                  <Music className="w-3.5 h-3.5 text-indigo-400" />
                  {selectedReciter.style}
                </span>
                <span>&bull;</span>
                <span>114 Complete Surahs</span>
              </div>

              <p className="text-xs text-theme-secondary mt-2.5 max-w-lg leading-relaxed">
                {selectedReciter.description}
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH SURAHS BY THIS RECITER */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-theme-primary">
              Surahs Recited by {selectedReciter.name_en.split(' ')[0]}
            </h3>
            <span className="text-xs text-theme-muted font-mono">
              {reciterSurahs.length} Surahs
            </span>
          </div>
          <SearchBar
            value={surahSearchQuery}
            onChange={setSurahSearchQuery}
            placeholder={`Search Surahs by ${selectedReciter.name_en}...`}
          />
        </div>

        {/* SURAHS LIST */}
        <div className="flex flex-col gap-2.5">
          {reciterSurahs.map((surah) => (
            <SurahCard
              key={surah.id}
              surah={surah}
            />
          ))}
        </div>
      </div>
    );
  }

  // DEFAULT: RECITERS BROWSER
  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl animate-fadeIn">
      {/* HEADER */}
      <header className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-theme-surface text-theme-accent border border-theme-border">
              <Mic2 className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-theme-primary tracking-tight">
                Quran Reciters
              </h1>
              <p className="text-xs text-theme-muted">
                World-renowned Qaris & Imams
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-theme-surface text-theme-accent border border-theme-border">
            {filteredReciters.length} Reciters
          </span>
        </div>
      </header>

      {/* SEARCH BAR */}
      <section aria-label="Search Reciters">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search reciter name, Arabic, country..."
        />
      </section>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All Reciters' },
          { id: 'featured', label: 'Featured Qaris' },
          { id: 'favorites', label: `Favorites (${favoriteReciters.length})` },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
              activeFilter === tab.id
                ? 'bg-theme-accent text-slate-950 font-bold shadow-md shadow-theme-accent/25'
                : 'bg-theme-card text-theme-muted hover:text-theme-primary hover:bg-theme-card-hover border border-theme-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* RECITERS LIST */}
      <section aria-label="Reciters List" className="flex flex-col gap-2.5 mt-1">
        {filteredReciters.length > 0 ? (
          filteredReciters.map((reciter) => (
            <ReciterCard
              key={reciter.id}
              reciter={reciter}
              isSelected={currentReciterId === reciter.id}
              onSelect={(r) => setSelectedReciter(r)}
            />
          ))
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-theme-card border border-theme-border my-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-theme-surface text-theme-muted flex items-center justify-center mb-3 border border-theme-border">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-theme-primary">No Reciters Found</h3>
            <p className="text-xs text-theme-muted mt-1 max-w-xs">
              No matching reciter found for "{searchQuery}".
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-theme-surface text-theme-accent hover:bg-theme-card-hover text-xs font-semibold border border-theme-border transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

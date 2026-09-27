import React, { useState, useMemo } from 'react';
import { BookOpen, SearchX } from 'lucide-react';
import { SURAHS_DATA } from '../data/surahsData';
import { SurahCard } from '../components/SurahCard';
import { SearchBar } from '../components/SearchBar';

export const QuranPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all'); // 'all', 'Meccan', 'Medinan'

  // Filtered Surahs based on search and type
  const filteredSurahs = useMemo(() => {
    return SURAHS_DATA.filter((surah) => {
      // Type filter
      if (typeFilter !== 'all' && surah.type !== typeFilter) {
        return false;
      }

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();

      const matchId = String(surah.id) === q;
      const matchEn = surah.name_en.toLowerCase().includes(q);
      const matchAr = surah.name_ar.includes(q);
      const matchTrans = surah.translation.toLowerCase().includes(q);

      return matchId || matchEn || matchAr || matchTrans;
    });
  }, [searchQuery, typeFilter]);

  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl animate-fadeIn">
      {/* HEADER */}
      <header className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-theme-surface text-theme-accent border border-theme-border">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-theme-primary tracking-tight">
                The Holy Quran
              </h1>
              <p className="text-xs text-theme-muted">
                114 Surahs &bull; 6,236 Verses
              </p>
            </div>
          </div>

          <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-theme-surface text-theme-accent border border-theme-border">
            {filteredSurahs.length} / 114
          </span>
        </div>
      </header>

      {/* SEARCH BAR */}
      <section aria-label="Search Surahs">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search Surah..."
        />
      </section>

      {/* FILTER TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'ALL SURAHS (114)' },
          { id: 'Meccan', label: 'MECCA (86)' },
          { id: 'Medinan', label: 'MEDINA (28)' },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setTypeFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold tracking-wide whitespace-nowrap transition-all duration-200 cursor-pointer ${
              typeFilter === tab.id
                ? 'bg-theme-accent text-slate-950 shadow-md shadow-theme-accent/25'
                : 'bg-theme-card text-theme-muted hover:text-theme-primary hover:bg-theme-card-hover border border-theme-border'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SURAH LIST */}
      <section aria-label="Surah List" className="flex flex-col gap-2.5 mt-1">
        {filteredSurahs.length > 0 ? (
          filteredSurahs.map((surah) => (
            <SurahCard
              key={surah.id}
              surah={surah}
            />
          ))
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-theme-card border border-theme-border my-4 shadow-sm">
            <div className="w-14 h-14 rounded-2xl bg-theme-surface text-theme-muted flex items-center justify-center mb-3 border border-theme-border">
              <SearchX className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-theme-primary">No Surahs Found</h3>
            <p className="text-xs text-theme-muted mt-1 max-w-xs">
              No matching Surah found for "{searchQuery}". Try searching by English transliteration, Arabic name, or Surah number.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setTypeFilter('all');
              }}
              className="mt-4 px-4 py-2 rounded-xl bg-theme-surface text-theme-accent hover:bg-theme-card-hover text-xs font-semibold border border-theme-border transition-colors cursor-pointer"
            >
              Reset Search & Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
};

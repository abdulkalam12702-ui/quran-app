import React, { useState } from 'react';
import { Heart, BookOpen, Mic2, Sparkles, HeartCrack } from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useAudio } from '../context/AudioContext';
import { getSurahById } from '../data/surahsData';
import { getReciterById } from '../data/recitersData';
import { SurahCard } from '../components/SurahCard';
import { ReciterCard } from '../components/ReciterCard';

export const FavoritesPage = ({ onNavigate }) => {
  const { favoriteSurahs, favoriteReciters } = usePreferences();
  const { playSurah, currentReciterId } = useAudio();
  const [activeTab, setActiveTab] = useState('surahs'); // 'surahs' or 'reciters'

  const favoriteSurahObjects = favoriteSurahs.map((id) => getSurahById(id)).filter(Boolean);
  const favoriteReciterObjects = favoriteReciters.map((id) => getReciterById(id)).filter(Boolean);

  return (
    <div className="flex flex-col gap-4 pb-28 pt-2 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl animate-fadeIn">
      {/* HEADER */}
      <header className="flex flex-col gap-1 pt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-500">
              <Heart className="w-5 h-5 fill-rose-500" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                My Favorites
              </h1>
              <p className="text-xs text-slate-400">
                Your saved Surahs & Reciters
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* SEGMENTED TAB SWITCHER */}
      <div className="grid grid-cols-2 p-1 rounded-2xl bg-slate-900/80 border border-slate-800">
        <button
          type="button"
          onClick={() => setActiveTab('surahs')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'surahs'
              ? 'bg-gradient-to-r from-sky-500 to-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Surahs ({favoriteSurahs.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('reciters')}
          className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'reciters'
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Mic2 className="w-4 h-4" />
          <span>Reciters ({favoriteReciters.length})</span>
        </button>
      </div>

      {/* FAVORITE SURAHS TAB */}
      {activeTab === 'surahs' && (
        <section aria-label="Favorite Surahs" className="flex flex-col gap-2.5 mt-1">
          {favoriteSurahObjects.length > 0 ? (
            favoriteSurahObjects.map((surah) => (
              <SurahCard
                key={surah.id}
                surah={surah}
                onPlay={(id) => playSurah(id)}
              />
            ))
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 my-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                <HeartCrack className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No Favorite Surahs Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Tap the heart icon on any Surah card to save it here for quick listening anytime.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('quran')}
                className="mt-4 px-4 py-2 rounded-xl bg-sky-500 text-slate-950 hover:bg-sky-400 text-xs font-bold shadow-glow transition-all"
              >
                Browse Surahs
              </button>
            </div>
          )}
        </section>
      )}

      {/* FAVORITE RECITERS TAB */}
      {activeTab === 'reciters' && (
        <section aria-label="Favorite Reciters" className="flex flex-col gap-2.5 mt-1">
          {favoriteReciterObjects.length > 0 ? (
            favoriteReciterObjects.map((reciter) => (
              <ReciterCard
                key={reciter.id}
                reciter={reciter}
                isSelected={currentReciterId === reciter.id}
                onSelect={(r) => playSurah(1, r.id)}
              />
            ))
          ) : (
            <div className="py-16 flex flex-col items-center justify-center text-center p-6 rounded-3xl bg-slate-900/40 border border-slate-800/80 my-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-500 flex items-center justify-center mb-3">
                <HeartCrack className="w-7 h-7" />
              </div>
              <h3 className="text-base font-bold text-slate-200">No Favorite Reciters Yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Tap the heart on your preferred Qaris to easily find and listen to them.
              </p>
              <button
                type="button"
                onClick={() => onNavigate('reciters')}
                className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold shadow-md transition-all"
              >
                Browse Reciters
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
};

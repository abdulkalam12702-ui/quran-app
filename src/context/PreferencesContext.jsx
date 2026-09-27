import React, { createContext, useContext, useState, useEffect } from 'react';

const PreferencesContext = createContext();

const STORAGE_KEYS = {
  FAV_SURAHS: 'quran_fav_surahs',
  FAV_RECITERS: 'quran_fav_reciters',
  RECENTLY_PLAYED: 'quran_recently_played',
  THEME: 'quran_theme',
  DEFAULT_RECITER: 'quran_default_reciter',
  ENVIRONMENT_ID: 'quran_environment_id',
  AUTO_BACKGROUND: 'quran_auto_background',
};

export const PreferencesProvider = ({ children }) => {
  // Favorites
  const [favoriteSurahs, setFavoriteSurahs] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAV_SURAHS);
      return saved ? JSON.parse(saved) : [1, 18, 36, 55, 67, 112]; // Default beloved Surahs
    } catch {
      return [1, 18, 36, 55, 67, 112];
    }
  });

  const [favoriteReciters, setFavoriteReciters] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAV_RECITERS);
      return saved ? JSON.parse(saved) : ["mishary_alafasy", "abdulbaset_abdulsamad", "maher_al_muaiqly"];
    } catch {
      return ["mishary_alafasy", "abdulbaset_abdulsamad"];
    }
  });

  // Recently played history
  const [recentlyPlayed, setRecentlyPlayed] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.RECENTLY_PLAYED);
      return saved ? JSON.parse(saved) : [
        { surahId: 1, reciterId: "mishary_alafasy", timestamp: Date.now() - 3600000 },
        { surahId: 67, reciterId: "mishary_alafasy", timestamp: Date.now() - 7200000 }
      ];
    } catch {
      return [];
    }
  });

  // Preferences
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.THEME) || 'navy';
  });

  const [defaultReciterId, setDefaultReciterId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.DEFAULT_RECITER) || 'mishary_alafasy';
  });

  // Environment & Auto Background
  const [savedEnvironmentId, setSavedEnvironmentId] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ENVIRONMENT_ID) || 'mountains';
  });

  const [isAutoBackground, setIsAutoBackground] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTO_BACKGROUND) === 'true';
  });

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_SURAHS, JSON.stringify(favoriteSurahs));
  }, [favoriteSurahs]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FAV_RECITERS, JSON.stringify(favoriteReciters));
  }, [favoriteReciters]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECENTLY_PLAYED, JSON.stringify(recentlyPlayed));
  }, [recentlyPlayed]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    document.documentElement.setAttribute('data-theme', theme);
    if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DEFAULT_RECITER, defaultReciterId);
  }, [defaultReciterId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENVIRONMENT_ID, savedEnvironmentId);
  }, [savedEnvironmentId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.AUTO_BACKGROUND, String(isAutoBackground));
  }, [isAutoBackground]);

  const toggleFavoriteSurah = (surahId) => {
    const id = Number(surahId);
    setFavoriteSurahs((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const isFavoriteSurah = (surahId) => {
    return favoriteSurahs.includes(Number(surahId));
  };

  const toggleFavoriteReciter = (reciterId) => {
    setFavoriteReciters((prev) =>
      prev.includes(reciterId) ? prev.filter((item) => item !== reciterId) : [...prev, reciterId]
    );
  };

  const isFavoriteReciter = (reciterId) => {
    return favoriteReciters.includes(reciterId);
  };

  const recordPlayHistory = (surahId, reciterId) => {
    const newItem = {
      surahId: Number(surahId),
      reciterId,
      timestamp: Date.now()
    };
    setRecentlyPlayed((prev) => {
      const filtered = prev.filter((p) => !(p.surahId === newItem.surahId && p.reciterId === newItem.reciterId));
      return [newItem, ...filtered].slice(0, 15);
    });
  };

  const clearHistory = () => {
    setRecentlyPlayed([]);
  };

  return (
    <PreferencesContext.Provider
      value={{
        favoriteSurahs,
        favoriteReciters,
        toggleFavoriteSurah,
        isFavoriteSurah,
        toggleFavoriteReciter,
        isFavoriteReciter,
        recentlyPlayed,
        recordPlayHistory,
        clearHistory,
        theme,
        setTheme,
        defaultReciterId,
        setDefaultReciterId,
        savedEnvironmentId,
        setSavedEnvironmentId,
        isAutoBackground,
        setIsAutoBackground,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
};

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

import React, { useState, useEffect } from 'react';
import { BottomNavigation } from './components/BottomNavigation';
import { MiniPlayer } from './components/MiniPlayer';
import { FullScreenPlayer } from './components/FullScreenPlayer';
import { HomePage } from './pages/HomePage';
import { QuranPage } from './pages/QuranPage';
import { RecitersPage } from './pages/RecitersPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { SettingsPage } from './pages/SettingsPage';
import { usePreferences } from './context/PreferencesContext';
import { WifiOff } from 'lucide-react';

export function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { theme } = usePreferences();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Scroll to top when tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  const renderActivePage = () => {
    switch (activeTab) {
      case 'home':
        return <HomePage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'quran':
        return <QuranPage />;
      case 'reciters':
        return <RecitersPage />;
      case 'favorites':
        return <FavoritesPage onNavigate={(tab) => setActiveTab(tab)} />;
      case 'settings':
        return <SettingsPage />;
      default:
        return <HomePage onNavigate={(tab) => setActiveTab(tab)} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col relative selection:bg-sky-500/30 selection:text-sky-200">
      {/* Offline Status Warning Bar */}
      {!isOnline && (
        <div className="bg-amber-600/90 text-white text-xs font-semibold px-4 py-1.5 flex items-center justify-center gap-2 sticky top-0 z-50 backdrop-blur-md">
          <WifiOff className="w-3.5 h-3.5" />
          <span>You are currently offline. Audio will stream when reconnected.</span>
        </div>
      )}

      {/* Main Page View */}
      <main className="flex-1 w-full relative z-10">
        {renderActivePage()}
      </main>

      {/* Persistent Mini Player above Bottom Navigation */}
      <MiniPlayer />

      {/* Persistent Mobile Bottom Navigation */}
      <BottomNavigation
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
      />

      {/* Full-Screen Immersive Recitation Player */}
      <FullScreenPlayer />
    </div>
  );
}

export default App;

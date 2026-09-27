import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Palette, 
  Mic2, 
  Sliders, 
  Download, 
  RotateCcw,
  Check,
  Bell,
  Sparkles,
  Shuffle
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useAudio } from '../context/AudioContext';
import { AudioSettingsModal } from '../components/AudioSettingsModal';
import { BackgroundSelectorModal } from '../components/BackgroundSelectorModal';
import { ReciterDropdown } from '../components/ReciterDropdown';

export const SettingsPage = () => {
  const { 
    theme, 
    setTheme, 
    defaultReciterId, 
    setDefaultReciterId,
    clearHistory 
  } = usePreferences();

  const { 
    activeEnvironment, 
    isAutoBackground, 
    toggleAutoBackground 
  } = useAudio();

  const [showAudioSettings, setShowAudioSettings] = useState(false);
  const [showBgModal, setShowBgModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  // Catch PWA beforeinstallprompt event
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
    }

    if ('Notification' in window) {
      setNotificationsEnabled(Notification.permission === 'granted');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setIsInstalled(true);
      }
      setDeferredPrompt(null);
    } else {
      alert("To install this app on your phone, open your browser menu (⋮ on Android or Share on iPhone) and tap 'Add to Home Screen' or 'Install App'.");
    }
  };

  const handleNotificationToggle = async () => {
    if (!('Notification' in window)) {
      alert("Notifications are not supported in this browser.");
      return;
    }
    if (Notification.permission === 'granted') {
      alert("Notifications are already enabled for daily Quran reminders.");
    } else {
      const permission = await Notification.requestPermission();
      setNotificationsEnabled(permission === 'granted');
    }
  };

  const handleReset = () => {
    if (window.confirm("Reset all saved history and default preferences?")) {
      clearHistory();
      setResetSuccess(true);
      setTimeout(() => setResetSuccess(false), 3000);
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-28 pt-2 px-4 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl animate-fadeIn">
      {/* HEADER */}
      <header className="flex flex-col gap-1 pt-2">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-theme-surface text-theme-accent border border-theme-border">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-theme-primary tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-theme-muted">
              Customize your Quran listening experience
            </p>
          </div>
        </div>
      </header>

      {/* PWA INSTALL CARD */}
      <section className="rounded-3xl p-5 bg-theme-card border border-theme-border shadow-lg flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-theme-accent/15 text-theme-accent flex items-center justify-center border border-theme-accent/30 flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-theme-primary">
              {isInstalled ? "App Installed" : "Install Quran App"}
            </h3>
            <p className="text-xs text-theme-muted mt-0.5">
              {isInstalled 
                ? "You're running the standalone app on your device" 
                : "Add to home screen for full-screen offline listening"}
            </p>
          </div>
        </div>
        {!isInstalled && (
          <button
            type="button"
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-theme-accent hover:opacity-90 text-slate-950 text-xs font-bold shadow-md transition-all whitespace-nowrap ml-2 cursor-pointer"
          >
            Install
          </button>
        )}
      </section>

      {/* 1. DEFAULT RECITER (TOP OF SETTINGS, BEAUTIFUL DARK-THEME DROPDOWN) */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-secondary">
          <Mic2 className="w-4 h-4 text-theme-accent" />
          <span>DEFAULT RECITER</span>
        </div>

        <ReciterDropdown
          selectedId={defaultReciterId}
          onSelect={(reciterId) => setDefaultReciterId(reciterId)}
        />
      </section>

      {/* 2. THEME SELECTOR */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-secondary">
          <Palette className="w-4 h-4 text-theme-accent" />
          <span>APPEARANCE & THEME</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {[
            { 
              id: 'navy', 
              label: 'Dark Navy', 
              bg: 'bg-[#070b13]', 
              swatchBorder: 'border-sky-500/50',
              accentDot: '#38bdf8',
              description: 'Deep navy & soft blue'
            },
            { 
              id: 'obsidian', 
              label: 'OLED Black', 
              bg: 'bg-black', 
              swatchBorder: 'border-zinc-700',
              accentDot: '#60a5fa',
              description: 'True pitch black OLED'
            },
            { 
              id: 'emerald', 
              label: 'Emerald', 
              bg: 'bg-[#03140e]', 
              swatchBorder: 'border-emerald-600/60',
              accentDot: '#10b981',
              description: 'Rich dark Islamic green'
            },
            { 
              id: 'light', 
              label: 'Clean Light', 
              bg: 'bg-slate-100', 
              swatchBorder: 'border-slate-300',
              accentDot: '#0284c7',
              description: 'Crisp light & high contrast'
            },
          ].map((item) => {
            const isSelected = theme === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setTheme(item.id)}
                className={`p-3.5 rounded-2xl flex flex-col items-center gap-2.5 border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-theme-accent ring-2 ring-theme-accent/40 bg-theme-surface shadow-md'
                    : 'border-theme-border bg-theme-card hover:bg-theme-card-hover'
                }`}
              >
                <div className={`w-8 h-8 rounded-full ${item.bg} border-2 ${item.swatchBorder} flex items-center justify-center shadow-inner relative`}>
                  {isSelected ? (
                    <Check className="w-4 h-4 text-theme-accent stroke-[3]" />
                  ) : (
                    <span 
                      className="w-2.5 h-2.5 rounded-full" 
                      style={{ backgroundColor: item.accentDot }}
                    />
                  )}
                </div>
                <div className="flex flex-col items-center text-center">
                  <span className={`text-xs font-bold leading-tight ${isSelected ? 'text-theme-accent' : 'text-theme-primary'}`}>
                    {item.label}
                  </span>
                  <span className="text-[10px] text-theme-muted mt-0.5 leading-tight">
                    {item.description}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. ANIMATED RECITATION ENVIRONMENT */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-secondary">
          <Sparkles className="w-4 h-4 text-theme-accent" />
          <span>RECITATION ENVIRONMENT</span>
        </div>

        <div className="p-4 rounded-2xl bg-theme-card border border-theme-border flex flex-col gap-3.5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeEnvironment?.thumb}
                alt={activeEnvironment?.name}
                className="w-12 h-12 rounded-xl object-cover border border-theme-border shadow-md"
              />
              <div>
                <h4 className="text-sm font-bold text-theme-primary">{activeEnvironment?.name}</h4>
                <p className="text-xs text-theme-muted">{activeEnvironment?.tagline}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowBgModal(true)}
              className="px-3 py-1.5 rounded-xl bg-theme-surface hover:bg-theme-card-hover text-theme-accent text-xs font-semibold border border-theme-border transition-colors cursor-pointer"
            >
              Change
            </button>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-theme-border">
            <div className="flex items-center gap-2">
              <Shuffle className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="text-xs font-semibold text-theme-primary block">Auto-rotate Environments</span>
                <span className="text-[11px] text-theme-muted block">Smoothly switch environment on each Surah</span>
              </div>
            </div>
            <button
              type="button"
              onClick={toggleAutoBackground}
              aria-label="Toggle auto background"
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 cursor-pointer ${
                isAutoBackground ? 'bg-theme-accent' : 'bg-theme-surface border border-theme-border'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  isAutoBackground ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </section>

      {/* 4. AUDIO SETTINGS SHORTCUT */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-theme-secondary">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>AUDIO & PLAYBACK</span>
        </div>

        <button
          type="button"
          onClick={() => setShowAudioSettings(true)}
          className="flex items-center justify-between p-4 rounded-2xl bg-theme-card hover:bg-theme-card-hover border border-theme-border text-left transition-all cursor-pointer shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-theme-primary">Open Audio Mixing & Playback Settings</h4>
              <p className="text-xs text-theme-muted">Quran volume, background sounds, speed, sleep timer</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-theme-accent">Configure</span>
        </button>
      </section>

      {/* 5. NOTIFICATIONS TOGGLE */}
      <section className="flex items-center justify-between p-4 rounded-2xl bg-theme-card border border-theme-border shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-theme-primary">Daily Recitation Reminders</h4>
            <p className="text-xs text-theme-muted">Browser notifications for Quran recitation</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleNotificationToggle}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            notificationsEnabled
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
              : 'bg-theme-surface text-theme-secondary hover:bg-theme-card-hover border border-theme-border'
          }`}
        >
          {notificationsEnabled ? 'Enabled' : 'Enable'}
        </button>
      </section>

      {/* 6. RESET DATA BUTTON */}
      <div className="flex justify-center pt-1">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-theme-muted hover:text-rose-500 transition-colors py-2 px-4 rounded-xl hover:bg-theme-card cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Playback History & Preferences</span>
        </button>
      </div>

      {resetSuccess && (
        <div className="text-center text-xs text-emerald-400 font-semibold animate-fadeIn">
          Preferences reset successfully.
        </div>
      )}

      {/* MODALS */}
      <AudioSettingsModal
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />

      <BackgroundSelectorModal
        isOpen={showBgModal}
        onClose={() => setShowBgModal(false)}
      />
    </div>
  );
};

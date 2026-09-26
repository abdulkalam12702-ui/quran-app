import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Moon, 
  Sun, 
  Palette, 
  Type, 
  Mic2, 
  Sliders, 
  Download, 
  Info, 
  ShieldCheck, 
  BookOpen, 
  RotateCcw,
  Check,
  Bell,
  Sparkles
} from 'lucide-react';
import { usePreferences } from '../context/PreferencesContext';
import { useAudio } from '../context/AudioContext';
import { RECITERS_DATA } from '../data/recitersData';
import { AudioSettingsModal } from '../components/AudioSettingsModal';

export const SettingsPage = () => {
  const { 
    theme, 
    setTheme, 
    arabicSize, 
    setArabicSize, 
    defaultReciterId, 
    setDefaultReciterId,
    clearHistory 
  } = usePreferences();

  const { isPlaying } = useAudio();

  const [showAudioSettings, setShowAudioSettings] = useState(false);
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
          <div className="p-2 rounded-xl bg-slate-800 text-slate-300">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              Settings & Preferences
            </h1>
            <p className="text-xs text-slate-400">
              Customize your Quran listening experience
            </p>
          </div>
        </div>
      </header>

      {/* PWA INSTALL CARD */}
      <section className="rounded-3xl p-5 bg-gradient-to-r from-sky-900/40 via-indigo-900/30 to-purple-900/40 border border-sky-500/30 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center border border-sky-500/40 flex-shrink-0">
            <Download className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {isInstalled ? "App Installed" : "Install Quran App"}
            </h3>
            <p className="text-xs text-slate-300 mt-0.5">
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
            className="px-3.5 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-bold shadow-glow transition-all whitespace-nowrap ml-2"
          >
            Install
          </button>
        )}
      </section>

      {/* THEME SELECTOR */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Palette className="w-4 h-4 text-sky-400" />
          <span>APPEARANCE & THEME</span>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {[
            { id: 'navy', label: 'Dark Navy', bg: 'bg-[#070b13]', border: 'border-sky-500' },
            { id: 'obsidian', label: 'OLED Black', bg: 'bg-black', border: 'border-slate-500' },
            { id: 'emerald', label: 'Emerald', bg: 'bg-[#04100c]', border: 'border-emerald-500' },
            { id: 'light', label: 'Clean Light', bg: 'bg-slate-100', border: 'border-sky-600', text: 'text-slate-900' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTheme(item.id)}
              className={`p-3 rounded-2xl flex flex-col items-center gap-2 border transition-all ${
                theme === item.id
                  ? `${item.border} ring-2 ring-sky-500/40 bg-slate-800/90 shadow-md`
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
              }`}
            >
              <div className={`w-7 h-7 rounded-full ${item.bg} border border-white/20 flex items-center justify-center shadow-inner`}>
                {theme === item.id && <Check className="w-4 h-4 text-sky-400 stroke-[3]" />}
              </div>
              <span className="text-[11px] font-semibold text-slate-300 text-center leading-tight">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ARABIC TEXT SIZE */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Type className="w-4 h-4 text-amber-400" />
          <span>ARABIC TEXT SIZE</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {[
            { id: 'normal', label: 'Normal', sample: 'الفاتحة' },
            { id: 'large', label: 'Large (Default)', sample: 'الفاتحة' },
            { id: 'xl', label: 'Extra Large', sample: 'الفاتحة' },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setArabicSize(item.id)}
              className={`p-3 rounded-2xl flex flex-col items-center gap-1.5 border transition-all ${
                arabicSize === item.id
                  ? 'border-amber-400/80 bg-amber-500/10 shadow-sm'
                  : 'border-slate-800 bg-slate-900/60 hover:bg-slate-800'
              }`}
            >
              <span className={`font-arabic text-amber-300 font-bold ${
                item.id === 'normal' ? 'text-lg' : item.id === 'xl' ? 'text-2xl' : 'text-xl'
              }`}>
                {item.sample}
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* DEFAULT RECITER */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Mic2 className="w-4 h-4 text-indigo-400" />
          <span>DEFAULT RECITER</span>
        </div>

        <div className="relative">
          <select
            value={defaultReciterId}
            onChange={(e) => setDefaultReciterId(e.target.value)}
            className="w-full p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-slate-100 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 appearance-none font-medium cursor-pointer"
          >
            {RECITERS_DATA.map((reciter) => (
              <option key={reciter.id} value={reciter.id} className="bg-slate-900 text-white">
                {reciter.name_en} ({reciter.name_ar}) - {reciter.country}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
            ▼
          </div>
        </div>
      </section>

      {/* AUDIO SETTINGS SHORTCUT */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-300">
          <Sliders className="w-4 h-4 text-emerald-400" />
          <span>AUDIO & PLAYBACK</span>
        </div>

        <button
          type="button"
          onClick={() => setShowAudioSettings(true)}
          className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 hover:bg-slate-900/90 border border-slate-800 text-left transition-all"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-200">Open Audio Mixing & Playback Settings</h4>
              <p className="text-xs text-slate-400">Quran volume, background sounds, speed, sleep timer</p>
            </div>
          </div>
          <span className="text-xs font-semibold text-sky-400">Configure</span>
        </button>
      </section>

      {/* NOTIFICATIONS TOGGLE */}
      <section className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
            <Bell className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-slate-200">Daily Recitation Reminders</h4>
            <p className="text-xs text-slate-400">Browser notifications for Quran recitation</p>
          </div>
        </div>
        <button
          type="button"
          onClick={handleNotificationToggle}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
            notificationsEnabled
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
          }`}
        >
          {notificationsEnabled ? 'Enabled' : 'Enable'}
        </button>
      </section>

      {/* APP INFO & ABOUT */}
      <section className="rounded-3xl p-5 bg-slate-900/40 border border-slate-800/80 flex flex-col gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2 text-slate-200 font-bold">
          <Info className="w-4 h-4 text-sky-400" />
          <span>About Quran App</span>
        </div>
        <p className="leading-relaxed">
          Quran is a high-performance audio recitation application built to facilitate contemplative listening to the Noble Quran with serene ambient soundscapes.
        </p>
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1.5 font-mono text-[11px]">
          <div><strong className="text-slate-300">Quran Audio Sources:</strong> Mp3Quran CDN & Al-Quran Cloud (Islamic Network)</div>
          <div><strong className="text-slate-300">Total Surahs:</strong> 114 (Complete Mushaf)</div>
          <div><strong className="text-slate-300">Audio Quality:</strong> 128 kbps High-Definition MP3</div>
          <div><strong className="text-slate-300">Ambient Engine:</strong> Web Audio API Procedural Synthesizer</div>
          <div><strong className="text-slate-300">Version:</strong> 1.0.0 (PWA Ready)</div>
        </div>
      </section>

      {/* RESET DATA BUTTON */}
      <div className="flex justify-center pt-2">
        <button
          type="button"
          onClick={handleReset}
          className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-rose-400 transition-colors py-2 px-4 rounded-xl hover:bg-slate-900/60"
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

      {/* MODAL */}
      <AudioSettingsModal
        isOpen={showAudioSettings}
        onClose={() => setShowAudioSettings(false)}
      />
    </div>
  );
};

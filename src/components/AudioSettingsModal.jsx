import React from 'react';
import { X, Sliders, Moon, Gauge, Repeat, Radio, Volume2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { DualVolumeControl } from './DualVolumeControl';
import { formatTime } from '../utils/formatters';

export const AudioSettingsModal = ({ isOpen, onClose }) => {
  const {
    playbackRate,
    setPlaybackRate,
    repeatMode,
    setRepeatMode,
    autoPlayNext,
    setAutoPlayNext,
    sleepTimerRemaining,
    setSleepTimer,
  } = useAudio();

  if (!isOpen) return null;

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];
  const sleepOptions = [
    { label: 'Off', minutes: 0 },
    { label: '15m', minutes: 15 },
    { label: '30m', minutes: 30 },
    { label: '45m', minutes: 45 },
    { label: '60m', minutes: 60 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Audio & Playback Settings</h3>
              <p className="text-xs text-slate-400">Fine-tune your recitation experience</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-5 py-4">
          {/* Dual Volume Control Embedded */}
          <DualVolumeControl compact={false} />

          {/* Playback Speed */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Gauge className="w-4 h-4 text-sky-400" />
              <span>Playback Speed</span>
            </div>
            <div className="grid grid-cols-6 gap-1.5">
              {speedOptions.map((speed) => (
                <button
                  key={speed}
                  type="button"
                  onClick={() => setPlaybackRate(speed)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    playbackRate === speed
                      ? 'bg-sky-500 text-slate-950 font-bold shadow-md shadow-sky-500/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {speed}x
                </button>
              ))}
            </div>
          </div>

          {/* Repeat Mode */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Repeat className="w-4 h-4 text-indigo-400" />
              <span>Repeat Mode</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'off', label: 'No Repeat' },
                { id: 'one', label: 'Repeat Surah' },
                { id: 'all', label: 'Repeat All' },
              ].map((mode) => (
                <button
                  key={mode.id}
                  type="button"
                  onClick={() => setRepeatMode(mode.id)}
                  className={`py-2 px-3 rounded-xl text-xs font-medium transition-all ${
                    repeatMode === mode.id
                      ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {mode.label}
                </button>
              ))}
            </div>
          </div>

          {/* Auto-Play Next Surah Toggle */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center gap-2.5">
              <Radio className="w-4 h-4 text-emerald-400" />
              <div>
                <h4 className="text-xs font-semibold text-slate-200">Auto-play Next Surah</h4>
                <p className="text-[11px] text-slate-400">Continue reciting consecutively</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setAutoPlayNext(!autoPlayNext)}
              className={`w-12 h-6 rounded-full transition-colors relative flex items-center px-1 ${
                autoPlayNext ? 'bg-emerald-500' : 'bg-slate-700'
              }`}
            >
              <div 
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  autoPlayNext ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Sleep Timer */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <div className="flex items-center gap-2">
                <Moon className="w-4 h-4 text-amber-400" />
                <span>Sleep Timer</span>
              </div>
              {sleepTimerRemaining && (
                <span className="text-amber-400 font-mono text-[11px]">
                  {formatTime(sleepTimerRemaining)} remaining
                </span>
              )}
            </div>
            <div className="grid grid-cols-5 gap-1.5">
              {sleepOptions.map((opt) => (
                <button
                  key={opt.minutes}
                  type="button"
                  onClick={() => setSleepTimer(opt.minutes)}
                  className={`py-2 rounded-xl text-xs font-medium transition-all ${
                    (opt.minutes === 0 && !sleepTimerRemaining) ||
                    (opt.minutes > 0 && sleepTimerRemaining && Math.abs(sleepTimerRemaining - opt.minutes * 60) < 60)
                      ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/30'
                      : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

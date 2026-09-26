import React from 'react';
import { X, Check, Image as ImageIcon } from 'lucide-react';
import { BACKGROUND_VISUALS } from '../data/backgroundVisualsData';
import { useAudio } from '../context/AudioContext';

export const BackgroundSelectorModal = ({ isOpen, onClose }) => {
  const { activeVisualId, setActiveVisualId } = useAudio();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div 
        className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-t-3xl sm:rounded-3xl p-5 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-400">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Peaceful Visuals</h3>
              <p className="text-xs text-slate-400">Select background for full-screen recitation</p>
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

        {/* Visuals Grid */}
        <div className="grid grid-cols-2 gap-3 overflow-y-auto py-4 px-1 pr-2">
          {BACKGROUND_VISUALS.map((item) => {
            const isSelected = activeVisualId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setActiveVisualId(item.id);
                  onClose();
                }}
                className={`group relative flex flex-col rounded-2xl overflow-hidden border-2 text-left transition-all duration-200 aspect-[4/3] focus:outline-none ${
                  isSelected
                    ? 'border-sky-400 shadow-[0_0_20px_rgba(56,189,248,0.35)] scale-[1.02]'
                    : 'border-slate-800 hover:border-slate-600 opacity-80 hover:opacity-100'
                }`}
              >
                <img
                  src={item.thumb}
                  alt={item.name}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {isSelected && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-sky-400 text-slate-950 flex items-center justify-center shadow-lg">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}

                <div className="absolute bottom-2 left-2 right-2">
                  <span className="text-[10px] uppercase tracking-wider text-sky-300 font-semibold">
                    {item.category}
                  </span>
                  <h4 className="text-xs font-bold text-white truncate">
                    {item.name}
                  </h4>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

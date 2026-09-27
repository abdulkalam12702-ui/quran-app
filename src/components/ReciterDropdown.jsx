import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check, Mic2 } from 'lucide-react';
import { RECITERS_DATA } from '../data/recitersData';

export const ReciterDropdown = ({ selectedId, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const currentReciter = RECITERS_DATA.find((r) => r.id === selectedId) || RECITERS_DATA[0];

  // Close dropdown on outside click or tap
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('touchstart', handleOutsideClick);
    }

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
    };
  }, [isOpen]);

  // Keyboard navigation (Escape to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Trigger Button (Closed State) */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="Select default reciter"
        className={`w-full p-3.5 sm:p-4 rounded-2xl bg-theme-card border transition-all flex items-center justify-between text-left cursor-pointer shadow-sm ${
          isOpen
            ? 'border-theme-accent ring-2 ring-theme-accent/30 shadow-glow'
            : 'border-theme-border hover:bg-theme-card-hover hover:border-theme-border-light'
        }`}
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-2">
          <div className="w-10 h-10 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center flex-shrink-0 text-theme-accent">
            <Mic2 className="w-5 h-5" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm sm:text-base font-bold text-theme-primary truncate">
              {currentReciter.name_en}
            </span>
            <span className="text-xs text-theme-muted truncate mt-0.5">
              ({currentReciter.name_ar}) - {currentReciter.country}
            </span>
          </div>
        </div>

        <div className={`p-1.5 rounded-lg text-theme-muted transition-transform duration-200 flex-shrink-0 ${
          isOpen ? 'rotate-180 text-theme-accent' : ''
        }`}>
          <ChevronDown className="w-5 h-5" />
        </div>
      </button>

      {/* Open Dropdown Options Menu */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Reciter options"
          className="absolute top-full left-0 right-0 mt-2 z-50 rounded-2xl bg-theme-card border border-theme-border shadow-2xl overflow-hidden backdrop-blur-2xl animate-fadeIn max-h-80 overflow-y-auto p-1.5 flex flex-col gap-1"
          style={{
            boxShadow: '0 20px 45px -10px rgba(0, 0, 0, 0.85), 0 0 0 1px var(--theme-border)',
          }}
        >
          {RECITERS_DATA.map((reciter) => {
            const isSelected = reciter.id === selectedId;
            return (
              <button
                key={reciter.id}
                role="option"
                aria-selected={isSelected}
                type="button"
                onClick={() => {
                  onSelect(reciter.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3.5 py-3 rounded-xl flex items-center justify-between text-left transition-all cursor-pointer min-h-[48px] ${
                  isSelected
                    ? 'bg-theme-surface text-theme-accent border border-theme-accent/40 font-bold shadow-sm'
                    : 'text-theme-primary hover:bg-theme-surface hover:text-theme-accent border border-transparent'
                }`}
              >
                <div className="flex flex-col min-w-0 pr-3">
                  <span className={`text-sm font-semibold truncate ${
                    isSelected ? 'text-theme-accent' : 'text-theme-primary'
                  }`}>
                    {reciter.name_en}
                  </span>
                  <span className="text-xs text-theme-muted truncate mt-0.5">
                    ({reciter.name_ar}) - {reciter.country}
                  </span>
                </div>

                {isSelected && (
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-theme-accent/20 flex items-center justify-center text-theme-accent">
                    <Check className="w-4 h-4 stroke-[3]" />
                  </div>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

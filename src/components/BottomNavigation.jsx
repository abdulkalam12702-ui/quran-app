import React from 'react';
import { Home, BookOpen, Mic2, Heart, Settings } from 'lucide-react';

export const BottomNavigation = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'quran', label: 'Quran', icon: BookOpen },
    { id: 'reciters', label: 'Reciters', icon: Mic2 },
    { id: 'favorites', label: 'Favorites', icon: Heart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav 
      aria-label="Main Navigation" 
      className="fixed bottom-0 left-0 right-0 z-40 max-w-md mx-auto sm:max-w-xl md:max-w-2xl lg:max-w-4xl"
    >
      <div className="glass-nav mx-auto px-3 py-2 sm:py-3 shadow-2xl backdrop-blur-2xl bg-[#070b13]/90 border-t border-slate-800/80">
        <ul className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <li key={item.id} className="flex-1">
                <button
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  className={`w-full flex flex-col items-center justify-center py-1 transition-all duration-300 relative group focus:outline-none ${
                    isActive ? 'text-sky-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {/* Active glowing indicator pill */}
                  {isActive && (
                    <span className="absolute -top-2 w-8 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.8)] animate-pulse" />
                  )}

                  <div className={`p-1 rounded-xl transition-all duration-300 ${
                    isActive ? 'bg-sky-500/15 scale-110' : 'group-hover:bg-slate-800/40'
                  }`}>
                    <Icon 
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isActive ? 'stroke-[2.5]' : 'stroke-[1.8]'
                      }`} 
                    />
                  </div>
                  
                  <span className="text-[11px] tracking-wide mt-0.5 select-none">
                    {item.label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
        {/* Mobile home indicator safe spacer */}
        <div className="h-[env(safe-area-inset-bottom,0px)]" />
      </div>
    </nav>
  );
};

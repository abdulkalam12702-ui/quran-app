import React from 'react';
import { Search, X } from 'lucide-react';

export const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search Surah...", 
  autoFocus = false 
}) => {
  return (
    <div className="relative w-full">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
        <Search className="w-4 h-4" />
      </div>

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        autoComplete="off"
        spellCheck="false"
        style={{
          color: '#ffffff',
          backgroundColor: '#0f172a',
          caretColor: '#38bdf8',
          WebkitTextFillColor: '#ffffff',
        }}
        className="search-input w-full pl-10 pr-10 py-3 rounded-2xl bg-slate-900 border border-slate-700 text-white placeholder:text-slate-400 text-sm focus:outline-none focus:border-sky-400 focus:ring-2 focus:ring-sky-400/25 transition-all shadow-sm select-text"
      />

      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;

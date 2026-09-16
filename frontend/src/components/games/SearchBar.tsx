import React from 'react';
import { Search, X, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import type { GameFilterParams } from '../../types/game';

interface SearchBarProps {
  filters: GameFilterParams;
  onFilterChange: (filters: Partial<GameFilterParams>) => void;
  genres: string[];
  totalResults: number;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  filters,
  onFilterChange,
  genres,
  totalResults,
}) => {
  return (
    <div className="space-y-4 w-full">
      {/* Search Input and Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input Box */}
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 pointer-events-none" />
          <input
            type="text"
            value={filters.search || ''}
            onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
            placeholder="Search by title, genre, or keyword (e.g. Cyberpunk, RPG)..."
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-[#14141c] border border-white/10 hover:border-white/20 focus:border-[#E50914] focus:outline-none text-white placeholder-zinc-500 text-sm transition-all focus:ring-1 focus:ring-[#E50914]"
          />
          {filters.search && (
            <button
              onClick={() => onFilterChange({ search: '', page: 1 })}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <select
              value={filters.ordering || 'popular'}
              onChange={(e) => onFilterChange({ ordering: e.target.value as any, page: 1 })}
              className="pl-8 pr-8 py-2.5 rounded-xl bg-[#14141c] border border-white/10 hover:border-white/20 focus:border-[#E50914] focus:outline-none text-zinc-200 text-xs font-medium cursor-pointer transition-all appearance-none"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Releases</option>
              <option value="name">Name (A - Z)</option>
              <option value="anticipated">Most Anticipated</option>
            </select>
          </div>

          <span className="text-xs text-zinc-400 font-mono px-3 py-2 bg-white/5 rounded-xl border border-white/5 whitespace-nowrap">
            {totalResults} {totalResults === 1 ? 'Game' : 'Games'}
          </span>
        </div>
      </div>

      {/* Genre Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3 h-3" />
          Genres:
        </span>
        {genres.map((genre) => {
          const isSelected = (!filters.genre && genre === 'All') || filters.genre === genre;
          return (
            <button
              key={genre}
              onClick={() => onFilterChange({ genre: genre === 'All' ? undefined : genre, page: 1 })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-[#E50914] text-white shadow-red-glow font-semibold'
                  : 'bg-[#14141c] text-zinc-400 hover:text-white hover:bg-[#1f1f2a] border border-white/5'
              }`}
            >
              {genre}
            </button>
          );
        })}
      </div>
    </div>
  );
};

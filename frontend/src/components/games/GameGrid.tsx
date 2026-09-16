import React from 'react';
import { SearchX } from 'lucide-react';
import { GameCard } from './GameCard';
import type { GameSummary } from '../../types/game';

interface GameGridProps {
  games: GameSummary[];
  isLoading: boolean;
  onSelectGame: (game: GameSummary) => void;
  onResetFilters: () => void;
}

export const GameGrid: React.FC<GameGridProps> = ({
  games,
  isLoading,
  onSelectGame,
  onResetFilters,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="bg-[#14141c] border border-white/5 rounded-2xl overflow-hidden animate-pulse flex flex-col space-y-3"
          >
            <div className="aspect-[3/4] w-full bg-zinc-800/60" />
            <div className="p-4 space-y-3">
              <div className="flex gap-2">
                <div className="h-4 w-12 bg-zinc-800/80 rounded" />
                <div className="h-4 w-16 bg-zinc-800/80 rounded" />
              </div>
              <div className="h-5 w-3/4 bg-zinc-800 rounded" />
              <div className="h-3 w-1/2 bg-zinc-800/60 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="py-16 text-center space-y-4 bg-[#14141c]/50 rounded-2xl border border-white/5 p-8">
        <div className="w-12 h-12 rounded-xl bg-zinc-800/80 flex items-center justify-center mx-auto text-zinc-400">
          <SearchX className="w-6 h-6 text-[#E50914]" />
        </div>
        <div className="space-y-1">
          <h3 className="text-base font-bold text-white font-heading">No games found</h3>
          <p className="text-xs text-zinc-400 max-w-sm mx-auto">
            We couldn't find any games matching your current search criteria or genre filter.
          </p>
        </div>
        <button
          onClick={onResetFilters}
          className="px-4 py-2 rounded-xl bg-[#E50914] hover:bg-[#FF2E43] text-white text-xs font-semibold shadow-red-glow transition-all cursor-pointer"
        >
          Reset Filters
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {games.map((game) => (
        <GameCard key={game.id} game={game} onSelect={onSelectGame} />
      ))}
    </div>
  );
};

import React from 'react';
import { Star, Flame, Clock, Monitor, ChevronRight } from 'lucide-react';
import type { GameSummary } from '../../types/game';

interface GameCardProps {
  game: GameSummary;
  onSelect: (game: GameSummary) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  const releaseYear = game.release_date ? game.release_date.split('-')[0] : 'TBA';

  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative bg-[#14141c] hover:bg-[#1c1c28] border border-white/10 hover:border-[#E50914]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#E50914]/15 cursor-pointer flex flex-col"
    >
      {/* Artwork Container */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900">
        <img
          src={game.cover_image || game.background_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Dark gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#14141c] via-transparent to-black/40" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
          {/* Status Badges */}
          <div className="flex items-center gap-1.5">
            {game.is_popular && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#E50914]/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                <Flame className="w-3 h-3" />
                Popular
              </span>
            )}
            {game.is_anticipated && (
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-purple-600/90 text-white font-bold text-[10px] uppercase tracking-wider backdrop-blur-sm shadow-md">
                <Clock className="w-3 h-3" />
                Anticipated
              </span>
            )}
          </div>

          {/* Rating Badge */}
          {game.rating > 0 && (
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/75 border border-white/15 text-amber-300 font-bold text-xs backdrop-blur-md">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* PC Platform Indicator */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 text-[11px] text-zinc-300 bg-black/60 backdrop-blur-sm px-2 py-0.5 rounded-md border border-white/10 font-mono">
          <Monitor className="w-3 h-3 text-[#E50914]" />
          <span>PC</span>
        </div>
      </div>

      {/* Content Container */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Genre Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mb-1.5">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[10px] font-medium text-zinc-400 bg-white/5 border border-white/5 px-2 py-0.5 rounded-md"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-white group-hover:text-[#E50914] transition-colors line-clamp-1 font-heading">
            {game.title}
          </h3>
        </div>

        {/* Footer Meta */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
          <span>Release: {releaseYear}</span>
          <span className="flex items-center gap-0.5 text-zinc-400 group-hover:text-white transition-colors font-medium">
            Details <ChevronRight className="w-3.5 h-3.5 text-[#E50914] group-hover:translate-x-0.5 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};

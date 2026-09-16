import React from 'react';
import { Star, Flame, Clock, Monitor, ChevronRight, Award, Sparkles } from 'lucide-react';
import type { GameSummary } from '../../types/game';

interface GameCardProps {
  game: GameSummary;
  onSelect: (game: GameSummary) => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onSelect }) => {
  const releaseYear = game.release_date ? game.release_date.split('-')[0] : 'TBA';
  const posterUrl =
    game.cover_image ||
    game.background_image ||
    (game.steam_appid
      ? `https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid}/library_600x900.jpg`
      : 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg');

  // Calculate real sentiment score & label
  const scorePercent = game.metacritic || Math.round(game.rating * 20);
  const getSentimentInfo = () => {
    if (scorePercent >= 92) return { label: 'Overwhelmingly Positive', badgeClass: 'bg-emerald-500/25 text-emerald-300 border-emerald-500/50' };
    if (scorePercent >= 82) return { label: 'Very Positive', badgeClass: 'bg-teal-500/25 text-teal-300 border-teal-500/50' };
    if (scorePercent >= 70) return { label: 'Mostly Positive', badgeClass: 'bg-amber-500/25 text-amber-300 border-amber-500/50' };
    return { label: 'Positive', badgeClass: 'bg-zinc-500/25 text-zinc-300 border-zinc-500/50' };
  };

  const sentiment = getSentimentInfo();

  return (
    <div
      onClick={() => onSelect(game)}
      className="group relative bg-[#12121a] hover:bg-[#181824] border border-white/10 hover:border-[#E50914] rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_15px_35px_rgba(229,9,20,0.3)] cursor-pointer flex flex-col justify-between"
    >
      {/* Top Artwork Container with Vertical 3:4 Box Art Aspect Ratio */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-zinc-950">
        <img
          src={posterUrl}
          alt={game.title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
        />

        {/* Ambient Dark Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/20 to-black/60" />
        <div className="absolute inset-0 bg-[#E50914]/0 group-hover:bg-[#E50914]/5 transition-colors duration-300 pointer-events-none" />

        {/* Top Badges Layer */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
          {/* Status Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {game.is_popular && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E50914] text-white font-extrabold text-[10px] uppercase tracking-wider shadow-[0_0_12px_rgba(229,9,20,0.6)] backdrop-blur-md">
                <Flame className="w-3 h-3 fill-white" />
                Popular
              </span>
            )}
            {game.is_anticipated && (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-extrabold text-[10px] uppercase tracking-wider shadow-md backdrop-blur-md">
                <Clock className="w-3 h-3" />
                Anticipated
              </span>
            )}
          </div>

          {/* Real Star Rating Badge */}
          {game.rating > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/85 border border-amber-500/40 text-amber-300 font-extrabold text-xs backdrop-blur-md shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{game.rating.toFixed(1)}</span>
              <span className="text-[10px] text-amber-400/70 font-normal">/ 5</span>
            </div>
          )}
        </div>

        {/* Metacritic & Real Sentiment Badges Overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between pointer-events-none gap-2">
          {/* Sentiment Badge */}
          <span className={`px-2 py-1 rounded-lg border text-[10px] font-bold backdrop-blur-md shadow-md ${sentiment.badgeClass}`}>
            {scorePercent}% Positive
          </span>

          {game.metacritic && (
            <span className="px-2 py-1 rounded-lg bg-black/80 border border-white/20 text-white text-[10px] font-black font-mono shadow-md backdrop-blur-md">
              Meta {game.metacritic}
            </span>
          )}
        </div>

        {/* Hover Quick Action Badge Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <span className="px-4 py-2 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.6)] flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Sparkles className="w-3.5 h-3.5" /> View Game Details
          </span>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3 bg-[#12121a] flex-1 flex flex-col justify-between border-t border-white/5">
        <div className="space-y-2">
          {/* Genre Chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            {game.genres.slice(0, 3).map((genre) => (
              <span
                key={genre}
                className="text-[10px] font-medium text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md hover:border-[#E50914]/40 transition-colors"
              >
                {genre}
              </span>
            ))}
          </div>

          {/* Title */}
          <h3 className="font-extrabold text-base text-white group-hover:text-red-400 transition-colors line-clamp-1 font-heading tracking-tight">
            {game.title}
          </h3>
        </div>

        {/* Footer Meta */}
        <div className="pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400 font-medium">
          <span className="text-zinc-500">Release: <strong className="text-zinc-300">{releaseYear}</strong></span>
          <span className="flex items-center gap-1 text-zinc-300 group-hover:text-white transition-colors font-bold text-[11px] uppercase tracking-wider">
            <span>Explore</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#E50914] group-hover:translate-x-1 transition-transform" />
          </span>
        </div>
      </div>
    </div>
  );
};


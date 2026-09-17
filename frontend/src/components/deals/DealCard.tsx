import React, { useState } from 'react';
import { Tag, ExternalLink, ShoppingCart, Sparkles, ChevronRight } from 'lucide-react';
import type { DealSummary } from '../../types/deal';

interface DealCardProps {
  deal: DealSummary;
  currency: string;
  onSelectGame: (slug: string) => void;
}

export const DealCard: React.FC<DealCardProps> = ({
  deal,
  currency,
  onSelectGame,
}) => {
  const [logoError, setLogoError] = useState(false);
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const hasDiscount = deal.discount_percent > 0;

  const headerUrl =
    deal.cover_image ||
    'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/header.jpg';

  return (
    <div className="group relative bg-[#12121a] hover:bg-[#181824] border border-white/10 hover:border-[#E50914]/60 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_15px_30px_rgba(229,9,20,0.2)] flex flex-col justify-between cursor-pointer">
      
      {/* Top Artwork Container with Sleek 16:10 Landscape Capsule Aspect Ratio */}
      <div 
        onClick={() => onSelectGame(deal.game_slug)}
        className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-950"
      >
        <img
          src={headerUrl}
          alt={deal.game_title}
          loading="lazy"
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 filter brightness-90 contrast-[1.05]"
        />

        {/* Gradient Ambient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#12121a] via-[#12121a]/30 to-black/60" />
        <div className="absolute inset-0 bg-[#E50914]/0 group-hover:bg-[#E50914]/5 transition-colors duration-300 pointer-events-none" />

        {/* Top Badges Layer */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 pointer-events-none z-20">
          {/* Store Badge */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/80 backdrop-blur-md border border-white/15 text-xs font-semibold text-white shadow-md">
            {deal.store_icon ? (
              <img src={deal.store_icon} alt={deal.store_name} className="w-3.5 h-3.5 object-contain" />
            ) : (
              <ShoppingCart className="w-3.5 h-3.5 text-red-400" />
            )}
            <span className="text-[11px] font-bold">{deal.store_name}</span>
          </div>

          {/* Discount Ribbon Tag */}
          <div>
            {deal.is_free ? (
              <span className="px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-black text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(16,185,129,0.6)] backdrop-blur-md">
                100% FREE
              </span>
            ) : hasDiscount ? (
              <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(229,9,20,0.6)] backdrop-blur-md">
                <Tag className="w-3 h-3 fill-white" />
                -{Math.round(deal.discount_percent)}%
              </span>
            ) : null}
          </div>
        </div>

        {/* Bottom Deal Price Badge Overlay */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between pointer-events-none z-20">
          <div className="px-2.5 py-1 rounded-lg bg-black/85 border border-white/15 backdrop-blur-md shadow-lg flex items-baseline gap-1.5">
            <span className="font-black text-sm text-emerald-400 font-mono">
              {deal.is_free ? 'FREE' : `${currencySymbol}${deal.price.toLocaleString()}`}
            </span>
            {hasDiscount && (
              <span className="text-[10px] text-zinc-400 line-through font-mono">
                {currencySymbol}{deal.original_price.toLocaleString()}
              </span>
            )}
          </div>
        </div>

        {/* Hover Action Badge Overlay */}
        <div className="absolute inset-0 z-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/40 backdrop-blur-[2px]">
          <span className="px-3.5 py-1.5 rounded-xl bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider shadow-[0_0_20px_rgba(229,9,20,0.6)] flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <Sparkles className="w-3.5 h-3.5" /> View Game Details
          </span>
        </div>
      </div>

      {/* Content & Direct Buy Link */}
      <div className="p-3.5 space-y-2.5 bg-[#12121a] flex-1 flex flex-col justify-between border-t border-white/5">
        <div className="space-y-1.5">
          {/* Genre Tags */}
          <div className="flex flex-wrap gap-1">
            {deal.genres.slice(0, 2).map((g) => (
              <span 
                key={g} 
                className="text-[10px] font-medium text-zinc-300 bg-white/5 border border-white/10 px-2 py-0.5 rounded-md"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Game Title */}
          <h3
            onClick={() => onSelectGame(deal.game_slug)}
            className="font-extrabold text-sm sm:text-base text-white group-hover:text-red-400 transition-colors line-clamp-1 font-heading tracking-tight"
          >
            {deal.game_title}
          </h3>
        </div>

        {/* Footer Actions */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <button
            onClick={() => onSelectGame(deal.game_slug)}
            className="text-xs text-zinc-400 group-hover:text-white font-semibold transition-colors flex items-center gap-1 text-[11px]"
          >
            <span>Details</span>
            <ChevronRight className="w-3.5 h-3.5 text-[#E50914]" />
          </button>

          <a
            href={deal.deal_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold shadow-[0_0_12px_rgba(16,185,129,0.4)] transition-all shrink-0 cursor-pointer"
          >
            <span>Get Deal</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

    </div>
  );
};



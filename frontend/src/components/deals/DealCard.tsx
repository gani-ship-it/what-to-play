import React from 'react';
import { Tag, ExternalLink, ShoppingCart } from 'lucide-react';
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
  const currencySymbol = currency === 'USD' ? '$' : '₹';
  const hasDiscount = deal.discount_percent > 0;

  return (
    <div className="group relative bg-[#15151e] hover:bg-[#1d1d2b] border border-white/10 hover:border-[#E50914]/50 rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-[#E50914]/15 flex flex-col justify-between">
      {/* Artwork & Badges */}
      <div
        onClick={() => onSelectGame(deal.game_slug)}
        className="relative aspect-[16/9] w-full overflow-hidden bg-zinc-900 cursor-pointer"
      >
        <img
          src={deal.cover_image || 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80'}
          alt={deal.game_title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#15151e] via-transparent to-black/40" />

        {/* Store Pill Top-Left */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/10 text-xs font-semibold text-white">
          {deal.store_icon ? (
            <img src={deal.store_icon} alt={deal.store_name} className="w-3.5 h-3.5 object-contain" />
          ) : (
            <ShoppingCart className="w-3.5 h-3.5 text-zinc-400" />
          )}
          <span className="text-[11px]">{deal.store_name}</span>
        </div>

        {/* Discount Badge Top-Right */}
        <div className="absolute top-2.5 right-2.5">
          {deal.is_free ? (
            <span className="px-2.5 py-1 rounded-md bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider shadow-lg">
              100% FREE
            </span>
          ) : hasDiscount ? (
            <span className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#E50914] text-white font-extrabold text-xs uppercase tracking-wider shadow-red-glow">
              <Tag className="w-3 h-3" />
              -{Math.round(deal.discount_percent)}%
            </span>
          ) : null}
        </div>
      </div>

      {/* Info & Purchase Area */}
      <div className="p-4 space-y-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Genre tags */}
          <div className="flex flex-wrap gap-1 mb-1.5">
            {deal.genres.slice(0, 2).map((g) => (
              <span key={g} className="text-[10px] text-zinc-400 bg-white/5 px-2 py-0.5 rounded">
                {g}
              </span>
            ))}
          </div>

          <h3
            onClick={() => onSelectGame(deal.game_slug)}
            className="font-bold text-sm text-white group-hover:text-[#E50914] transition-colors line-clamp-1 font-heading cursor-pointer"
          >
            {deal.game_title}
          </h3>
        </div>

        {/* Pricing & CTA */}
        <div className="pt-2 border-t border-white/5 flex items-center justify-between gap-2">
          <div>
            {hasDiscount && (
              <span className="text-[11px] text-zinc-500 line-through block">
                {currencySymbol}{deal.original_price.toLocaleString()}
              </span>
            )}
            <span className="font-extrabold text-base text-white font-mono">
              {deal.is_free ? 'FREE' : `${currencySymbol}${deal.price.toLocaleString()}`}
            </span>
          </div>

          <a
            href={deal.deal_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#E50914] hover:bg-[#FF2E43] text-white text-xs font-semibold shadow-red-glow transition-all shrink-0"
          >
            <span>Get Deal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};

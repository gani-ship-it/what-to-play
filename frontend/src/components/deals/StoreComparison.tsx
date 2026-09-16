import React from 'react';
import { ExternalLink, Check, ShoppingCart, Tag } from 'lucide-react';
import type { GamePrice } from '../../types/deal';

interface StoreComparisonProps {
  prices: GamePrice[];
  currency: string;
  isLoading: boolean;
}

export const StoreComparison: React.FC<StoreComparisonProps> = ({
  prices,
  currency,
  isLoading,
}) => {
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-16 bg-white/5 rounded-xl animate-pulse border border-white/5" />
        ))}
      </div>
    );
  }

  if (!prices || prices.length === 0) {
    return (
      <div className="p-6 text-center text-zinc-400 bg-white/5 rounded-2xl border border-white/5 text-xs">
        No authorized store prices recorded for this title in {currency}.
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {prices.map((p) => {
        const hasDiscount = p.discount_percent > 0;
        return (
          <div
            key={p.id}
            className={`p-3.5 sm:p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              p.is_best_deal
                ? 'bg-emerald-950/20 border-emerald-500/40 shadow-sm'
                : 'bg-[#161620] border-white/5 hover:border-white/15'
            }`}
          >
            {/* Store Branding */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-zinc-900 border border-white/10 flex items-center justify-center p-1.5 shrink-0">
                {p.store_icon ? (
                  <img src={p.store_icon} alt={p.store_name} className="w-full h-full object-contain" />
                ) : (
                  <ShoppingCart className="w-4 h-4 text-zinc-400" />
                )}
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white font-heading">{p.store_name}</span>
                  {p.is_best_deal && (
                    <span className="flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold uppercase tracking-wider">
                      <Check className="w-3 h-3" />
                      Best Deal
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-zinc-400">Authorized Digital Retailer</span>
              </div>
            </div>

            {/* Price & Action */}
            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="text-right">
                <div className="flex items-center gap-2 justify-end">
                  {hasDiscount && (
                    <span className="text-xs text-zinc-500 line-through">
                      {currencySymbol}{p.original_price.toLocaleString()}
                    </span>
                  )}
                  <span className="font-extrabold text-base text-white font-mono">
                    {p.price === 0 ? 'FREE' : `${currencySymbol}${p.price.toLocaleString()}`}
                  </span>
                </div>

                {hasDiscount && (
                  <div className="flex items-center gap-1 justify-end">
                    <Tag className="w-3 h-3 text-[#E50914]" />
                    <span className="text-[11px] font-bold text-[#E50914]">
                      -{Math.round(p.discount_percent)}% OFF
                    </span>
                  </div>
                )}
              </div>

              <a
                href={p.deal_url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide uppercase transition-all shrink-0 ${
                  p.is_best_deal
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 text-white border border-white/10'
                }`}
              >
                <span>Buy</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        );
      })}
    </div>
  );
};

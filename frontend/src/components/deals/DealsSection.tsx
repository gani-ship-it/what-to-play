import React, { useEffect, useState, useCallback } from 'react';
import { Flame, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { fetchDeals, fetchStores } from '../../services/deals';
import { DealCard } from './DealCard';
import type { DealSummary, Store } from '../../types/deal';

interface DealsSectionProps {
  currency: string;
  onSelectGame: (slug: string) => void;
}

export const DealsSection: React.FC<DealsSectionProps> = ({
  currency,
  onSelectGame,
}) => {
  const [deals, setDeals] = useState<DealSummary[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [selectedStore, setSelectedStore] = useState<string | undefined>(undefined);
  const [ordering, setOrdering] = useState<'discount' | 'price_low' | 'price_high'>('discount');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadDeals = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await fetchDeals({
        currency,
        store_slug: selectedStore,
        ordering,
        page: 1,
        page_size: 8,
      });
      setDeals(data.items);
    } catch (err) {
      console.error('Failed to fetch deals:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currency, selectedStore, ordering]);

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  useEffect(() => {
    fetchStores().then(setStores).catch(console.error);
  }, []);

  return (
    <section id="deals" className="space-y-6 scroll-mt-20">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-[#E50914]" />
            <h2 className="text-2xl font-bold font-heading text-white">
              Biggest PC Discounts & Deals
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#E50914]/20 text-[#E50914] border border-[#E50914]/40 text-[10px] font-bold uppercase">
              Live Feed
            </span>
          </div>
          <p className="text-xs text-zinc-400">
            Compare prices across legitimate stores. No grey-market key sellers. Regional {currency} prices active.
          </p>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-400 pointer-events-none" />
            <select
              value={ordering}
              onChange={(e) => setOrdering(e.target.value as any)}
              className="pl-8 pr-6 py-2 rounded-xl bg-[#14141c] border border-white/10 hover:border-white/20 focus:border-[#E50914] focus:outline-none text-zinc-200 text-xs font-medium cursor-pointer transition-all"
            >
              <option value="discount">Biggest Discount</option>
              <option value="price_low">Lowest Price First</option>
              <option value="price_high">Highest Price First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Store Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider shrink-0 flex items-center gap-1 mr-1">
          <SlidersHorizontal className="w-3 h-3" />
          Stores:
        </span>
        <button
          onClick={() => setSelectedStore(undefined)}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
            selectedStore === undefined
              ? 'bg-[#E50914] text-white shadow-red-glow font-semibold'
              : 'bg-[#14141c] text-zinc-400 hover:text-white hover:bg-[#1f1f2a] border border-white/5'
          }`}
        >
          All Stores
        </button>
        {stores.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedStore(s.slug)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium shrink-0 transition-all cursor-pointer ${
              selectedStore === s.slug
                ? 'bg-[#E50914] text-white shadow-red-glow font-semibold'
                : 'bg-[#14141c] text-zinc-400 hover:text-white hover:bg-[#1f1f2a] border border-white/5'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Deals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-64 bg-[#14141c] rounded-2xl animate-pulse border border-white/5" />
          ))}
        </div>
      ) : deals.length === 0 ? (
        <div className="p-12 text-center text-zinc-400 bg-[#14141c]/40 rounded-2xl border border-white/5 text-xs">
          No deals found matching the selected store filter.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {deals.map((deal) => (
            <DealCard
              key={deal.id}
              deal={deal}
              currency={currency}
              onSelectGame={onSelectGame}
            />
          ))}
        </div>
      )}
    </section>
  );
};

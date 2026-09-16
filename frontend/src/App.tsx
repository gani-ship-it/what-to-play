import React, { useEffect, useState, useCallback } from 'react';
import { Gamepad2 } from 'lucide-react';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HeroSpotlight } from './components/home/HeroSpotlight';
import { DealsSection } from './components/deals/DealsSection';
import { SearchBar } from './components/games/SearchBar';
import { GameGrid } from './components/games/GameGrid';
import { GameDetailModal } from './components/games/GameDetailModal';
import { fetchGames } from './services/games';
import type { GameSummary, GameFilterParams } from './types/game';

export const App: React.FC = () => {
  // Region & Currency State (Section 11)
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR');

  // Games catalog state
  const [games, setGames] = useState<GameSummary[]>([]);
  const [isLoadingGames, setIsLoadingGames] = useState<boolean>(true);
  const [genresList, setGenresList] = useState<string[]>(['All']);
  const [totalGames, setTotalGames] = useState<number>(0);
  const [selectedGameSlug, setSelectedGameSlug] = useState<string | null>(null);

  // Filter state
  const [filters, setFilters] = useState<GameFilterParams>({
    search: '',
    genre: undefined,
    ordering: 'popular',
    page: 1,
    page_size: 20,
  });

  const loadGames = useCallback(async (currentFilters: GameFilterParams) => {
    setIsLoadingGames(true);
    try {
      const data = await fetchGames(currentFilters);
      setGames(data.items);
      setTotalGames(data.total);
      if (data.genres_available && data.genres_available.length > 0) {
        setGenresList(data.genres_available);
      }
    } catch (err) {
      console.error('Failed to load games:', err);
    } finally {
      setIsLoadingGames(false);
    }
  }, []);

  // Debounced games query
  useEffect(() => {
    const timer = setTimeout(() => {
      loadGames(filters);
    }, 250);
    return () => clearTimeout(timer);
  }, [filters, loadGames]);

  const handleFilterChange = (partial: Partial<GameFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...partial }));
  };

  const handleResetFilters = () => {
    setFilters({
      search: '',
      genre: undefined,
      ordering: 'popular',
      page: 1,
      page_size: 20,
    });
  };

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === 'INR' ? 'USD' : 'INR'));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0a0a0d] text-white selection:bg-[#E50914] selection:text-white relative overflow-hidden">
      {/* Cinematic Top Ambient Light */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-ambient-glow pointer-events-none -z-10" />

      {/* Global Navigation with interactive Currency Switcher */}
      <Navbar
        onSearchClick={() => document.getElementById('search-section')?.scrollIntoView({ behavior: 'smooth' })}
        currency={currency}
        onToggleCurrency={toggleCurrency}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-20">
        {/* Featured Game Spotlight Carousel (Steam / Epic Games Store Style) */}
        <section id="hero-spotlight" className="scroll-mt-20">
          <HeroSpotlight
            currency={currency}
            onSelectGame={(slug) => setSelectedGameSlug(slug)}
          />
        </section>

        {/* Live Deals & Store Price Comparisons Section */}
        <DealsSection
          currency={currency}
          onSelectGame={(slug) => setSelectedGameSlug(slug)}
        />

        {/* Interactive Game Discovery Section */}
        <section id="catalog-discovery" className="space-y-8 scroll-mt-20">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Gamepad2 className="w-5 h-5 text-[#E50914]" />
                <h2 className="text-2xl font-bold font-heading text-white">
                  Featured PC Games & Discovery
                </h2>
              </div>
              <p className="text-xs text-zinc-400">
                Browse popular titles, filter by genre, check PC hardware requirements, and inspect media galleries.
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div id="search-section">
            <SearchBar
              filters={filters}
              onFilterChange={handleFilterChange}
              genres={genresList}
              totalResults={totalGames}
            />
          </div>

          {/* Games Card Grid */}
          <GameGrid
            games={games}
            isLoading={isLoadingGames}
            onSelectGame={(game) => setSelectedGameSlug(game.slug)}
            onResetFilters={handleResetFilters}
          />
        </section>
      </main>

      {/* Game Details Modal Dialog with Deals & Price History Tab */}
      {selectedGameSlug && (
        <GameDetailModal
          slug={selectedGameSlug}
          currency={currency}
          onClose={() => setSelectedGameSlug(null)}
        />
      )}

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default App;

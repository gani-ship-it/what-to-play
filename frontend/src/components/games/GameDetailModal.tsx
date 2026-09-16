import React, { useEffect, useState } from 'react';
import { 
  X, 
  Star, 
  Flame, 
  Clock, 
  Heart, 
  Bell, 
  Monitor, 
  Cpu, 
  Film, 
  Layers, 
  ExternalLink,
  CheckCircle2,
  Tag,
  TrendingDown,
  Users,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon
} from 'lucide-react';
import { fetchGameDetail } from '../../services/games';
import { fetchGameStorePrices, fetchGamePriceHistory } from '../../services/deals';
import { StoreComparison } from '../deals/StoreComparison';
import { PriceHistoryChart } from '../deals/PriceHistoryChart';
import { PlayerStatsWidget } from '../players/PlayerStatsWidget';
import type { GameDetail } from '../../types/game';
import type { GamePrice, GamePriceHistoryResponse } from '../../types/deal';

interface GameDetailModalProps {
  slug: string;
  currency: string;
  onClose: () => void;
}

export const GameDetailModal: React.FC<GameDetailModalProps> = ({ slug, currency, onClose }) => {
  const [game, setGame] = useState<GameDetail | null>(null);
  const [prices, setPrices] = useState<GamePrice[]>([]);
  const [historyData, setHistoryData] = useState<GamePriceHistoryResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isLoadingDeals, setIsLoadingDeals] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedScreenshotIndex, setSelectedScreenshotIndex] = useState<number>(0);
  const [logoError, setLogoError] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'deals' | 'players' | 'media'>('overview');

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  // Fetch full game details
  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);
    setLogoError(false);
    setSelectedScreenshotIndex(0);

    fetchGameDetail(slug)
      .then((data) => {
        if (isMounted) {
          setGame(data);
          if (data.screenshots && data.screenshots.length > 0) {
            setSelectedImage(data.screenshots[0].image_url);
            setSelectedScreenshotIndex(0);
          } else {
            setSelectedImage(data.background_image || data.cover_image || null);
          }
        }
      })
      .catch((err) => {
        if (isMounted) setError(err.message || 'Failed to load game details');
      })
      .finally(() => {
        if (isMounted) setIsLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const handlePrevScreenshot = () => {
    if (!game?.screenshots.length) return;
    const nextIdx = (selectedScreenshotIndex - 1 + game.screenshots.length) % game.screenshots.length;
    setSelectedScreenshotIndex(nextIdx);
    setSelectedImage(game.screenshots[nextIdx].image_url);
  };

  const handleNextScreenshot = () => {
    if (!game?.screenshots.length) return;
    const nextIdx = (selectedScreenshotIndex + 1) % game.screenshots.length;
    setSelectedScreenshotIndex(nextIdx);
    setSelectedImage(game.screenshots[nextIdx].image_url);
  };

  // Fetch deals and price history for this game
  useEffect(() => {
    let isMounted = true;
    setIsLoadingDeals(true);

    Promise.all([
      fetchGameStorePrices(slug, currency),
      fetchGamePriceHistory(slug, currency),
    ])
      .then(([storePrices, history]) => {
        if (isMounted) {
          setPrices(storePrices);
          setHistoryData(history);
        }
      })
      .catch((err) => {
        console.error('Failed to load deals or history:', err);
      })
      .finally(() => {
        if (isMounted) setIsLoadingDeals(false);
      });

    return () => {
      isMounted = false;
    };
  }, [slug, currency]);

  const bestPrice = prices.find((p) => p.is_best_deal);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-fadeIn">
      {/* Click outside to close backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Dialog Content */}
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#111116] border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-black flex flex-col z-10">
        {/* Floating Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/60 hover:bg-[#E50914] text-white/80 hover:text-white backdrop-blur-md border border-white/10 transition-all cursor-pointer shadow-lg"
          title="Close (Esc)"
        >
          <X className="w-5 h-5" />
        </button>

        {isLoading && (
          <div className="p-20 flex flex-col items-center justify-center gap-4 text-zinc-400">
            <div className="w-10 h-10 border-3 border-[#E50914] border-t-transparent rounded-full animate-spin" />
            <p className="text-sm font-medium">Loading game details...</p>
          </div>
        )}

        {error && (
          <div className="p-16 text-center space-y-4 text-red-300">
            <p className="text-base font-semibold">{error}</p>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-semibold"
            >
              Close Window
            </button>
          </div>
        )}

        {game && (
          <div className="overflow-y-auto flex-1 scrollbar-thin">
            {/* Hero Artwork Header with Official Game Logo and Box Art Poster */}
            <div className="relative min-h-[300px] sm:min-h-[340px] w-full overflow-hidden bg-zinc-950 flex flex-col justify-end p-6 sm:p-8">
              <img
                src={game.background_image || game.cover_image || ''}
                alt={game.title}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.45] contrast-[1.15]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-[#111116]/80 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#111116] via-[#111116]/50 to-transparent" />

              {/* Header Details Overlay with Box Art & Official Studio Logo */}
              <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                <div className="flex items-end gap-5">
                  {/* Official Vertical Box Art Capsule */}
                  {game.cover_image && (
                    <div className="hidden sm:block w-24 sm:w-28 h-36 sm:h-40 rounded-xl overflow-hidden shadow-2xl border border-white/20 shrink-0 bg-black/60">
                      <img
                        src={game.cover_image}
                        alt={`${game.title} Box Art`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="space-y-3">
                    {/* Gamer Badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {game.is_popular && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#E50914] text-white font-bold text-[11px] uppercase tracking-wider shadow-red-glow">
                          <Flame className="w-3 h-3" />
                          Popular
                        </span>
                      )}
                      {game.is_anticipated && (
                        <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-purple-600 text-white font-bold text-[11px] uppercase tracking-wider">
                          <Clock className="w-3 h-3" />
                          Anticipated
                        </span>
                      )}
                      {game.rating > 0 && (
                        <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-black/70 border border-white/20 text-amber-300 font-bold text-xs backdrop-blur-md">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{game.rating.toFixed(1)} / 5</span>
                        </div>
                      )}
                      {game.metacritic && (
                        <span className="px-2 py-0.5 rounded-md bg-emerald-600/30 text-emerald-400 border border-emerald-500/40 text-xs font-bold font-mono">
                          Metacritic: {game.metacritic}
                        </span>
                      )}
                      {game.steam_appid && (
                        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                          Steam Verified
                        </span>
                      )}
                    </div>

                    {/* Official Studio Game Logo Graphic (or stylized title fallback) */}
                    <div className="space-y-1">
                      {game.steam_appid && !logoError ? (
                        <div className="py-1">
                          <img
                            src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid}/logo.png`}
                            alt={`${game.title} Official Logo`}
                            onError={() => setLogoError(true)}
                            className="max-h-16 sm:max-h-20 max-w-[260px] sm:max-w-md object-contain filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
                          />
                        </div>
                      ) : null}

                      {/* Always include text title for clarity and accessibility */}
                      <h1 className="text-2xl sm:text-4xl font-black text-white font-heading tracking-tight drop-shadow-md">
                        {game.title}
                      </h1>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-300">
                      <span>Released: <strong className="text-white">{game.release_date || 'TBA'}</strong></span>
                      <span>•</span>
                      <span>Developers: <strong className="text-white">{game.developers.join(', ') || 'N/A'}</strong></span>
                      {bestPrice && (
                        <>
                          <span>•</span>
                          <span className="text-emerald-400 font-semibold">
                            Best Price: {bestPrice.price === 0 ? 'FREE' : `${currencySymbol}${bestPrice.price.toLocaleString()}`} on {bestPrice.store_name}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 shrink-0">
                  <button
                    onClick={() => alert(`Sign in to add "${game.title}" to your Wishlist ❤️`)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white text-xs font-semibold backdrop-blur-md transition-all cursor-pointer hover:border-[#E50914]/50"
                  >
                    <Heart className="w-4 h-4 text-[#E50914]" />
                    <span>Wishlist</span>
                  </button>

                  <button
                    onClick={() => alert(`Sign in to create a Price Alert for "${game.title}" 🔔`)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF2E43] text-white text-xs font-semibold shadow-red-glow transition-all cursor-pointer"
                  >
                    <Bell className="w-4 h-4" />
                    <span>Track Price</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="px-6 border-b border-white/10 flex items-center gap-4 bg-[#14141c]">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-3 text-xs font-semibold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === 'overview'
                    ? 'border-[#E50914] text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Overview & Specs
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`py-3 text-xs font-semibold tracking-wide uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'deals'
                    ? 'border-[#E50914] text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <Tag className="w-3.5 h-3.5 text-[#E50914]" />
                <span>Store Deals & Price History ({prices.length})</span>
              </button>
              <button
                onClick={() => setActiveTab('players')}
                className={`py-3 text-xs font-semibold tracking-wide uppercase border-b-2 transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'players'
                    ? 'border-emerald-500 text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Steam Players & Stats</span>
              </button>
              <button
                onClick={() => setActiveTab('media')}
                className={`py-3 text-xs font-semibold tracking-wide uppercase border-b-2 transition-all cursor-pointer ${
                  activeTab === 'media'
                    ? 'border-[#E50914] text-white'
                    : 'border-transparent text-zinc-400 hover:text-zinc-200'
                }`}
              >
                Media & Trailers ({game.screenshots.length + game.trailers.length})
              </button>
            </div>

            {/* Tab Body */}
            <div className="p-6 space-y-8">
              {activeTab === 'overview' && (
                <>
                  {/* Interactive Screenshot Showcase (Front and Center) */}
                  {game.screenshots && game.screenshots.length > 0 && (
                    <div className="space-y-3 bg-[#161620] p-4 sm:p-5 rounded-2xl border border-white/10">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
                          <ImageIcon className="w-4 h-4 text-[#E50914]" />
                          In-Game Screenshots ({game.screenshots.length})
                        </h3>
                        <span className="text-xs text-zinc-400 font-mono">
                          {selectedScreenshotIndex + 1} of {game.screenshots.length}
                        </span>
                      </div>

                      {/* Main Large Screenshot Display with Chevrons */}
                      <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-2xl group/ss">
                        <img
                          src={selectedImage || game.screenshots[0].image_url}
                          alt={`${game.title} Screenshot Preview`}
                          className="w-full h-full object-cover object-center transition-all duration-300"
                        />

                        {game.screenshots.length > 1 && (
                          <>
                            <button
                              onClick={handlePrevScreenshot}
                              className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-[#E50914] text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/ss:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
                              title="Previous screenshot"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            <button
                              onClick={handleNextScreenshot}
                              className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/70 hover:bg-[#E50914] text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/ss:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
                              title="Next screenshot"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}
                      </div>

                      {/* Thumbnails Ribbon */}
                      <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin">
                        {game.screenshots.map((s, idx) => {
                          const isSelected = (selectedImage || game.screenshots[0].image_url) === s.image_url;
                          return (
                            <button
                              key={s.id}
                              onClick={() => {
                                setSelectedImage(s.image_url);
                                setSelectedScreenshotIndex(idx);
                              }}
                              className={`relative aspect-video w-24 sm:w-28 rounded-lg overflow-hidden border transition-all cursor-pointer shrink-0 ${
                                isSelected
                                  ? 'border-[#E50914] scale-105 ring-2 ring-[#E50914]/50 shadow-red-glow opacity-100'
                                  : 'border-white/10 opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={s.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Summary Columns */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Description (2 cols) */}
                    <div className="lg:col-span-2 space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
                        <Layers className="w-4 h-4 text-[#E50914]" />
                        About the Game
                      </h3>
                      <p className="text-zinc-300 text-sm leading-relaxed whitespace-pre-line">
                        {game.description || 'No description available for this title.'}
                      </p>

                      {/* Genre Tags */}
                      <div className="pt-2">
                        <span className="text-xs font-semibold text-zinc-400 block mb-2">Genres & Categories:</span>
                        <div className="flex flex-wrap gap-2">
                          {game.genres.map((g) => (
                            <span
                              key={g}
                              className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-zinc-300 font-medium"
                            >
                              {g}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Meta Sidebar & Deal Summary */}
                    <div className="space-y-4">
                      {/* Best Store Deal Highlight */}
                      <div className="bg-[#181822] p-4 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white uppercase tracking-wider">Store Deals</span>
                          {bestPrice && (
                            <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase">
                              Best: {bestPrice.store_name}
                            </span>
                          )}
                        </div>
                        {bestPrice ? (
                          <div className="space-y-2">
                            <div className="flex items-baseline gap-2">
                              <span className="text-xl font-extrabold text-white font-mono">
                                {bestPrice.price === 0 ? 'FREE' : `${currencySymbol}${bestPrice.price.toLocaleString()}`}
                              </span>
                              {bestPrice.discount_percent > 0 && (
                                <span className="text-xs text-zinc-500 line-through">
                                  {currencySymbol}{bestPrice.original_price.toLocaleString()}
                                </span>
                              )}
                              {bestPrice.discount_percent > 0 && (
                                <span className="text-xs font-bold text-[#E50914]">
                                  -{Math.round(bestPrice.discount_percent)}%
                                </span>
                              )}
                            </div>
                            <button
                              onClick={() => setActiveTab('deals')}
                              className="w-full py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-colors"
                            >
                              Compare All Stores & History →
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs text-zinc-400">
                            Multi-store comparisons across Steam, Epic Games, GOG, and authorized stores.
                          </p>
                        )}
                        {game.steam_appid && (
                          <a
                            href={`https://store.steampowered.com/app/${game.steam_appid}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white font-medium hover:underline pt-1"
                          >
                            <span>Steam Store Page (AppID: {game.steam_appid})</span>
                            <ExternalLink className="w-3.5 h-3.5 text-zinc-400" />
                          </a>
                        )}
                      </div>

                      {/* Hardware Quick Summary */}
                      <div className="bg-[#181822] p-4 rounded-2xl border border-white/10 space-y-2">
                        <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <Monitor className="w-4 h-4 text-[#E50914]" />
                          PC Compatibility (Rule #22)
                        </span>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Compare user-saved CPU, GPU, and RAM with developer recommendations.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* PC System Requirements (Section 21) */}
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
                      <Cpu className="w-4 h-4 text-[#E50914]" />
                      PC System Requirements
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Minimum Specs */}
                      <div className="bg-[#16161e] p-5 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          <span>Minimum Requirements</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-line">
                          {game.pc_requirements?.minimum || 'Detailed minimum PC requirements are not specified by the publisher.'}
                        </p>
                      </div>

                      {/* Recommended Specs */}
                      <div className="bg-[#16161e] p-5 rounded-2xl border border-white/10 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-zinc-300 uppercase tracking-wider">
                          <Star className="w-4 h-4 text-amber-400" />
                          <span>Recommended Requirements</span>
                        </div>
                        <p className="text-xs text-zinc-300 leading-relaxed font-mono bg-black/40 p-3 rounded-xl border border-white/5 whitespace-pre-line">
                          {game.pc_requirements?.recommended || 'Recommended requirements are not specified by the publisher.'}
                        </p>
                      </div>
                    </div>

                    {/* Live Steam Telemetry in Overview Tab */}
                    {game.steam_appid && (
                      <div className="pt-2">
                        <PlayerStatsWidget
                          slug={game.slug}
                          gameTitle={game.title}
                          steamAppId={game.steam_appid}
                        />
                      </div>
                    )}
                  </div>
                </>
              )}

              {/* Tab: Deals & Price History (Section 12 & 13) */}
              {activeTab === 'deals' && (
                <div className="space-y-8">
                  {/* Multi-Store Comparison Section */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
                        <Tag className="w-4 h-4 text-[#E50914]" />
                        Authorized Store Prices ({currency})
                      </h3>
                      <span className="text-xs text-zinc-400">
                        Legitimate PC digital keys & direct downloads
                      </span>
                    </div>

                    <StoreComparison
                      prices={prices}
                      currency={currency}
                      isLoading={isLoadingDeals}
                    />
                  </div>

                  {/* Immutable Price History Chart */}
                  <div className="space-y-3 pt-2">
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider font-heading flex items-center gap-2">
                      <TrendingDown className="w-4 h-4 text-[#E50914]" />
                      Price History & All-Time Low Tracking
                    </h3>

                    <PriceHistoryChart
                      historyData={historyData}
                      currency={currency}
                      isLoading={isLoadingDeals}
                    />
                  </div>
                </div>
              )}

              {/* Tab: Live Steam Players & Intelligence (Section 10 & 50) */}
              {activeTab === 'players' && (
                <div className="space-y-6">
                  <PlayerStatsWidget
                    slug={game.slug}
                    gameTitle={game.title}
                    steamAppId={game.steam_appid}
                  />
                </div>
              )}

              {activeTab === 'media' && (
                <div className="space-y-6">
                  {/* Official Trailers */}
                  {game.trailers.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <Film className="w-4 h-4 text-[#E50914]" />
                        Official Trailers (Rule #9)
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {game.trailers.map((tr) => (
                          <div key={tr.id} className="space-y-2">
                            <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-white/10 shadow-lg">
                              <iframe
                                src={tr.video_url}
                                title={tr.name}
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                className="w-full h-full border-0"
                              />
                            </div>
                            <span className="text-xs font-medium text-zinc-300 block truncate">{tr.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Screenshots Gallery */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Screenshot Gallery ({game.screenshots.length} Images)
                    </h4>

                    {selectedImage && (
                      <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl">
                        <img
                          src={selectedImage}
                          alt="Screenshot Preview"
                          className="w-full h-full object-contain"
                        />
                      </div>
                    )}

                    {/* Thumbnails */}
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5 pt-2">
                      {game.screenshots.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedImage(s.image_url)}
                          className={`aspect-[16/9] rounded-lg overflow-hidden border transition-all cursor-pointer ${
                            selectedImage === s.image_url
                              ? 'border-[#E50914] scale-105 shadow-red-glow'
                              : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
                          }`}
                        >
                          <img src={s.image_url} alt="Thumbnail" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

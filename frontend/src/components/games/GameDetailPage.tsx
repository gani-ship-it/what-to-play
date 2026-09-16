import React, { useEffect, useState } from 'react';
import { 
  ArrowLeft, 
  Star, 
  Flame, 
  Clock, 
  Heart, 
  Bell, 
  Monitor, 
  Cpu, 
  Layers, 
  ExternalLink,
  CheckCircle2,
  Tag,
  TrendingDown,
  Users,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Share2,
  Sparkles,
  Maximize2,
  X,
  Zap,
  Gamepad2,
  Building,
  Calendar,
  HardDrive,
  Check,
  Award
} from 'lucide-react';
import { fetchGameDetail } from '../../services/games';
import { fetchGameStorePrices, fetchGamePriceHistory } from '../../services/deals';
import { StoreComparison } from '../deals/StoreComparison';
import { PriceHistoryChart } from '../deals/PriceHistoryChart';
import { PlayerStatsWidget } from '../players/PlayerStatsWidget';
import type { GameDetail } from '../../types/game';
import type { GamePrice, GamePriceHistoryResponse } from '../../types/deal';

interface GameDetailPageProps {
  slug: string;
  currency: string;
  onBack: () => void;
}

export const GameDetailPage: React.FC<GameDetailPageProps> = ({ slug, currency, onBack }) => {
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
  const [specTab, setSpecTab] = useState<'minimum' | 'recommended'>('recommended');
  const [isWishlisted, setIsWishlisted] = useState<boolean>(false);
  const [isAlertActive, setIsAlertActive] = useState<boolean>(false);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Show temporary toast message
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Scroll to top when page mounts
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

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

  // Helper to parse PC requirement string into structured specs
  const parseRequirements = (reqString?: string) => {
    if (!reqString) return [];
    const items = reqString.split(/(?:\||\n)+/);
    return items
      .map((item) => {
        const parts = item.split(/:\s*(.+)/);
        if (parts.length >= 2) {
          return { label: parts[0].trim(), value: parts[1].trim() };
        }
        return { label: 'System Note', value: item.trim() };
      })
      .filter((i) => i.value && i.value.length > 0);
  };

  const minSpecs = parseRequirements(game?.pc_requirements?.minimum);
  const recSpecs = parseRequirements(game?.pc_requirements?.recommended);

  return (
    <div className="w-full space-y-6 animate-fadeIn pb-16">
      {/* Interactive Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-[#E50914] text-white shadow-[0_10px_30px_rgba(229,9,20,0.5)] border border-red-400/40 text-xs font-bold animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Glassmorphic Navigation Bar */}
      <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-zinc-900/60 backdrop-blur-xl border border-white/10 shadow-lg">
        <button
          onClick={onBack}
          className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-[#E50914] text-white text-xs font-bold uppercase tracking-wider backdrop-blur-md transition-all duration-200 cursor-pointer shadow-md group hover:shadow-[0_0_20px_rgba(229,9,20,0.4)]"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Catalog</span>
        </button>

        {game && (
          <div className="flex items-center gap-3">
            <div className="text-xs text-zinc-400 font-mono hidden md:flex items-center gap-2">
              <span className="text-zinc-500">Games</span>
              <span>/</span>
              <span className="text-[#E50914] font-semibold">{game.genres[0] || 'PC'}</span>
              <span>/</span>
              <span className="text-white font-bold max-w-[200px] truncate">{game.title}</span>
            </div>

            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('Game page URL copied to clipboard! 📋');
              }}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/15 text-zinc-300 hover:text-white border border-white/10 transition-all cursor-pointer"
              title="Share Game"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="p-24 flex flex-col items-center justify-center gap-4 text-zinc-400 bg-zinc-900/40 backdrop-blur-2xl rounded-3xl border border-white/10">
          <div className="w-14 h-14 border-4 border-[#E50914] border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(229,9,20,0.4)]" />
          <p className="text-sm font-semibold tracking-wide text-zinc-300 animate-pulse">Loading game universe...</p>
        </div>
      )}

      {error && (
        <div className="p-16 text-center space-y-4 text-red-300 bg-red-950/20 rounded-3xl border border-red-500/20 backdrop-blur-xl">
          <p className="text-base font-semibold">{error}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-xl bg-[#E50914] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider shadow-lg transition-all"
          >
            Return to Store Front
          </button>
        </div>
      )}

      {game && (
        <div className="bg-[#0b0b10] border border-white/15 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          {/* ULTRA CINEMATIC HERO SECTION */}
          <div className="relative min-h-[440px] sm:min-h-[520px] w-full overflow-hidden bg-zinc-950 flex flex-col justify-end p-6 sm:p-10">
            {/* Dynamic Background Image with Blur Gradient Overlays */}
            <img
              src={game.background_image || game.cover_image || ''}
              alt={game.title}
              className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[0.4] contrast-[1.2] scale-105 transition-transform duration-1000"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-[#0b0b10]/70 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0b0b10] via-[#0b0b10]/80 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(229,9,20,0.15),transparent_60%)]" />

            {/* Hero Content Layer */}
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8">
              <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                {/* Vertical Poster Capsule with Hover Glow */}
                {game.cover_image && (
                  <div className="relative group/poster w-32 sm:w-44 h-48 sm:h-64 rounded-2xl overflow-hidden shadow-[0_15px_35px_rgba(0,0,0,0.9)] border-2 border-white/20 shrink-0 bg-black/60 shadow-black transition-all duration-300 hover:scale-105 hover:border-[#E50914]/80 hover:shadow-[0_0_30px_rgba(229,9,20,0.4)]">
                    <img
                      src={game.cover_image}
                      alt={`${game.title} Box Art`}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/poster:opacity-100 transition-opacity flex items-end p-3">
                      <span className="text-[10px] font-bold text-white uppercase tracking-wider flex items-center gap-1">
                        <Maximize2 className="w-3 h-3 text-[#E50914]" /> Official Artwork
                      </span>
                    </div>
                  </div>
                )}

                <div className="space-y-4 max-w-2xl">
                  {/* Badges Ribbon */}
                  <div className="flex flex-wrap items-center gap-2">
                    {game.is_popular && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#E50914] text-white font-bold text-[11px] uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.6)]">
                        <Flame className="w-3.5 h-3.5" />
                        Trending Hot
                      </span>
                    )}
                    {game.is_anticipated && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-[11px] uppercase tracking-wider shadow-lg">
                        <Clock className="w-3.5 h-3.5" />
                        Most Anticipated
                      </span>
                    )}
                    {game.rating > 0 && (
                      <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-black/80 border border-amber-500/30 text-amber-300 font-bold text-xs backdrop-blur-md shadow-md">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span>{game.rating.toFixed(1)} / 5.0</span>
                      </div>
                    )}
                    {game.metacritic && (
                      <span className={`px-2.5 py-1 rounded-lg border text-xs font-bold font-mono shadow-md ${
                        game.metacritic >= 90 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      }`}>
                        Metacritic: {game.metacritic}
                      </span>
                    )}
                    {game.steam_appid && (
                      <span className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                        Steam Verified
                      </span>
                    )}
                  </div>

                  {/* Title & Official Game Logo */}
                  <div className="space-y-2">
                    {game.steam_appid && !logoError ? (
                      <div className="py-1">
                        <img
                          src={`https://cdn.cloudflare.steamstatic.com/steam/apps/${game.steam_appid}/logo.png`}
                          alt={`${game.title} Official Logo`}
                          onError={() => setLogoError(true)}
                          className="max-h-24 sm:max-h-28 max-w-[280px] sm:max-w-md object-contain filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.95)]"
                        />
                      </div>
                    ) : null}

                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-400 font-heading tracking-tight drop-shadow-lg">
                      {game.title}
                    </h1>
                  </div>

                  {/* Info Chips */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-300 font-medium">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>Release: <strong className="text-white">{game.release_date || 'TBA'}</strong></span>
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1.5">
                      <Building className="w-3.5 h-3.5 text-[#E50914]" />
                      <span>Studio: <strong className="text-white">{game.developers.join(', ') || 'N/A'}</strong></span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Best Price & Action Widget */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between gap-4 shrink-0 bg-zinc-900/80 p-5 rounded-2xl border border-white/10 backdrop-blur-xl shadow-2xl">
                {bestPrice ? (
                  <div className="space-y-1 text-left lg:text-right">
                    <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider flex items-center gap-1 justify-start lg:justify-end">
                      <Award className="w-3.5 h-3.5 text-emerald-400" />
                      Lowest Store Deal ({bestPrice.store_name})
                    </span>
                    <div className="flex items-baseline gap-2 justify-start lg:justify-end">
                      <span className="text-3xl font-black text-white font-mono tracking-tight">
                        {bestPrice.price === 0 ? 'FREE' : `${currencySymbol}${bestPrice.price.toLocaleString()}`}
                      </span>
                      {bestPrice.discount_percent > 0 && (
                        <span className="text-xs text-zinc-500 line-through">
                          {currencySymbol}{bestPrice.original_price.toLocaleString()}
                        </span>
                      )}
                      {bestPrice.discount_percent > 0 && (
                        <span className="px-2 py-0.5 rounded bg-[#E50914] text-white text-xs font-black shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                          -{Math.round(bestPrice.discount_percent)}%
                        </span>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-left lg:text-right space-y-1">
                    <span className="text-xs font-bold text-zinc-300">Compare Authorized Stores</span>
                    <p className="text-[11px] text-zinc-400">Steam • Epic • GOG • Fanatical</p>
                  </div>
                )}

                <div className="flex items-center gap-2.5 pt-2 sm:pt-0">
                  <button
                    onClick={() => {
                      setIsWishlisted(!isWishlisted);
                      showToast(isWishlisted ? `Removed "${game.title}" from Wishlist` : `Saved "${game.title}" to Wishlist! ❤️`);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isWishlisted 
                        ? 'bg-[#E50914] text-white border-red-400 shadow-[0_0_15px_rgba(229,9,20,0.5)]'
                        : 'bg-white/10 hover:bg-white/20 text-white border-white/15'
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-white text-white' : 'text-[#E50914]'}`} />
                    <span>{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
                  </button>

                  <button
                    onClick={() => {
                      setIsAlertActive(!isAlertActive);
                      showToast(isAlertActive ? `Price alert turned off` : `Price Drop Alert activated for "${game.title}"! 🔔`);
                    }}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      isAlertActive 
                        ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                        : 'bg-[#E50914] hover:bg-red-600 text-white border-red-500/40 shadow-[0_0_15px_rgba(229,9,20,0.4)]'
                    }`}
                  >
                    <Bell className="w-4 h-4" />
                    <span>{isAlertActive ? 'Tracking' : 'Track Price'}</span>
                  </button>

                  {bestPrice && (
                    <a
                      href={bestPrice.deal_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-extrabold shadow-[0_0_20px_rgba(16,185,129,0.4)] transition-all"
                    >
                      <span>Buy Now</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* STICKY TAB NAVIGATION BAR */}
          <div className="sticky top-0 z-40 px-6 sm:px-10 border-y border-white/10 flex items-center gap-8 bg-[#0e0e14]/95 backdrop-blur-2xl scrollbar-none overflow-x-auto">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'overview'
                  ? 'border-[#E50914] text-white shadow-[0_10px_20px_-5px_rgba(229,9,20,0.5)]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Gamepad2 className="w-4 h-4 text-[#E50914]" />
              <span>Overview</span>
            </button>

            <button
              onClick={() => setActiveTab('deals')}
              className={`py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'deals'
                  ? 'border-[#E50914] text-white shadow-[0_10px_20px_-5px_rgba(229,9,20,0.5)]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <Tag className="w-4 h-4 text-[#E50914]" />
              <span>Store Deals & History</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-zinc-300 font-mono">
                {prices.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('players')}
              className={`py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'players'
                  ? 'border-cyan-400 text-white shadow-[0_10px_20px_-5px_rgba(6,182,212,0.5)]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
              </span>
              <Users className="w-4 h-4 text-cyan-400" />
              <span>Steam Live Players</span>
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`py-4 text-xs font-bold tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 shrink-0 ${
                activeTab === 'media'
                  ? 'border-[#E50914] text-white shadow-[0_10px_20px_-5px_rgba(229,9,20,0.5)]'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#E50914]" />
              <span>Screenshots</span>
              <span className="px-2 py-0.5 rounded-full bg-white/10 text-[10px] text-zinc-300 font-mono">
                {game.screenshots.length}
              </span>
            </button>
          </div>

          {/* PAGE MAIN CONTENT */}
          <div className="p-6 sm:p-10 space-y-10 bg-[#0b0b10]">
            {activeTab === 'overview' && (
              <>
                {/* COMPACT IN-GAME SCREENSHOT GALLERY */}
                {game.screenshots && game.screenshots.length > 0 && (
                  <div className="space-y-4 bg-[#12121a] p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl max-w-4xl mx-auto w-full">
                    <div className="flex items-center justify-between">
                      <h3 className="text-xs font-black text-white uppercase tracking-wider font-heading flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 text-[#E50914]" />
                        <span>In-Game Screenshot Showcase</span>
                      </h3>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {selectedScreenshotIndex + 1} / {game.screenshots.length}
                      </span>
                    </div>

                    <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/15 shadow-xl group/ss">
                      <img
                        src={selectedImage || game.screenshots[0].image_url}
                        alt={`${game.title} Screenshot Preview`}
                        className="w-full h-full object-cover object-center transition-all duration-300"
                      />

                      <button
                        onClick={() => setLightboxImage(selectedImage || game.screenshots[0].image_url)}
                        className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-[#E50914] text-white border border-white/20 backdrop-blur-md flex items-center gap-1 text-[11px] font-bold transition-all shadow-md cursor-pointer opacity-0 group-hover/ss:opacity-100"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Fullscreen Lightbox
                      </button>

                      {game.screenshots.length > 1 && (
                        <>
                          <button
                            onClick={handlePrevScreenshot}
                            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E50914] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/ss:opacity-100 shadow-lg cursor-pointer"
                            title="Previous"
                          >
                            <ChevronLeft className="w-5 h-5" />
                          </button>

                          <button
                            onClick={handleNextScreenshot}
                            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-black/70 hover:bg-[#E50914] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover/ss:opacity-100 shadow-lg cursor-pointer"
                            title="Next"
                          >
                            <ChevronRight className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>

                    {/* Mini Thumbnail Ribbon */}
                    <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-thin justify-start">
                      {game.screenshots.map((s, idx) => {
                        const isSelected = (selectedImage || game.screenshots[0].image_url) === s.image_url;
                        return (
                          <button
                            key={s.id}
                            onClick={() => {
                              setSelectedImage(s.image_url);
                              setSelectedScreenshotIndex(idx);
                            }}
                            className={`relative aspect-video w-24 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                              isSelected
                                ? 'border-[#E50914] scale-105 shadow-[0_0_12px_rgba(229,9,20,0.6)] opacity-100'
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

                {/* GAME DESCRIPTION & METADATA GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* About Section */}
                  <div className="lg:col-span-2 space-y-5 bg-[#12121a] p-6 sm:p-8 rounded-3xl border border-white/10">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-heading flex items-center gap-2.5">
                      <Layers className="w-5 h-5 text-[#E50914]" />
                      About The Game
                    </h3>
                    <p className="text-zinc-300 text-sm sm:text-base leading-relaxed whitespace-pre-line font-sans">
                      {game.description || 'No detailed description specified for this title.'}
                    </p>

                    <div className="pt-4 border-t border-white/10">
                      <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider block mb-3">
                        Genres & Categories
                      </span>
                      <div className="flex flex-wrap gap-2.5">
                        {game.genres.map((g) => (
                          <span
                            key={g}
                            className="px-3.5 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs text-zinc-200 font-semibold hover:border-[#E50914]/50 transition-colors"
                          >
                            {g}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sidebar Metadata */}
                  <div className="space-y-5">
                    {/* Store Card */}
                    <div className="bg-[#141420] p-6 rounded-3xl border border-white/10 space-y-4 shadow-xl">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-1.5">
                          <Tag className="w-4 h-4 text-[#E50914]" /> Store Comparison
                        </span>
                        {bestPrice && (
                          <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 font-bold uppercase">
                            Best Price
                          </span>
                        )}
                      </div>

                      {bestPrice ? (
                        <div className="space-y-3">
                          <div className="p-4 rounded-2xl bg-black/40 border border-white/5 space-y-1">
                            <span className="text-[11px] text-zinc-400">Current Best Available on {bestPrice.store_name}</span>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-black text-white font-mono">
                                {bestPrice.price === 0 ? 'FREE' : `${currencySymbol}${bestPrice.price.toLocaleString()}`}
                              </span>
                              {bestPrice.discount_percent > 0 && (
                                <span className="text-xs text-zinc-500 line-through font-mono">
                                  {currencySymbol}{bestPrice.original_price.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </div>

                          <button
                            onClick={() => setActiveTab('deals')}
                            className="w-full py-3 rounded-xl bg-[#E50914] hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(229,9,20,0.4)] cursor-pointer"
                          >
                            Compare All Store Deals →
                          </button>
                        </div>
                      ) : (
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          Compare authorized digital store key prices across Steam, Epic Games, GOG, and Humble Store.
                        </p>
                      )}

                      {game.steam_appid && (
                        <a
                          href={`https://store.steampowered.com/app/${game.steam_appid}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-xs text-cyan-400 hover:text-cyan-300 font-semibold hover:underline pt-1"
                        >
                          <span>Official Steam Store Page (AppID {game.steam_appid})</span>
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>

                    {/* Developer Info Card */}
                    <div className="bg-[#141420] p-6 rounded-3xl border border-white/10 space-y-3 shadow-xl">
                      <span className="text-xs font-black text-white uppercase tracking-wider flex items-center gap-2">
                        <Building className="w-4 h-4 text-[#E50914]" /> Publisher & Devs
                      </span>
                      <div className="space-y-1.5 text-xs text-zinc-300">
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-zinc-500">Developer</span>
                          <span className="font-semibold text-white">{game.developers.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-white/5">
                          <span className="text-zinc-500">Publisher</span>
                          <span className="font-semibold text-white">{game.publishers.join(', ') || 'N/A'}</span>
                        </div>
                        <div className="flex justify-between py-1">
                          <span className="text-zinc-500">Platforms</span>
                          <span className="font-semibold text-white">{game.platforms.join(', ') || 'PC'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* PC SYSTEM REQUIREMENTS GRID */}
                <div className="space-y-6 pt-4 border-t border-white/10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-heading flex items-center gap-2.5">
                      <Cpu className="w-5 h-5 text-[#E50914]" />
                      <span>PC Hardware System Requirements</span>
                    </h3>

                    {/* Requirements Switcher Tabs */}
                    <div className="flex items-center p-1 rounded-xl bg-zinc-900 border border-white/10">
                      <button
                        onClick={() => setSpecTab('minimum')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          specTab === 'minimum'
                            ? 'bg-[#E50914] text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Minimum Specs
                      </button>
                      <button
                        onClick={() => setSpecTab('recommended')}
                        className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          specTab === 'recommended'
                            ? 'bg-[#E50914] text-white shadow-md'
                            : 'text-zinc-400 hover:text-white'
                        }`}
                      >
                        Recommended Specs
                      </button>
                    </div>
                  </div>

                  {/* Formatted Spec Grid Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {(specTab === 'minimum' ? minSpecs : recSpecs).map((spec, i) => (
                      <div
                        key={i}
                        className="bg-[#141420] p-5 rounded-2xl border border-white/10 space-y-1.5 hover:border-white/20 transition-all shadow-lg"
                      >
                        <span className="text-[11px] font-bold uppercase text-[#E50914] tracking-wider flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          {spec.label}
                        </span>
                        <p className="text-xs text-zinc-200 font-mono leading-relaxed">
                          {spec.value}
                        </p>
                      </div>
                    ))}

                    {(specTab === 'minimum' ? minSpecs : recSpecs).length === 0 && (
                      <div className="col-span-full p-8 text-center bg-[#141420] rounded-2xl border border-white/10 text-zinc-400 text-xs font-mono">
                        {game.pc_requirements?.minimum || 'System specifications not explicitly detailed by publisher.'}
                      </div>
                    )}
                  </div>

                  {/* Live Player Activity Widget */}
                  {game.steam_appid && (
                    <div className="pt-4">
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

            {activeTab === 'deals' && (
              <div className="space-y-10">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider font-heading flex items-center gap-2.5">
                      <Tag className="w-5 h-5 text-[#E50914]" />
                      <span>Authorized Digital Store Comparison ({currency})</span>
                    </h3>
                    <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-4 h-4" /> Official Steam & Publisher Authorized Keys
                    </span>
                  </div>

                  <StoreComparison
                    prices={prices}
                    currency={currency}
                    isLoading={isLoadingDeals}
                  />
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <h3 className="text-sm font-black text-white uppercase tracking-wider font-heading flex items-center gap-2.5">
                    <TrendingDown className="w-5 h-5 text-[#E50914]" />
                    <span>Price History & All-Time Low (ATL) Graph</span>
                  </h3>

                  <PriceHistoryChart
                    historyData={historyData}
                    currency={currency}
                    isLoading={isLoadingDeals}
                  />
                </div>
              </div>
            )}

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
              <div className="space-y-6 max-w-5xl mx-auto">
                <div className="space-y-4">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#E50914]" />
                    Screenshot Gallery ({game.screenshots.length} High-Res Images)
                  </h4>

                  {selectedImage && (
                    <div className="relative aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden bg-black border border-white/15 shadow-2xl group">
                      <img
                        src={selectedImage}
                        alt="Screenshot Preview"
                        className="w-full h-full object-contain"
                      />
                      <button
                        onClick={() => setLightboxImage(selectedImage)}
                        className="absolute top-3 right-3 z-20 px-3 py-1.5 rounded-xl bg-black/70 hover:bg-[#E50914] text-white border border-white/20 backdrop-blur-md flex items-center gap-1.5 text-xs font-bold transition-all shadow-xl cursor-pointer"
                      >
                        <Maximize2 className="w-3.5 h-3.5" /> Fullscreen Lightbox
                      </button>
                    </div>
                  )}

                  <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5 pt-2">
                    {game.screenshots.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedImage(s.image_url)}
                        className={`aspect-[16/9] rounded-xl overflow-hidden border transition-all cursor-pointer ${
                          selectedImage === s.image_url
                            ? 'border-[#E50914] scale-105 shadow-[0_0_12px_rgba(229,9,20,0.6)]'
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

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {lightboxImage && (
        <div
          onClick={() => setLightboxImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-center justify-center p-4 sm:p-10 animate-fadeIn"
        >
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-6 right-6 p-3 rounded-full bg-white/10 hover:bg-[#E50914] text-white border border-white/20 transition-all cursor-pointer z-50 shadow-2xl"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={lightboxImage}
            alt="Fullscreen Screenshot Lightbox"
            className="max-w-full max-h-full object-contain rounded-2xl border border-white/20 shadow-2xl"
          />
        </div>
      )}
    </div>
  );
};


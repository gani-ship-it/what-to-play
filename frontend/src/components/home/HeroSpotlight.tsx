import React, { useState, useEffect, useCallback } from 'react';
import { Flame, ChevronRight, ChevronLeft, ExternalLink, ShieldCheck, Play, Pause, Sparkles, Star } from 'lucide-react';

interface FeaturedGameSpotlight {
  slug: string;
  title: string;
  tagline: string;
  genres: string[];
  backdrop: string;
  cover: string;
  discount: number;
  originalPriceINR: number;
  salePriceINR: number;
  originalPriceUSD: number;
  salePriceUSD: number;
  bestStore: string;
  dealUrl: string;
  rating: string;
}

const FEATURED_SPOTLIGHTS: FeaturedGameSpotlight[] = [
  {
    slug: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    tagline: 'An open-world action-adventure RPG set in Night City. Take on the underworld as an augmented cyber-mercenary.',
    genres: ['Action', 'RPG', 'Open World', 'Sci-Fi'],
    backdrop: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/ss_e1e5509c2a688b5840d5138f2a9d7016cf736656.1920x1080.jpg',
    cover: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1091500/library_600x900.jpg',
    discount: 65,
    originalPriceINR: 2999,
    salePriceINR: 1049,
    originalPriceUSD: 59.99,
    salePriceUSD: 20.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/1091500',
    rating: '★ 4.8 / 5',
  },
  {
    slug: 'elden-ring',
    title: 'Elden Ring',
    tagline: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring in the Lands Between.',
    genres: ['Action', 'RPG', 'Dark Fantasy', 'Souls-like'],
    backdrop: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/ss_4954a6efbe66d214a1c5d94711f185c8e31ef78f.1920x1080.jpg',
    cover: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1245620/library_600x900.jpg',
    discount: 40,
    originalPriceINR: 3599,
    salePriceINR: 2159,
    originalPriceUSD: 59.99,
    salePriceUSD: 35.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/1245620',
    rating: '★ 4.9 / 5',
  },
  {
    slug: 'baldurs-gate-3',
    title: "Baldur's Gate 3",
    tagline: 'Gather your party and return to the Forgotten Realms in a tale of fellowship, betrayal, and absolute power.',
    genres: ['RPG', 'Strategy', 'Turn-Based', 'Fantasy'],
    backdrop: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/ss_50567f2b1c67d30f73f8fb7ea5a1a1f0a1c6a287.1920x1080.jpg',
    cover: 'https://cdn.cloudflare.steamstatic.com/steam/apps/1086940/library_600x900.jpg',
    discount: 20,
    originalPriceINR: 2999,
    salePriceINR: 2399,
    originalPriceUSD: 59.99,
    salePriceUSD: 47.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/1086940',
    rating: '★ 4.9 / 5',
  },
  {
    slug: 'the-witcher-3-wild-hunt',
    title: 'The Witcher 3: Wild Hunt',
    tagline: 'Monster hunter Geralt of Rivia must track down the Child of Prophecy across a war-torn continent.',
    genres: ['RPG', 'Action', 'Open World', 'Fantasy'],
    backdrop: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/ss_1076249339e1451f28b7e6f88ed91be1a6ae2f16.1920x1080.jpg',
    cover: 'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/library_600x900.jpg',
    discount: 75,
    originalPriceINR: 1999,
    salePriceINR: 499,
    originalPriceUSD: 39.99,
    salePriceUSD: 9.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/292030',
    rating: '★ 4.9 / 5',
  },
];

const SLIDE_DURATION_MS = 6000;
const TICK_INTERVAL_MS = 50;

interface HeroSpotlightProps {
  currency: string;
  onSelectGame: (slug: string) => void;
}

export const HeroSpotlight: React.FC<HeroSpotlightProps> = ({ currency, onSelectGame }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const currencySymbol = currency === 'USD' ? '$' : '₹';

  const goToNextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % FEATURED_SPOTLIGHTS.length);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + FEATURED_SPOTLIGHTS.length) % FEATURED_SPOTLIGHTS.length);
  }, []);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
  };

  // Reset progress bar whenever active slide changes
  useEffect(() => {
    setProgress(0);
  }, [activeIndex]);

  // Auto-advance slides sequentially one-by-one every 6 seconds
  useEffect(() => {
    if (isPaused) return;

    const slideTimer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % FEATURED_SPOTLIGHTS.length);
    }, SLIDE_DURATION_MS);

    return () => clearInterval(slideTimer);
  }, [isPaused, activeIndex]);

  // Smooth progress bar update
  useEffect(() => {
    if (isPaused) return;

    const progressTimer = setInterval(() => {
      setProgress((prev) => Math.min(prev + (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100, 100));
    }, TICK_INTERVAL_MS);

    return () => clearInterval(progressTimer);
  }, [isPaused, activeIndex]);


  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/15 bg-[#0a0a0d] shadow-[0_20px_60px_rgba(0,0,0,0.9)] group select-none">
      
      {/* Background Slides with Cinematic Wallpaper & Motion Zoom Effect */}
      <div className="relative h-[480px] sm:h-[500px] lg:h-[520px] w-full overflow-hidden">
        {FEATURED_SPOTLIGHTS.map((game, idx) => (
          <div
            key={game.slug}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? 'opacity-100 z-0' : 'opacity-0 pointer-events-none'
            }`}
          >
            <img
              src={game.backdrop}
              alt={game.title}
              className="w-full h-full object-cover object-center filter brightness-[0.6] contrast-[1.15] transform scale-105 transition-transform duration-[10000ms] ease-out"
            />
          </div>
        ))}

        {/* Cinematic Multi-Stop Ambient Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0d]/95 via-[#0a0a0d]/70 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0d] via-[#0a0a0d]/30 to-black/30 z-[1]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(229,9,20,0.15),transparent_70%)] z-[1]" />

        {/* Left / Right Navigation Chevrons */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 hover:bg-[#E50914] text-white/80 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
          title="Previous game"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/70 hover:bg-[#E50914] text-white/80 hover:text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
          title="Next game"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content Overlay Layer */}
        <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10">
          
          {/* Top Row: Ribbon Badges & Slideshow Pause Control */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-lg bg-[#E50914] text-white font-black text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(229,9,20,0.6)] flex items-center gap-1.5 backdrop-blur-md">
                <Flame className="w-3.5 h-3.5 fill-white" /> Spotlight Deal
              </span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/25 border border-emerald-500/50 text-emerald-300 text-xs font-extrabold backdrop-blur-md flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                <span>{FEATURED_SPOTLIGHTS[activeIndex].rating}</span>
                <span className="text-[10px] text-emerald-300/70 font-normal">Overwhelmingly Positive</span>
              </span>
              <span className="px-3 py-1 rounded-lg bg-black/60 border border-white/15 text-xs text-zinc-200 font-semibold tracking-wide hidden sm:inline-block backdrop-blur-md">
                Historical Low on {FEATURED_SPOTLIGHTS[activeIndex].bestStore}
              </span>
            </div>

            {/* Slideshow Play / Pause Control */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-white/20 text-zinc-300 hover:text-white text-xs backdrop-blur-md transition-all cursor-pointer shadow-md"
              title={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400 fill-emerald-400" /> : <Pause className="w-3 h-3 text-[#E50914] fill-[#E50914]" />}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPaused ? 'Paused' : 'Slideshow'}
              </span>
            </button>
          </div>

          {/* Center Content Section */}
          <div className="relative h-[260px] sm:h-[270px] w-full flex items-center justify-between gap-8">
            {FEATURED_SPOTLIGHTS.map((game, idx) => {
              const isActive = activeIndex === idx;
              const originalPrice = currency === 'USD' ? game.originalPriceUSD : game.originalPriceINR;
              const salePrice = currency === 'USD' ? game.salePriceUSD : game.salePriceINR;

              return (
                <div
                  key={game.slug}
                  className={`absolute inset-0 flex items-center justify-between gap-8 transition-all duration-700 ease-in-out ${
                    isActive
                      ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                      : 'opacity-0 translate-y-4 pointer-events-none z-0'
                  }`}
                >
                  {/* Left Column: Text & Price CTA */}
                  <div className="flex flex-col justify-center space-y-4 max-w-2xl">
                    {/* Genre tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {game.genres.map((g) => (
                        <span
                          key={g}
                          className="px-2.5 py-0.5 rounded-md bg-black/70 border border-white/20 text-[11px] font-semibold text-zinc-200 backdrop-blur-md"
                        >
                          {g}
                        </span>
                      ))}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-100 to-zinc-300 font-heading tracking-tight drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
                      {game.title}
                    </h1>

                    {/* Tagline */}
                    <p className="text-zinc-200 text-xs sm:text-sm sm:leading-relaxed max-w-xl line-clamp-2 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-medium">
                      {game.tagline}
                    </p>

                    {/* Price & Action Row */}
                    <div 
                      className="pt-2 flex flex-wrap items-center gap-4"
                      onMouseEnter={() => setIsPaused(true)}
                      onMouseLeave={() => setIsPaused(false)}
                    >
                      {/* Pricing Tag */}
                      <div className="flex items-center gap-3 bg-black/80 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/15 shadow-xl">
                        <span className="px-2.5 py-1 rounded-lg bg-[#E50914] text-white font-black text-xs shadow-[0_0_10px_rgba(229,9,20,0.5)]">
                          -{game.discount}%
                        </span>
                        <span className="text-xs text-zinc-400 line-through font-mono">
                          {currencySymbol}{originalPrice.toLocaleString()}
                        </span>
                        <span className="text-2xl font-black text-white font-mono tracking-tight">
                          {currencySymbol}{salePrice.toLocaleString()}
                        </span>
                      </div>

                      {/* Primary CTA Action Buttons */}
                      <button
                        onClick={() => onSelectGame(game.slug)}
                        className="px-6 py-3 rounded-2xl bg-gradient-to-r from-[#E50914] to-red-700 hover:from-red-600 hover:to-red-800 text-white text-xs font-black uppercase tracking-wider shadow-[0_0_25px_rgba(229,9,20,0.5)] transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 border border-red-400/40"
                      >
                        <Sparkles className="w-4 h-4 text-amber-300" />
                        <span>Inspect Deals & Specs</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>

                      <a
                        href={game.dealUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold backdrop-blur-md border border-white/20 transition-all flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Store Page</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>

                  {/* Right Column: 3D Glowing Box Art Poster */}
                  <div className="hidden md:flex flex-shrink-0 items-center justify-center">
                    <div className="relative w-40 sm:w-48 lg:w-52 aspect-[3/4] rounded-2xl overflow-hidden border-2 border-white/25 shadow-[0_20px_50px_rgba(0,0,0,0.95)] transform group-hover:scale-105 transition-all duration-500 hover:border-[#E50914]/80 hover:shadow-[0_0_35px_rgba(229,9,20,0.5)] cursor-pointer"
                         onClick={() => onSelectGame(game.slug)}>
                      <img
                        src={game.cover}
                        alt={`${game.title} Official Cover`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                          View Details
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar: Platform Guarantee & Progress Bar */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-zinc-300 font-medium">
                Verified Authorized Store Deals Only • Direct PC Keys
              </span>
            </div>

            {/* Slide Counter & Interactive Progress Bar */}
            <div className="flex items-center gap-3">
              <span className="text-xs font-mono font-bold text-zinc-300 tracking-wider">
                0{activeIndex + 1} <span className="text-zinc-500">/</span> 0{FEATURED_SPOTLIGHTS.length}
              </span>

              <div className="flex items-center gap-2">
                {FEATURED_SPOTLIGHTS.map((game, idx) => {
                  const isActive = activeIndex === idx;
                  return (
                    <button
                      key={game.slug}
                      onClick={() => goToSlide(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer overflow-hidden relative ${
                        isActive
                          ? 'w-10 bg-white/20 ring-1 ring-[#E50914]/60'
                          : 'w-2.5 bg-white/25 hover:bg-white/50'
                      }`}
                      title={`Go to ${game.title}`}
                    >
                      {isActive && (
                        <div
                          className="h-full bg-gradient-to-r from-[#E50914] to-red-400 transition-all ease-linear"
                          style={{ width: `${progress}%` }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};


import React, { useState, useEffect, useCallback } from 'react';
import { Flame, ChevronRight, ChevronLeft, ExternalLink, ShieldCheck, Play, Pause } from 'lucide-react';

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
}

const FEATURED_SPOTLIGHTS: FeaturedGameSpotlight[] = [
  {
    slug: 'cyberpunk-2077',
    title: 'Cyberpunk 2077',
    tagline: 'An open-world action-adventure RPG set in Night City. Take on the underworld as an augmented cyber-mercenary.',
    genres: ['Action', 'RPG', 'Open World', 'Sci-Fi'],
    backdrop: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?auto=format&fit=crop&w=1920&q=85',
    cover: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    discount: 65,
    originalPriceINR: 2999,
    salePriceINR: 1049,
    originalPriceUSD: 59.99,
    salePriceUSD: 20.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/1091500',
  },
  {
    slug: 'elden-ring',
    title: 'Elden Ring',
    tagline: 'Rise, Tarnished, and be guided by grace to brandish the power of the Elden Ring in the Lands Between.',
    genres: ['Action', 'RPG', 'Dark Fantasy', 'Souls-like'],
    backdrop: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=85',
    cover: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80',
    discount: 40,
    originalPriceINR: 3599,
    salePriceINR: 2159,
    originalPriceUSD: 59.99,
    salePriceUSD: 35.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/1245620',
  },
  {
    slug: 'baldurs-gate-3',
    title: "Baldur's Gate 3",
    tagline: 'Gather your party and return to the Forgotten Realms in a tale of fellowship, betrayal, and absolute power.',
    genres: ['RPG', 'Strategy', 'Turn-Based', 'Fantasy'],
    backdrop: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1920&q=85',
    cover: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    discount: 20,
    originalPriceINR: 2999,
    salePriceINR: 2399,
    originalPriceUSD: 59.99,
    salePriceUSD: 47.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/1086940',
  },
  {
    slug: 'the-witcher-3-wild-hunt',
    title: 'The Witcher 3: Wild Hunt',
    tagline: 'Monster hunter Geralt of Rivia must track down the Child of Prophecy across a war-torn continent.',
    genres: ['RPG', 'Action', 'Open World', 'Fantasy'],
    backdrop: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1920&q=85',
    cover: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    discount: 75,
    originalPriceINR: 1999,
    salePriceINR: 499,
    originalPriceUSD: 39.99,
    salePriceUSD: 9.99,
    bestStore: 'Steam',
    dealUrl: 'https://store.steampowered.com/app/292030',
  },
];

const SLIDE_DURATION_MS = 5000;
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
    setProgress(0);
  }, []);

  const goToPrevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + FEATURED_SPOTLIGHTS.length) % FEATURED_SPOTLIGHTS.length);
    setProgress(0);
  }, []);

  const goToSlide = (index: number) => {
    setActiveIndex(index);
    setProgress(0);
  };

  // Continuous auto-advancing slideshow timer with smooth progress bar
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + (TICK_INTERVAL_MS / SLIDE_DURATION_MS) * 100;
        if (next >= 100) {
          goToNextSlide();
          return 0;
        }
        return next;
      });
    }, TICK_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [isPaused, goToNextSlide]);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden border border-white/10 bg-[#08080c] shadow-2xl shadow-black/80 group select-none">
      
      {/* Background Slides with 1000ms GPU-accelerated Cross-fade */}
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
              className="w-full h-full object-cover object-center filter brightness-[0.55] contrast-[1.15] transform scale-105 transition-transform duration-[8000ms] ease-out"
            />
          </div>
        ))}

        {/* Cinematic Multi-stop Dark Vignette Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080c] via-[#08080c]/85 to-transparent z-[1]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#08080c] via-[#08080c]/50 to-black/30 z-[1]" />

        {/* Left / Right Slide Navigation Chevrons */}
        <button
          onClick={goToPrevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#E50914] text-white/80 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
          title="Previous game"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button
          onClick={goToNextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-11 h-11 rounded-full bg-black/60 hover:bg-[#E50914] text-white/80 hover:text-white border border-white/15 backdrop-blur-md flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 hover:scale-110 shadow-xl cursor-pointer"
          title="Next game"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-10 lg:p-12 flex flex-col justify-between z-10">
          
          {/* Top Row: Tags & Slideshow Toggle */}
          <div className="flex items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-md bg-[#E50914] text-white font-black text-[10px] uppercase tracking-wider shadow-[0_0_12px_rgba(229,9,20,0.5)] flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" /> Spotlight Deal
              </span>
              <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold font-mono">
                95%+ Very Positive
              </span>
              <span className="text-xs text-zinc-300 font-medium tracking-wide hidden sm:inline">
                Historical Low on {FEATURED_SPOTLIGHTS[activeIndex].bestStore}
              </span>
            </div>

            {/* Slideshow Play / Pause Control */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 hover:bg-black/80 border border-white/15 text-zinc-300 hover:text-white text-xs backdrop-blur-md transition-all cursor-pointer shadow-sm"
              title={isPaused ? 'Resume slideshow' : 'Pause slideshow'}
            >
              {isPaused ? <Play className="w-3 h-3 text-emerald-400" /> : <Pause className="w-3 h-3 text-[#E50914]" />}
              <span className="text-[10px] font-bold uppercase tracking-wider">
                {isPaused ? 'Paused' : 'Slideshow'}
              </span>
            </button>
          </div>

          {/* Center Info Layers: Smooth Cross-fade between Games */}
          <div className="relative h-[220px] w-full max-w-2xl flex items-center">
            {FEATURED_SPOTLIGHTS.map((game, idx) => {
              const isActive = activeIndex === idx;
              const originalPrice = currency === 'USD' ? game.originalPriceUSD : game.originalPriceINR;
              const salePrice = currency === 'USD' ? game.salePriceUSD : game.salePriceINR;

              return (
                <div
                  key={game.slug}
                  className={`absolute inset-0 flex flex-col justify-center space-y-4 transition-all duration-700 ease-in-out ${
                    isActive
                      ? 'opacity-100 translate-y-0 pointer-events-auto z-10'
                      : 'opacity-0 translate-y-3 pointer-events-none z-0'
                  }`}
                >
                  {/* Genre tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {game.genres.map((g) => (
                      <span
                        key={g}
                        className="px-2.5 py-0.5 rounded-md bg-black/60 border border-white/15 text-[11px] font-medium text-zinc-300 backdrop-blur-md"
                      >
                        {g}
                      </span>
                    ))}
                  </div>

                  {/* Title */}
                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white font-heading tracking-tight drop-shadow-lg">
                    {game.title}
                  </h1>

                  {/* Tagline */}
                  <p className="text-zinc-300 text-xs sm:text-sm leading-relaxed max-w-xl line-clamp-2 drop-shadow">
                    {game.tagline}
                  </p>

                  {/* Price & Action Row */}
                  <div 
                    className="pt-1 flex flex-wrap items-center gap-4"
                    onMouseEnter={() => setIsPaused(true)}
                    onMouseLeave={() => setIsPaused(false)}
                  >
                    {/* Discount Tag */}
                    <div className="flex items-center gap-2.5 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/10">
                      <span className="px-2 py-0.5 rounded bg-[#E50914] text-white font-black text-xs">
                        -{game.discount}%
                      </span>
                      <span className="text-xs text-zinc-400 line-through">
                        {currencySymbol}{originalPrice.toLocaleString()}
                      </span>
                      <span className="text-xl font-extrabold text-white font-mono">
                        {currencySymbol}{salePrice.toLocaleString()}
                      </span>
                    </div>

                    {/* Action Buttons */}
                    <button
                      onClick={() => onSelectGame(game.slug)}
                      className="px-5 py-2.5 rounded-xl bg-[#E50914] hover:bg-[#FF2E43] text-white text-xs font-bold uppercase tracking-wider shadow-red-glow transition-all flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95"
                    >
                      <span>Inspect Deals & Specs</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>

                    <a
                      href={game.dealUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/15 transition-all flex items-center gap-1.5"
                    >
                      <span>Store Page</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom Bar: Platform Guarantee on Left, Sleek Progress Pills on Right */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs text-zinc-400 font-medium">
                Verified Authorized Store Deals Only • Direct PC Keys
              </span>
            </div>

            {/* Clean Minimal Progress Pills (No half-cut photos) */}
            <div className="flex items-center gap-3">
              {/* Slide Counter (e.g. 02 / 04) */}
              <span className="text-xs font-mono font-bold text-zinc-400 tracking-wider">
                0{activeIndex + 1} <span className="text-zinc-600">/</span> 0{FEATURED_SPOTLIGHTS.length}
              </span>

              {/* Progress Pills */}
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

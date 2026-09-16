import React from 'react';
import { Gamepad2, Search, User } from 'lucide-react';

interface NavbarProps {
  onSearchClick?: () => void;
  currency?: string;
  onToggleCurrency?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick }) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-[#0a0a0d]/70 backdrop-blur-md border-b border-white/[0.06] transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Title Logo - Clean & Seamless */}
        <a 
          href="#" 
          className="flex items-center gap-3 group cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E50914] to-red-900 flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.3)] group-hover:shadow-[0_0_22px_rgba(229,9,20,0.6)] transition-all duration-300 transform group-hover:scale-105">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center whitespace-nowrap">
            <span className="font-extrabold text-xl sm:text-2xl tracking-wider text-white font-heading">
              WHAT<span className="text-[#E50914] mx-1">•</span>TO<span className="text-[#E50914] mx-1">•</span>PLAY
            </span>
          </div>
        </a>

        {/* Right Controls - Search & Sign In ONLY (No Ctrl+K) */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Seamless Pill Search Bar */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-white/20 text-zinc-400 hover:text-zinc-200 text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer w-44 sm:w-64"
            title="Search games & deals"
          >
            <Search className="w-4 h-4 text-zinc-400 group-hover:text-[#E50914] transition-colors shrink-0" />
            <span className="truncate">Search games...</span>
          </button>

          {/* Seamless Blended Sign In Button */}
          <button
            className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.06] hover:bg-[#E50914] text-zinc-200 hover:text-white border border-white/15 hover:border-red-500/50 text-xs font-bold tracking-wider uppercase transition-all duration-300 active:scale-95 cursor-pointer shadow-sm hover:shadow-[0_0_20px_rgba(229,9,20,0.4)]"
          >
            <User className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </div>

      </div>
    </header>
  );
};



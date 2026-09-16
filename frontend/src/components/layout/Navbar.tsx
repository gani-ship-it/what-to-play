import React, { useState } from 'react';
import { Gamepad2, Search, Flame, Globe, User } from 'lucide-react';

interface NavbarProps {
  onSearchClick?: () => void;
  currency: string;
  onToggleCurrency: () => void;
}

interface NavLink {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

const NAV_LINKS: NavLink[] = [
  { label: 'Spotlight', href: '#hero-spotlight' },
  { label: 'Top Deals', href: '#deals', icon: <Flame className="w-3.5 h-3.5 text-[#E50914]" /> },
  { label: 'Game Catalog', href: '#catalog-discovery' },
  { label: 'Price History', href: '#deals' },
];

export const Navbar: React.FC<NavbarProps> = ({ onSearchClick, currency, onToggleCurrency }) => {
  const [activeTab, setActiveTab] = useState('Spotlight');

  return (
    <header className="sticky top-0 z-50 w-full bg-[#08080c]/90 backdrop-blur-xl border-b border-white/[0.08] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-6">
        
        {/* Brand Logo - Single Line, High-End Gaming Identity */}
        <a 
          href="#" 
          className="flex items-center gap-3 group cursor-pointer select-none shrink-0"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#E50914] to-[#990008] flex items-center justify-center shadow-[0_0_15px_rgba(229,9,20,0.4)] group-hover:shadow-[0_0_22px_rgba(229,9,20,0.7)] transition-all transform group-hover:scale-105">
            <Gamepad2 className="w-5 h-5 text-white" />
          </div>
          <div className="flex items-center whitespace-nowrap">
            <span className="font-black text-lg tracking-wider text-white font-heading">
              WHAT<span className="text-[#E50914] mx-0.5">·</span>TO<span className="text-[#E50914] mx-0.5">·</span>PLAY
            </span>
            <span className="hidden xl:inline-block ml-2.5 px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
              PC
            </span>
          </div>
        </a>

        {/* Center Nav Links - Clean & Distraction-Free */}
        <nav className="hidden md:flex items-center gap-1.5">
          {NAV_LINKS.map((link) => {
            const isActive = activeTab === link.label;
            return (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setActiveTab(link.label)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white bg-white/[0.08] shadow-inner'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/[0.04]'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
                {isActive && (
                  <span className="absolute -bottom-1.5 left-3 right-3 h-[2px] bg-[#E50914] rounded-full shadow-[0_0_8px_#E50914]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Search Trigger */}
          <button
            onClick={onSearchClick}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#12121a] hover:bg-[#1a1a24] border border-white/10 hover:border-white/20 text-zinc-400 hover:text-zinc-200 text-xs transition-all shadow-sm group"
            title="Search games & deals (Ctrl + K)"
          >
            <Search className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#E50914] transition-colors" />
            <span className="hidden sm:inline font-medium text-xs">Search...</span>
            <kbd className="hidden lg:inline-flex items-center px-1.5 py-0.2 rounded bg-black/40 text-[10px] text-zinc-400 border border-white/10 font-mono">
              Ctrl K
            </kbd>
          </button>

          {/* Region / Currency Switcher */}
          <button
            onClick={onToggleCurrency}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#12121a] hover:bg-[#1a1a24] border border-white/10 hover:border-[#E50914]/40 text-xs text-zinc-300 font-mono transition-all cursor-pointer shadow-sm group"
            title="Switch Currency (INR ₹ / USD $)"
          >
            <Globe className="w-3.5 h-3.5 text-zinc-400 group-hover:text-[#E50914] transition-colors" />
            <span className="font-bold text-xs">{currency === 'USD' ? '$ USD' : '₹ INR'}</span>
          </button>

          {/* Steam / User Account Button - Gaming styled */}
          <button
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 hover:border-[#E50914]/50 text-zinc-200 hover:text-white text-xs font-semibold tracking-wide transition-all active:scale-95 cursor-pointer"
          >
            <User className="w-3.5 h-3.5 text-[#E50914]" />
            <span className="hidden sm:inline">Sign In</span>
          </button>
        </div>
      </div>
    </header>
  );
};

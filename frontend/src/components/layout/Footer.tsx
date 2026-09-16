import React from 'react';
import { Gamepad2, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full bg-[#0d0d12] border-t border-white/10 mt-20 text-zinc-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center text-white shadow-red-glow">
                <Gamepad2 className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg text-white tracking-wider font-heading">
                WHAT-TO-PLAY<span className="text-[#E50914]">.</span>
              </span>
            </div>
            <p className="text-zinc-400 text-xs leading-relaxed max-w-md">
              A modern PC game discovery, deal tracking, price history, and personal gaming command center.
              Discover games, compare authorized store prices, verify PC specs, and never miss a limited-time giveaway.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-emerald-400 pt-1">
              <ShieldCheck className="w-4 h-4" />
              <span>100% Authorized & Legitimate Stores only. No grey-market key resellers.</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Exploration</h4>
            <ul className="space-y-2">
              <li><a href="#discover" className="hover:text-white transition-colors">Game Discovery</a></li>
              <li><a href="#deals" className="hover:text-white transition-colors">Current Deals & Discounts</a></li>
              <li><a href="#free" className="hover:text-white transition-colors">Free Games & Giveaways</a></li>
              <li><a href="#popular" className="hover:text-white transition-colors">Most Played (Steam)</a></li>
              <li><a href="#anticipated" className="hover:text-white transition-colors">Most Anticipated Games</a></li>
            </ul>
          </div>

          {/* Data Sources & Transparency */}
          <div className="space-y-2.5">
            <h4 className="font-semibold text-white uppercase tracking-wider text-[11px]">Data Attribution</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>RAWG Video Games Database</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>CheapShark Deal Engine</span>
              </li>
              <li className="flex items-center gap-1.5 hover:text-white transition-colors">
                <span>Steam Web API (Valve Corp)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© {new Date().getFullYear()} What-To-Play (WTP). Built for PC gamers worldwide.</p>
          <div className="flex items-center gap-4">
            <span className="inline-flex items-center gap-1 text-zinc-400">
              Phase 1: Foundation Operational
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

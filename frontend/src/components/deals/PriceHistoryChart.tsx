import React, { useState } from 'react';
import { TrendingDown, Star } from 'lucide-react';
import type { GamePriceHistoryResponse, PriceHistoryPoint } from '../../types/deal';

interface PriceHistoryChartProps {
  historyData: GamePriceHistoryResponse | null;
  currency: string;
  isLoading: boolean;
}

export const PriceHistoryChart: React.FC<PriceHistoryChartProps> = ({
  historyData,
  currency,
  isLoading,
}) => {
  const [activePoint, setActivePoint] = useState<PriceHistoryPoint | null>(null);
  const currencySymbol = currency === 'USD' ? '$' : '₹';

  if (isLoading) {
    return <div className="h-64 bg-white/5 rounded-2xl animate-pulse border border-white/5" />;
  }

  if (!historyData || historyData.history_points.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-400 bg-[#161620] rounded-2xl border border-white/5 text-xs">
        No price history recorded yet for this title in {currency}.
      </div>
    );
  }

  const points = historyData.history_points;
  const atl = historyData.historical_low;

  // Calculate scales for SVG
  const prices = points.map((p) => p.price);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const priceRange = maxPrice === minPrice ? 1 : maxPrice - minPrice;

  const width = 600;
  const height = 220;
  const paddingX = 40;
  const paddingY = 30;

  const graphWidth = width - paddingX * 2;
  const graphHeight = height - paddingY * 2;

  // Map data points to SVG coordinates
  const svgCoords = points.map((p, index) => {
    const x = paddingX + (index / (points.length - 1 || 1)) * graphWidth;
    // Lower price = lower y (higher visually)
    const y = paddingY + graphHeight - ((p.price - minPrice) / priceRange) * graphHeight;
    return { x, y, point: p };
  });

  const pathData = svgCoords.reduce((acc, coord, idx) => {
    return `${acc} ${idx === 0 ? 'M' : 'L'} ${coord.x},${coord.y}`;
  }, '');

  const areaData = `${pathData} L ${svgCoords[svgCoords.length - 1].x},${height - paddingY} L ${svgCoords[0].x},${height - paddingY} Z`;

  return (
    <div className="bg-[#14141d] p-5 sm:p-6 rounded-2xl border border-white/10 space-y-5">
      {/* Historical Low Banner */}
      {atl && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Star className="w-4 h-4 fill-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-amber-400 tracking-wider">
                All-Time Historical Low (Section 13)
              </span>
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold text-white font-mono">
                  {currencySymbol}{atl.lowest_price.toLocaleString()}
                </span>
                <span className="text-xs text-amber-300 font-semibold">
                  (-{Math.round(atl.highest_discount)}% OFF)
                </span>
                <span className="text-xs text-zinc-400">on {atl.store_name}</span>
              </div>
            </div>
          </div>

          <div className="text-right text-xs text-zinc-400">
            <span>Recorded: {new Date(atl.lowest_price_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
          </div>
        </div>
      )}

      {/* SVG Chart */}
      <div className="relative w-full overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible"
        >
          <defs>
            <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#E50914" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#E50914" stopOpacity="0.0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1={paddingX}
            y1={paddingY}
            x2={width - paddingX}
            y2={paddingY}
            stroke="rgba(255,255,255,0.06)"
            strokeDasharray="4"
          />
          <line
            x1={paddingX}
            y1={height - paddingY}
            x2={width - paddingX}
            y2={height - paddingY}
            stroke="rgba(255,255,255,0.1)"
          />

          {/* Area fill */}
          <path d={areaData} fill="url(#priceGradient)" />

          {/* Line stroke */}
          <path
            d={pathData}
            fill="none"
            stroke="#E50914"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Interactive Data Points */}
          {svgCoords.map((coord, idx) => {
            const isLowest = coord.point.price === minPrice;
            const isHovered = activePoint === coord.point;

            return (
              <g key={idx} className="cursor-pointer" onMouseEnter={() => setActivePoint(coord.point)}>
                <circle
                  cx={coord.x}
                  cy={coord.y}
                  r={isLowest ? 6 : isHovered ? 5 : 4}
                  fill={isLowest ? '#F59E0B' : '#FFFFFF'}
                  stroke="#E50914"
                  strokeWidth={isLowest ? 3 : 2}
                  className="transition-transform duration-200 hover:scale-150"
                />
              </g>
            );
          })}
        </svg>

        {/* Hover Tooltip display */}
        {activePoint && (
          <div className="mt-3 p-3 rounded-xl bg-zinc-900/90 border border-white/10 text-xs flex items-center justify-between gap-4 backdrop-blur-md animate-fadeIn">
            <div className="flex items-center gap-2">
              <TrendingDown className="w-4 h-4 text-[#E50914]" />
              <span className="font-bold text-white">
                {currencySymbol}{activePoint.price.toLocaleString()}
              </span>
              <span className="text-zinc-400">(-{Math.round(activePoint.discount_percent)}%)</span>
            </div>
            <div className="flex items-center gap-3 text-zinc-400 text-[11px]">
              <span>Store: <strong className="text-zinc-200">{activePoint.store_name}</strong></span>
              <span>•</span>
              <span>{new Date(activePoint.recorded_at).toLocaleDateString()}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-[11px] text-zinc-500 font-mono pt-1 border-t border-white/5">
        <span>Timeline: Past 6-12 Months</span>
        <span>Immutable Price Log</span>
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Award, 
  ExternalLink, 
  Play, 
  Clock, 
  Radio, 
  AlertCircle 
} from 'lucide-react';
import { fetchGamePlayerStats } from '../../services/players';
import type { PlayerStats, PlayerHistoryPoint } from '../../types/player';

interface PlayerStatsWidgetProps {
  slug: string;
  gameTitle: string;
  steamAppId?: number | null;
}

export const PlayerStatsWidget: React.FC<PlayerStatsWidgetProps> = ({
  slug,
  gameTitle,
}) => {
  const [stats, setStats] = useState<PlayerStats | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hoveredPoint, setHoveredPoint] = useState<PlayerHistoryPoint | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadStats = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchGamePlayerStats(slug);
        if (isMounted) {
          setStats(data);
        }
      } catch (err) {
        if (isMounted) {
          setError('Unable to load real-time Steam player statistics.');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadStats();
    return () => {
      isMounted = false;
    };
  }, [slug]);

  if (isLoading) {
    return (
      <div className="rounded-2xl bg-[#121218] border border-white/10 p-8 text-center space-y-4 animate-pulse">
        <div className="w-10 h-10 rounded-full bg-white/10 mx-auto" />
        <div className="h-4 w-48 bg-white/10 mx-auto rounded" />
        <div className="h-32 bg-white/5 rounded-xl" />
      </div>
    );
  }

  if (error || !stats || !stats.steam_appid) {
    return (
      <div className="rounded-2xl bg-[#121218] border border-white/10 p-6 text-center space-y-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto">
          <AlertCircle className="w-5 h-5" />
        </div>
        <h4 className="text-sm font-semibold text-white">Steam Telemetry Notice</h4>
        <p className="text-xs text-zinc-400 max-w-md mx-auto">
          {error || `Live concurrent player telemetry is currently not available for this title on the Steam network.`}
        </p>
      </div>
    );
  }

  const { current_players, peak_24h, all_time_peak, history, last_updated } = stats;

  // Chart coordinate calculations
  const chartWidth = 640;
  const chartHeight = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };

  const validHistory = history.length > 0 ? history : [];
  const minCount = validHistory.length > 0 ? Math.min(...validHistory.map((p) => p.player_count)) * 0.85 : 0;
  const maxCount = validHistory.length > 0 ? Math.max(...validHistory.map((p) => p.player_count)) * 1.1 : 1000;

  const getX = (index: number) => {
    if (validHistory.length <= 1) return padding.left;
    const innerWidth = chartWidth - padding.left - padding.right;
    return padding.left + (index / (validHistory.length - 1)) * innerWidth;
  };

  const getY = (count: number) => {
    const innerHeight = chartHeight - padding.top - padding.bottom;
    const ratio = (count - minCount) / (maxCount - minCount || 1);
    return chartHeight - padding.bottom - ratio * innerHeight;
  };

  const pathD = validHistory.reduce((acc, point, i) => {
    const x = getX(i);
    const y = getY(point.player_count);
    return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  const areaD = validHistory.length > 0
    ? `${pathD} L ${getX(validHistory.length - 1)} ${chartHeight - padding.bottom} L ${getX(0)} ${chartHeight - padding.bottom} Z`
    : '';

  const formatPlayerNumber = (num: number) => {
    return num.toLocaleString();
  };

  return (
    <div className="rounded-2xl bg-[#121218] border border-white/10 p-5 sm:p-6 space-y-6">
      
      {/* Top Header with Live Beacon */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/[0.08]">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Live Steam Telemetry
            </span>
          </div>
          <h3 className="text-lg font-bold text-white font-heading">
            {gameTitle} — Concurrent Players & Activity Trends
          </h3>
        </div>

        {/* Steam Quick Actions */}
        <div className="flex items-center gap-2">
          <a
            href={`steam://run/${stats.steam_appid}`}
            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm active:scale-95"
            title="Launch via installed Steam client"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Launch Game</span>
          </a>
          <a
            href={`https://steamcommunity.com/app/${stats.steam_appid}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-zinc-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-all"
            title="Open Steam Community Hub"
          >
            <span>Community</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Metric Cards Trio */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {/* Currently Online */}
        <div className="rounded-xl bg-[#181824] border border-emerald-500/20 p-4 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>Playing Right Now</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {formatPlayerNumber(current_players)}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium mt-1">
            Active concurrent sessions
          </div>
        </div>

        {/* 24-Hour Peak */}
        <div className="rounded-xl bg-[#181824] border border-white/10 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>24-Hour Peak</span>
            <TrendingUp className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {formatPlayerNumber(peak_24h)}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium mt-1">
            Peak within last 24 hours
          </div>
        </div>

        {/* All-Time Peak */}
        <div className="rounded-xl bg-[#181824] border border-white/10 p-4 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
            <span>All-Time Peak</span>
            <Award className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white font-mono tracking-tight">
            {formatPlayerNumber(all_time_peak)}
          </div>
          <div className="text-[11px] text-zinc-400 font-medium mt-1">
            Steam historical record
          </div>
        </div>
      </div>

      {/* Interactive 24-Hour Player Activity Chart */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-zinc-400" />
            24-Hour Player Activity Curve
          </span>
          {hoveredPoint ? (
            <div className="text-xs text-emerald-400 font-mono font-bold animate-in fade-in duration-200">
              {formatPlayerNumber(hoveredPoint.player_count)} players at{' '}
              {new Date(hoveredPoint.recorded_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          ) : (
            <span className="text-[11px] text-zinc-400 font-medium">
              Hover over graph for hourly breakdown
            </span>
          )}
        </div>

        {/* SVG Curve Container */}
        <div className="relative rounded-xl bg-[#0a0a0f] border border-white/10 p-2 overflow-hidden">
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-44 sm:h-48 overflow-visible select-none"
          >
            <defs>
              <linearGradient id="emeraldAreaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.35" />
                <stop offset="85%" stopColor="#10B981" stopOpacity="0.02" />
                <stop offset="100%" stopColor="#10B981" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid horizontal lines */}
            {[0.25, 0.5, 0.75].map((ratio) => {
              const yVal = padding.top + ratio * (chartHeight - padding.top - padding.bottom);
              return (
                <line
                  key={ratio}
                  x1={padding.left}
                  y1={yVal}
                  x2={chartWidth - padding.right}
                  y2={yVal}
                  stroke="rgba(255,255,255,0.06)"
                  strokeDasharray="4 4"
                />
              );
            })}

            {/* Shaded Area Fill */}
            {areaD && <path d={areaD} fill="url(#emeraldAreaGradient)" />}

            {/* Line Path */}
            {pathD && (
              <path
                d={pathD}
                fill="none"
                stroke="#10B981"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points & hover triggers */}
            {validHistory.map((point, idx) => {
              const cx = getX(idx);
              const cy = getY(point.player_count);
              const isHovered = hoveredPoint?.recorded_at === point.recorded_at;

              return (
                <g key={point.recorded_at}>
                  {/* Invisible wide hover target */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r="12"
                    fill="transparent"
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPoint(point)}
                    onMouseLeave={() => setHoveredPoint(null)}
                  />

                  {/* Visible data point */}
                  <circle
                    cx={cx}
                    cy={cy}
                    r={isHovered ? 5 : 2.5}
                    fill={isHovered ? '#FFFFFF' : '#10B981'}
                    stroke={isHovered ? '#10B981' : 'none'}
                    strokeWidth={isHovered ? 2 : 0}
                    className="transition-all pointer-events-none"
                  />
                </g>
              );
            })}

            {/* X-Axis bottom labels */}
            <text x={padding.left} y={chartHeight - 8} fill="#71717a" fontSize="10" fontFamily="monospace">
              24h ago
            </text>
            <text x={chartWidth / 2} y={chartHeight - 8} fill="#71717a" fontSize="10" textAnchor="middle" fontFamily="monospace">
              12h ago
            </text>
            <text x={chartWidth - padding.right} y={chartHeight - 8} fill="#10B981" fontSize="10" textAnchor="end" fontFamily="monospace" fontWeight="bold">
              Now
            </text>
          </svg>
        </div>

        {/* Footer timestamp */}
        <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
          <span>Source: Official Valve Steam Web API</span>
          <span>Updated: {new Date(last_updated).toLocaleTimeString()}</span>
        </div>
      </div>

    </div>
  );
};

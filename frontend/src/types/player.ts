export interface PlayerHistoryPoint {
  recorded_at: string;
  player_count: number;
}

export interface PlayerStats {
  game_id: number;
  slug: string;
  title: string;
  steam_appid: number | null;
  current_players: number;
  peak_24h: number;
  all_time_peak: number;
  last_updated: string;
  history: PlayerHistoryPoint[];
}

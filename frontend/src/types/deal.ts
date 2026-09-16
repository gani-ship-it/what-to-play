export interface Store {
  id: number;
  name: string;
  slug: string;
  icon_url?: string;
  is_active: boolean;
}

export interface GamePrice {
  id: number;
  store_id: number;
  store_name: string;
  store_slug: string;
  store_icon?: string;
  country: string;
  currency: string;
  price: number;
  original_price: number;
  discount_percent: number;
  deal_url: string;
  is_best_deal: boolean;
}

export interface PriceHistoryPoint {
  price: number;
  original_price: number;
  discount_percent: number;
  recorded_at: string;
  store_name: string;
}

export interface HistoricalLow {
  lowest_price: number;
  highest_discount: number;
  lowest_price_date: string;
  store_name: string;
}

export interface GamePriceHistoryResponse {
  currency: string;
  historical_low?: HistoricalLow;
  history_points: PriceHistoryPoint[];
}

export interface DealSummary {
  id: number;
  game_id: number;
  game_slug: string;
  game_title: string;
  cover_image?: string;
  genres: string[];
  store_name: string;
  store_slug: string;
  store_icon?: string;
  country: string;
  currency: string;
  price: number;
  original_price: number;
  discount_percent: number;
  deal_url: string;
  is_free: boolean;
}

export interface DealListResponse {
  items: DealSummary[];
  total: number;
  page: number;
  page_size: number;
  currency: string;
}

export interface DealFilterParams {
  currency?: string;
  store_slug?: string;
  min_discount?: number;
  ordering?: 'discount' | 'price_low' | 'price_high';
  page?: number;
  page_size?: number;
}

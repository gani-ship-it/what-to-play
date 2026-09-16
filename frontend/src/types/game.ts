export interface PCRequirements {
  minimum?: string;
  recommended?: string;
}

export interface GameScreenshot {
  id: number;
  image_url: string;
  width?: number;
  height?: number;
  is_cover: boolean;
}

export interface GameTrailer {
  id: number;
  name: string;
  video_url: string;
  preview_image?: string;
}

export interface GameSummary {
  id: number;
  slug: string;
  title: string;
  release_date?: string;
  rating: number;
  metacritic?: number;
  steam_appid?: number;
  cover_image?: string;
  background_image?: string;
  genres: string[];
  platforms: string[];
  is_popular: boolean;
  is_anticipated: boolean;
}

export interface GameDetail extends GameSummary {
  description?: string;
  developers: string[];
  publishers: string[];
  pc_requirements?: PCRequirements;
  screenshots: GameScreenshot[];
  trailers: GameTrailer[];
}

export interface GameListResponse {
  items: GameSummary[];
  total: number;
  page: number;
  page_size: number;
  genres_available: string[];
}

export interface GameFilterParams {
  search?: string;
  genre?: string;
  ordering?: 'popular' | 'rating' | 'newest' | 'name' | 'anticipated';
  page?: number;
  page_size?: number;
}

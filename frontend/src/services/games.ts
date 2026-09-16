import { apiClient } from './api';
import type { GameListResponse, GameDetail, GameFilterParams } from '../types/game';

export const fetchGames = async (params: GameFilterParams = {}): Promise<GameListResponse> => {
  const response = await apiClient.get<GameListResponse>('/games', { params });
  return response.data;
};

export const fetchGameDetail = async (slugOrId: string | number): Promise<GameDetail> => {
  const response = await apiClient.get<GameDetail>(`/games/${slugOrId}`);
  return response.data;
};

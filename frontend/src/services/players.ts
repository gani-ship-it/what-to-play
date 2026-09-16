import { apiClient } from './api';
import type { PlayerStats } from '../types/player';

export const fetchGamePlayerStats = async (
  slugOrId: string | number
): Promise<PlayerStats> => {
  const response = await apiClient.get<PlayerStats>(`/games/${slugOrId}/players`);
  return response.data;
};

import { apiClient } from './api';
import type { 
  DealListResponse, 
  DealFilterParams, 
  GamePrice, 
  GamePriceHistoryResponse, 
  Store 
} from '../types/deal';

export const fetchDeals = async (params: DealFilterParams = {}): Promise<DealListResponse> => {
  const response = await apiClient.get<DealListResponse>('/deals', { params });
  return response.data;
};

export const fetchStores = async (): Promise<Store[]> => {
  const response = await apiClient.get<Store[]>('/deals/stores');
  return response.data;
};

export const fetchGameStorePrices = async (
  slugOrId: string | number,
  currency: string = 'INR'
): Promise<GamePrice[]> => {
  const response = await apiClient.get<GamePrice[]>(`/games/${slugOrId}/deals`, {
    params: { currency },
  });
  return response.data;
};

export const fetchGamePriceHistory = async (
  slugOrId: string | number,
  currency: string = 'INR'
): Promise<GamePriceHistoryResponse> => {
  const response = await apiClient.get<GamePriceHistoryResponse>(`/games/${slugOrId}/price-history`, {
    params: { currency },
  });
  return response.data;
};

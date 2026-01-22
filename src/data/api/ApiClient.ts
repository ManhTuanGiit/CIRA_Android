import { API_BASE_URL, API_TIMEOUT } from '../../core/config/constants';
import { logger } from '../../core/utils/logger';

export class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  async get<T>(endpoint: string): Promise<T> {
    logger.info(`API GET: ${endpoint}`);
    // TODO: Implement actual API call
    return {} as T;
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    logger.info(`API POST: ${endpoint}`, data);
    // TODO: Implement actual API call
    return {} as T;
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    logger.info(`API PUT: ${endpoint}`, data);
    // TODO: Implement actual API call
    return {} as T;
  }

  async delete<T>(endpoint: string): Promise<T> {
    logger.info(`API DELETE: ${endpoint}`);
    // TODO: Implement actual API call
    return {} as T;
  }
}

export const apiClient = new ApiClient();

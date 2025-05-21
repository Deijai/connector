// src/infrastructure/http/promotion-api-client.ts
import axios, { AxiosInstance } from 'axios';
import { IPromotionApi } from '../../application/interfaces/promotion-api.interface';
import { SyncRequestDTO } from '../../application/dto/sync-request-dto';
import { SyncResponseDTO } from '../../application/dto/sync-response-dto';

export class PromotionApiClient implements IPromotionApi {
  private readonly client: AxiosInstance;

  constructor(baseUrl: string, apiKey?: string) {
    this.client = axios.create({
      baseURL: baseUrl,
      headers: {
        'Content-Type': 'application/json',
        ...(apiKey && { 'Authorization': `Bearer ${apiKey}` })
      }
    });
  }

  async sendPromotions(syncRequest: SyncRequestDTO): Promise<SyncResponseDTO> {
    try {
      const response = await this.client.post<SyncResponseDTO>('/promotions', syncRequest);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return {
          success: false,
          message: `API Error: ${error.response.status} - ${error.response.statusText}`,
          timestamp: new Date().toISOString(),
          totalSynced: 0,
          errors: [error.message]
        };
      }
      
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        timestamp: new Date().toISOString(),
        totalSynced: 0,
        errors: [error instanceof Error ? error.message : 'Unknown error']
      };
    }
  }
}
// src/application/interfaces/promotion-api.interface.ts
import { SyncRequestDTO } from '../dto/sync-request-dto';
import { SyncResponseDTO } from '../dto/sync-response-dto';

export interface IPromotionApi {
  sendPromotions(syncRequest: SyncRequestDTO): Promise<SyncResponseDTO>;
}
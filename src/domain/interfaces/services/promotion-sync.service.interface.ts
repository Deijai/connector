// src/domain/interfaces/services/promotion-sync.service.interface.ts

import { SyncResult } from "../../value-objects/sync-result";

export interface IPromotionSyncService {
  syncPromotions(): Promise<SyncResult>;
}
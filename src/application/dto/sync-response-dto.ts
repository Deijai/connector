// src/application/dto/sync-response-dto.ts
export interface SyncResponseDTO {
  success: boolean;
  message: string;
  timestamp: string; // ISO format
  totalSynced: number;
  errors?: string[];
}
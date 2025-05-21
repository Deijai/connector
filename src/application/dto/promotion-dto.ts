// src/application/dto/promotion-dto.ts
export interface PromotionDTO {
  id: string;
  name: string;
  description: string;
  originalPrice: number;
  promotionalPrice: number;
  startDate: string; // ISO format
  endDate: string;   // ISO format
  productId: string;
  storeId: string;
  active: boolean;
  createdAt: string; // ISO format
  updatedAt: string; // ISO format
}
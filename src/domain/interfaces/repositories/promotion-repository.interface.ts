// src/domain/interfaces/repositories/promotion-repository.interface.ts

import { Promotion } from "../../entities/promotion.entity";

export interface IPromotionRepository {
  findActivePromotions(): Promise<Promotion[]>;
  findPromotionsByDateRange(startDate: Date, endDate: Date): Promise<Promotion[]>;
  findPromotionsCreatedAfter(date: Date): Promise<Promotion[]>;
  findPromotionsUpdatedAfter(date: Date): Promise<Promotion[]>;
}
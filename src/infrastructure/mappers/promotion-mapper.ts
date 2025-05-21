// src/infrastructure/mappers/promotion-mapper.ts
import { Promotion } from '../../domain/entities/promotion.entity';

type PromotionDB = {
  id: string;
  name: string;
  description: string;
  original_price: number;
  promotional_price: number;
  start_date: string | Date;
  end_date: string | Date;
  product_id: string;
  store_id: string;
  active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

export class PromotionMapper {
  toDomain(raw: PromotionDB): Promotion {
    return new Promotion(
      raw.id,
      raw.name,
      raw.description,
      Number(raw.original_price),
      Number(raw.promotional_price),
      new Date(raw.start_date),
      new Date(raw.end_date),
      raw.product_id,
      raw.store_id,
      Boolean(raw.active),
      new Date(raw.created_at),
      new Date(raw.updated_at)
    );
  }
}
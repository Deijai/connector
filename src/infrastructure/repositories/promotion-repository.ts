// src/infrastructure/repositories/promotion-repository.ts
import { Promotion } from '../../domain/entities/promotion.entity';
import { IPromotionRepository } from '../../domain/interfaces/repositories/promotion-repository.interface';
import { IDatabaseClient } from '../database/database-client.interface';
import { PromotionMapper } from '../mappers/promotion-mapper';

export class PromotionRepository implements IPromotionRepository {
  constructor(
    private readonly dbClient: IDatabaseClient,
    private readonly mapper = new PromotionMapper()
  ) {}

  async findActivePromotions(): Promise<Promotion[]> {
    const currentDate = new Date().toISOString().split('T')[0];
    
    const query = `
      SELECT * FROM promotions 
      WHERE active = true 
      AND start_date <= ? 
      AND end_date >= ?
    `;
    
    const rows: any = await this.dbClient.query(query, [currentDate, currentDate]);
    return rows.map((row: any) => this.mapper.toDomain(row));
  }

  async findPromotionsByDateRange(startDate: Date, endDate: Date): Promise<Promotion[]> {
    const formattedStartDate = startDate.toISOString().split('T')[0];
    const formattedEndDate = endDate.toISOString().split('T')[0];
    
    const query = `
      SELECT * FROM promotions 
      WHERE active = true 
      AND (
        (start_date <= ? AND end_date >= ?) OR
        (start_date <= ? AND end_date >= ?) OR
        (start_date >= ? AND end_date <= ?)
      )
    `;
    
    const rows = await this.dbClient.query(query, [
      formattedEndDate, formattedEndDate,     // Case 1: Promotion starts before range end and ends after range end
      formattedStartDate, formattedStartDate, // Case 2: Promotion starts before range start and ends after range start
      formattedStartDate, formattedEndDate    // Case 3: Promotion is entirely within range
    ]);
    
    return rows.map((row: any) => this.mapper.toDomain(row));
  }
}
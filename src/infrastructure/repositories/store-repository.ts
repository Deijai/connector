// src/infrastructure/repositories/store-repository.ts
import { Store } from '../../domain/entities/store.entity';
import { IStoreRepository } from '../../domain/interfaces/repositories/store-repository.interface';
import { IDatabaseClient } from '../database/database-client.interface';
import { StoreMapper } from '../mappers/store-mapper';

export class StoreRepository implements IStoreRepository {
  constructor(
    private readonly dbClient: IDatabaseClient,
    private readonly mapper = new StoreMapper()
  ) {}

  async findById(id: string): Promise<Store | null> {
    const query = 'SELECT * FROM stores WHERE id = ? AND active = true';
    const rows = await this.dbClient.query(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return this.mapper.toDomain(rows[0] as any);
  }

  async findAll(): Promise<Store[]> {
    const query = 'SELECT * FROM stores WHERE active = true';
    const rows = await this.dbClient.query(query);
    
    return rows.map((row: any) => this.mapper.toDomain(row));
  }
}
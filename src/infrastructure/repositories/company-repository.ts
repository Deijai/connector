// src/infrastructure/repositories/company-repository.ts
import { Company } from '../../domain/entities/company.entity';
import { ICompanyRepository } from '../../domain/interfaces/repositories/company-repository.interface';
import { IDatabaseClient } from '../database/database-client.interface';
import { CompanyMapper } from '../mappers/company-mapper';

export class CompanyRepository implements ICompanyRepository {
  constructor(
    private readonly dbClient: IDatabaseClient,
    private readonly mapper = new CompanyMapper()
  ) {}

  async findById(id: string): Promise<Company | null> {
    const query = 'SELECT * FROM companies WHERE id = ? AND active = true';
    const rows = await this.dbClient.query(query, [id]);
    
    if (rows.length === 0) {
      return null;
    }
    
    return this.mapper.toDomain(rows[0]);
  }
}
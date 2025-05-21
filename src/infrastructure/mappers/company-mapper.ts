// src/infrastructure/mappers/company-mapper.ts
import { Company } from '../../domain/entities/company.entity';

type CompanyDB = {
  id: string;
  name: string;
  trading_name: string;
  cnpj: string;
  active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

export class CompanyMapper {
  toDomain(raw: CompanyDB): Company {
    return new Company(
      raw.id,
      raw.name,
      raw.trading_name,
      raw.cnpj,
      Boolean(raw.active),
      new Date(raw.created_at),
      new Date(raw.updated_at)
    );
  }
}
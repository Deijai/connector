// src/infrastructure/mappers/store-mapper.ts
import { Store } from '../../domain/entities/store.entity';

type StoreDB = {
  id: string;
  name: string;
  cnpj: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  company_id: string;
  active: boolean;
  created_at: string | Date;
  updated_at: string | Date;
};

export class StoreMapper {
  toDomain(raw: StoreDB): Store {
    return new Store(
      raw.id,
      raw.name,
      raw.cnpj,
      raw.address,
      raw.city,
      raw.state,
      raw.zip_code,
      raw.company_id,
      Boolean(raw.active),
      new Date(raw.created_at),
      new Date(raw.updated_at)
    );
  }
}
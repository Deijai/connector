// src/domain/interfaces/repositories/store-repository.interface.ts
import { Store } from "../../entities/store.entity";

export interface IStoreRepository {
  findById(id: string): Promise<Store | null>;
  findAll(): Promise<Store[]>;
}
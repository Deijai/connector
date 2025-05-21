// src/infrastructure/database/database-client.interface.ts
export interface IDatabaseClient {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  query<T>(sql: string, params?: any[]): Promise<T[]>;
}
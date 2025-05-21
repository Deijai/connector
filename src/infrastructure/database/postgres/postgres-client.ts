// src/infrastructure/database/postgres/postgres-client.ts
import { Pool, PoolClient } from 'pg';
import { IDatabaseClient } from '../database-client.interface';

export class PostgresClient implements IDatabaseClient {
  private pool: Pool | null = null;

  constructor(
    private readonly config: {
      host: string;
      port: number;
      user: string;
      password: string;
      database: string;
    }
  ) {}

  async connect(): Promise<void> {
    if (!this.pool) {
      this.pool = new Pool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        max: 20,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 2000,
      });
    }
  }

  async disconnect(): Promise<void> {
    if (this.pool) {
      await this.pool.end();
      this.pool = null;
    }
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.pool) {
      await this.connect();
    }

    try {
      const result = await this.pool!.query(sql, params);
      return result.rows as T[];
    } catch (error) {
      console.error('PostgreSQL query error:', error);
      throw error;
    }
  }
}

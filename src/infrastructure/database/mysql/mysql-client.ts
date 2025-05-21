// src/infrastructure/database/mysql/mysql-client.ts
import mysql, { Connection, Pool, PoolConnection } from 'mysql2/promise';
import { IDatabaseClient } from '../database-client.interface';

export class MySQLClient implements IDatabaseClient {
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
      this.pool = mysql.createPool({
        host: this.config.host,
        port: this.config.port,
        user: this.config.user,
        password: this.config.password,
        database: this.config.database,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
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
      const [rows] = await this.pool!.execute(sql, params);
      return rows as T[];
    } catch (error) {
      console.error('MySQL query error:', error);
      throw error;
    }
  }
}

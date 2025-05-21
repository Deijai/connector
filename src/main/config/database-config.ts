// src/main/config/database-config.ts
import { DatabaseConfig, DatabaseType } from '../../infrastructure/database/factory/database-client-factory';
import dotenv from 'dotenv';

dotenv.config();

export const databaseConfig: DatabaseConfig = {
  type: (process.env.DB_TYPE as DatabaseType) || DatabaseType.MYSQL,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
  user: process.env.DB_USER || '',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME,
  connectString: process.env.DB_CONNECT_STRING, // For Oracle
};
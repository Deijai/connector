// src/infrastructure/database/factory/database-client-factory.ts
import { IDatabaseClient } from '../database-client.interface';
import { MySQLClient } from '../mysql/mysql-client';
import { PostgresClient } from '../postgres/postgres-client';
import { OracleClient } from '../oracle/oracle-client';

export enum DatabaseType {
  MYSQL = 'mysql',
  POSTGRES = 'postgres',
  ORACLE = 'oracle'
}

export interface DatabaseConfig {
  type: DatabaseType;
  host?: string;
  port?: number;
  user: string;
  password: string;
  database?: string;
  connectString?: string;
}

export class DatabaseClientFactory {
  static create(config: DatabaseConfig): IDatabaseClient {
    switch (config.type) {
      case DatabaseType.MYSQL:
        if (!config.host || !config.port || !config.database) {
          throw new Error('Missing required MySQL configuration');
        }
        return new MySQLClient({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database
        });
      
      case DatabaseType.POSTGRES:
        if (!config.host || !config.port || !config.database) {
          throw new Error('Missing required PostgreSQL configuration');
        }
        return new PostgresClient({
          host: config.host,
          port: config.port,
          user: config.user,
          password: config.password,
          database: config.database
        });
      
      case DatabaseType.ORACLE:
        if (!config.connectString) {
          throw new Error('Missing required Oracle configuration');
        }
        return new OracleClient({
          user: config.user,
          password: config.password,
          connectString: config.connectString
        });
      
      default:
        throw new Error(`Unsupported database type: ${config.type}`);
    }
  }
}

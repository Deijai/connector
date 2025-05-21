// src/infrastructure/database/oracle/oracle-client.ts
import oracledb from 'oracledb';
import { IDatabaseClient } from '../database-client.interface';

export class OracleClient implements IDatabaseClient {
  private connection: oracledb.Connection | null = null;

  constructor(
    private readonly config: {
      user: string;
      password: string;
      connectString: string;
    }
  ) {}

  async connect(): Promise<void> {
    if (!this.connection) {
      // Set oracle client directory if needed
      // oracledb.initOracleClient({ libDir: '/opt/oracle/instantclient_19_8' });
      
      this.connection = await oracledb.getConnection({
        user: this.config.user,
        password: this.config.password,
        connectString: this.config.connectString
      });

      // Set fetchAsString for certain data types
      oracledb.fetchAsString = [oracledb.DATE, oracledb.NUMBER];
    }
  }

  async disconnect(): Promise<void> {
    if (this.connection) {
      await this.connection.close();
      this.connection = null;
    }
  }

  async query<T>(sql: string, params: any[] = []): Promise<T[]> {
    if (!this.connection) {
      await this.connect();
    }

    try {
      // Convert params to named params if necessary for Oracle
      const bindParams = Array.isArray(params) ? params : params;
      
      const result = await this.connection!.execute(sql, bindParams, {
        outFormat: oracledb.OUT_FORMAT_OBJECT,
        autoCommit: true
      });

      return result.rows as unknown as T[];
    } catch (error) {
      console.error('Oracle query error:', error);
      throw error;
    }
  }
}
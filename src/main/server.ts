// src/main/server.ts
import { DatabaseClientFactory } from '../infrastructure/database/factory/database-client-factory';
import { PromotionRepository } from '../infrastructure/repositories/promotion-repository';
import { StoreRepository } from '../infrastructure/repositories/store-repository';
import { CompanyRepository } from '../infrastructure/repositories/company-repository';
import { PromotionApiClient } from '../infrastructure/http/promotion-api-client';
import { SyncPromotionsUseCase } from '../application/use-cases/sync-promotions.use-case';
import { ExpressServer } from '../infrastructure/server/express-server';
import { databaseConfig } from './config/database-config';
import { apiConfig } from './config/api-config';

async function bootstrap() {
  try {
    // Create database client
    const dbClient = DatabaseClientFactory.create(databaseConfig);
    await dbClient.connect();
    console.log('Database connected successfully');

    // Create repositories
    const promotionRepository = new PromotionRepository(dbClient);
    const storeRepository = new StoreRepository(dbClient);
    const companyRepository = new CompanyRepository(dbClient);

    // Create API client
    const apiClient = new PromotionApiClient(apiConfig.baseUrl, apiConfig.apiKey);

    // Create use case
    const syncPromotionsUseCase = new SyncPromotionsUseCase(
      promotionRepository,
      storeRepository,
      companyRepository,
      apiClient
    );

    // Create and start server
    const server = new ExpressServer(syncPromotionsUseCase);
    server.start();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('Shutting down server...');
      await dbClient.disconnect();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('Shutting down server...');
      await dbClient.disconnect();
      process.exit(0);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();
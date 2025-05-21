// src/application/use-cases/sync-promotions.use-case.ts
import { IPromotionRepository } from '../../domain/interfaces/repositories/promotion-repository.interface';
import { IStoreRepository } from '../../domain/interfaces/repositories/store-repository.interface';
import { ICompanyRepository } from '../../domain/interfaces/repositories/company-repository.interface';
import { IPromotionApi } from '../interfaces/promotion-api.interface';
import { SyncResult } from '../../domain/value-objects/sync-result';
import { SyncRequestDTO } from '../dto/sync-request-dto';
import { Store } from '../../domain/entities/store.entity';
import { Promotion } from '../../domain/entities/promotion.entity';
import { log } from 'console';

interface SyncOptions {
  syncType?: 'all' | 'date-range' | 'new-only' | 'modified-only';
  startDate?: Date;
  endDate?: Date;
}

export class SyncPromotionsUseCase {
  constructor(
    private readonly promotionRepository: IPromotionRepository,
    private readonly storeRepository: IStoreRepository,
    private readonly companyRepository: ICompanyRepository,
    private readonly promotionApi: IPromotionApi,
  ) {}
    
  async execute(options: SyncOptions = { syncType: 'all' }): Promise<SyncResult> {
    try {
      // Determinar quais promoções buscar com base nas opções
      let promotions: Promotion[];
        
      switch (options.syncType) {
        case 'date-range':
          if (options.startDate && options.endDate) {
            promotions = await this.promotionRepository.findPromotionsByDateRange(
              options.startDate, 
              options.endDate
            );
          } else {
            throw new Error('Date range requires startDate and endDate');
          }
          break;
            
        case 'new-only':
          if (options.startDate) {
            promotions = await this.promotionRepository.findPromotionsCreatedAfter(
              options.startDate
            );
          } else {
            throw new Error('New-only requires startDate');
          }
          break;
            
        case 'modified-only':
          if (options.startDate) {
            promotions = await this.promotionRepository.findPromotionsUpdatedAfter(
              options.startDate
            );
          } else {
            throw new Error('Modified-only requires startDate');
          }
          break;
            
        case 'all':
        default:
          promotions = await this.promotionRepository.findActivePromotions();
          break;
      }
      
      log('promotions: ', promotions);
      
      if (promotions.length === 0) {
        return new SyncResult(true, 'No promotions to sync', 0);
      }

      // 2. Get stores info (assuming we need info from all stores with active promotions)
      const storeIds = [...new Set(promotions.map(promo => promo.storeId))];
      const stores = await Promise.all(
        storeIds.map(id => this.storeRepository.findById(id))
      );
      
      if (stores.some(store => !store)) {
        return new SyncResult(false, 'Some stores not found', 0);
      }

      // 3. Group promotions by store
      // Avoid using 'this' inside the reducer function by using a variable to reference 'this'
      const self = this;
      type NonNullableStore = NonNullable<Awaited<ReturnType<typeof self.storeRepository.findById>>>;
      const promotionsByStore = stores.reduce((acc, store) => {
        if (!store) return acc;
        
        acc[store.id] = {
          store,
          promotions: promotions.filter(promo => promo.storeId === store.id)
        };
        return acc;
      }, {} as Record<string, { store: NonNullableStore, promotions: Promotion[] }>);

      // 4. For each store, get company info and send promotions
      const results = await Promise.all(
        Object.values(promotionsByStore).map(async ({ store, promotions }) => {
          const company = await this.companyRepository.findById(store.companyId);
          
          if (!company) {
            return {
              success: false,
              message: `Company not found for store ${store.id}`,
              totalSynced: 0
            };
          }

          // Create sync request
          const syncRequest: SyncRequestDTO = {
            timestamp: new Date().toISOString(),
            company: {
              id: company.id,
              name: company.name,
              tradingName: company.tradingName,
              cnpj: company.cnpj,
              active: company.active
            },
            store: {
              id: store.id,
              name: store.name,
              cnpj: store.cnpj,
              address: store.address,
              city: store.city,
              state: store.state,
              zipCode: store.zipCode,
              companyId: store.companyId,
              active: store.active
            },
            promotions: promotions.map(promo => ({
              id: promo.id,
              name: promo.name,
              description: promo.description,
              originalPrice: promo.originalPrice,
              promotionalPrice: promo.promotionalPrice,
              startDate: promo.startDate.toISOString(),
              endDate: promo.endDate.toISOString(),
              productId: promo.productId,
              storeId: promo.storeId,
              active: promo.active,
              createdAt: promo.createdAt.toISOString(),
              updatedAt: promo.updatedAt.toISOString()
            }))
          };

          // Send to API
          const response = await this.promotionApi.sendPromotions(syncRequest);
          
          return {
            success: response.success,
            message: response.message,
            totalSynced: response.totalSynced
          };
        })
      );

      // 5. Combine results
      const success = results.every(result => result.success);
      const totalSynced = results.reduce((sum, result) => sum + result.totalSynced, 0);
      const errors = results
        .filter(result => !result.success)
        .map(result => new Error(result.message));

      return new SyncResult(
        success,
        success ? `Successfully synced ${totalSynced} promotions` : 'Some promotions failed to sync',
        totalSynced,
        errors.length > 0 ? errors : undefined
      );
    } catch (error) {
      return new SyncResult(
        false,
        error instanceof Error ? error.message : 'Unknown error occurred during sync',
        0,
        [error instanceof Error ? error : new Error('Unknown error')]
      );
    }
  }
}
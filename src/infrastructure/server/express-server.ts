// src/infrastructure/server/express-server.ts
import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import { SyncPromotionsUseCase } from '../../application/use-cases/sync-promotions.use-case';

export class ExpressServer {
  private app: Express;
  private port: number;

  constructor(
    private readonly syncPromotionsUseCase: SyncPromotionsUseCase,
    port = 5000
  ) {
    this.app = express();
    this.port = port;
    this.setupMiddlewares();
    this.setupRoutes();
  }

  private setupMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private setupRoutes(): void {
    this.app.get('/health', (_req: Request, res: Response): void => {
      res.status(200).json({ status: 'UP' });
    });

    this.app.post('/sync', async (req: Request, res: Response): Promise<void> => {
      try {
        const options = req.body || {};
        const { syncType = 'all', startDate, endDate } = options;
        const result = await this.syncPromotionsUseCase.execute({
          syncType,
          startDate: startDate ? new Date(startDate) : undefined,
          endDate: endDate ? new Date(endDate) : undefined
        });

        if (result.success) {
          res.status(200).json({
            success: result.success,
            message: result.message,
            totalSynced: result.totalSynced,
            syncedAt: result.syncedAt
          });
        } else {
          res.status(400).json({
            success: result.success,
            message: result.message,
            totalSynced: result.totalSynced,
            errors: result.errors?.map(err => err.message),
            syncedAt: result.syncedAt
          });
        }
      } catch (error) {
        console.error('Error during sync:', error);
        res.status(500).json({
          success: false,
          message: error instanceof Error ? error.message : 'Internal server error',
          totalSynced: 0,
          syncedAt: new Date()
        });
      }
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Connector server running at http://localhost:${this.port}`);
    });
  }
}
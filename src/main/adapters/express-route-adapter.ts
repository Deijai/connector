// src/main/adapters/express-route-adapter.ts
import { Request, Response } from 'express';

export interface Controller {
  handle: (request: any) => Promise<HttpResponse>;
}

export interface HttpResponse {
  statusCode: number;
  body: any;
}

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const request = {
      ...(req.body || {}),
      ...(req.params || {}),
      ...(req.query || {})
    };

    const httpResponse = await controller.handle(request);
    
    return res.status(httpResponse.statusCode).json(httpResponse.body);
  };
};
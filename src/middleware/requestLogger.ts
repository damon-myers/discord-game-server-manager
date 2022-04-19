import { Request, Response, NextFunction } from 'express';

export function requestLogger(req: Request, _: Response, next: NextFunction) {
  if (!process.env.DEBUG) {
    next();
  }

  console.log(`[debug] Received request body: ${JSON.stringify(req.body)}`);
  next();
}
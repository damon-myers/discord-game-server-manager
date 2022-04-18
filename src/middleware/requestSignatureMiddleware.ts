import { Request, Response, NextFunction } from 'express';
import { isValidRequestSignature } from '../util';

export async function validateSignature(req: Request, res: Response, next: NextFunction) {
  if (!isValidRequestSignature(req, process.env.DISCORD_APP_PUBLIC_KEY)) {
    res.sendStatus(401);
  }

  next();
}
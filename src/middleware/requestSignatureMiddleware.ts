import { Request, Response, NextFunction } from 'express';
import { isValidRequestSignature } from '../util';

export async function validateSignature(req: Request, res: Response, next: NextFunction) {
  if (!isValidRequestSignature(req, process.env.DISCORD_APP_PUBLIC_KEY)) {
    res.status(401).json({ message: 'invalid signature' });
  } else {
    next();
  }
}

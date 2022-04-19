import { Request, Response, NextFunction } from 'express';

export async function checkTokenMiddleware(req: Request, res: Response, next: NextFunction) {
  const botTokenAuthValue = `Bot ${process.env.DISCORD_BOT_TOKEN}`;
  if (req.get('Authorization') != botTokenAuthValue) {
    res.status(403).json({ message: 'unauthorized' });
  } else {
    next();
  }
}

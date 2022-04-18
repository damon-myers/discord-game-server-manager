import { Request, Response } from 'express';

/**
 * Discord will occasionally ping the API with a request and some signature headers
 * This Lambda responds to those requests appropriately, by verifying the request signature
 */
export async function discordPingHandler(req: Request, res: Response): Promise<void> {
  const payload = req.body;
  if (payload.type == 1) {
    res.json({ type: 1 })
  }

  res.sendStatus(400);
}
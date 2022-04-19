import 'source-map-support/register';
import { serverStatusHandler, startServerHandler, stopServerHandler } from '../commands';
import { Request, Response } from 'express';

enum SupportedCommands {
  Status = 'status',
  Start = 'start',
  Stop = 'stop',
};

export async function handleDiscordRequest(request: Request, response: Response): Promise<void> {
  const payload = request.body; // already parsed by middleware
  console.log(`Received payload: ${JSON.stringify(payload)}`);

  if (!payload || Object.keys(payload).length === 0) {
    response.status(400).send("bad request - no payload");
    return;
  }

  const subcommandName = payload.data && payload.data.options && payload.data.options[0].name;

  switch (subcommandName) {
    case SupportedCommands.Status:
      await serverStatusHandler(response);
      break;
    case SupportedCommands.Start:
      await startServerHandler(response)
      break;
    case SupportedCommands.Stop:
      await stopServerHandler(response);
      break;
    default:
      response.status(400).send("bad request - unsupported command");
      return;
  }
};
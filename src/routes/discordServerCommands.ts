import 'source-map-support/register';
import { Interaction, InteractionType } from 'slash-commands';
import { discordPingHandler, serverStatusHandler, startServerHandler, stopServerHandler } from '../commands';
import { Request, Response } from 'express';

enum SupportedCommands {
  Status = 'status',
  Start = 'start',
  Stop = 'stop',
};

export async function handleDiscordRequest(request: Request, response: Response): Promise<void> {
  const payload: Interaction = request.body;

  const type: InteractionType = payload.type;
  if (type === InteractionType.PING) {
    discordPingHandler(request, response);
  } else {
    const subcommandName = payload.data && payload.data.options && payload.data.options[0].name;

    switch (subcommandName) {
      case SupportedCommands.Status:
        serverStatusHandler(response);
        break;
      case SupportedCommands.Start:
        startServerHandler(response)
        break;
      case SupportedCommands.Stop:
        stopServerHandler(response);
        break;
      default:
        response.status(400).send("bad request");
        return;
    }
  }
};
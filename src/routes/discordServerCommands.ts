import 'source-map-support/register';
import { serverStatusHandler, startServerHandler, stopServerHandler } from '../commands';
import { Request, Response } from 'express';
import { InteractionResponseType } from 'discord-interactions';
import { Interaction } from 'slash-commands';
import { editInteractionResponse } from '../util';

enum SupportedCommands {
  Status = 'status',
  Start = 'start',
  Stop = 'stop',
};

const acknowledgeCommand = {
  type: InteractionResponseType.DEFERRED_CHANNEL_MESSAGE_WITH_SOURCE as number,
  data: {
    content: 'Command received. Processing your request...'
  }
}

async function processCommand(payload: Interaction) {
  const subcommandName = (
    payload.data && payload.data.options && payload.data.options[0].name
  ) as SupportedCommands;

  const commandHandlers = {
    [SupportedCommands.Status]: serverStatusHandler,
    [SupportedCommands.Start]: startServerHandler,
    [SupportedCommands.Stop]: stopServerHandler,
  };

  if (!commandHandlers[subcommandName]) {
    return editInteractionResponse(payload, ":exclamation: Unsupported command");
  }

  const newMessage = await commandHandlers[subcommandName](payload);

  return editInteractionResponse(payload, newMessage);
}

// We have to respond to Discord within 3 seconds of receiving an interaction request
// However, we can send follow up messages for up to 15 minutes afterwards
// `handleDiscordRequest` does this to allow more time for processing commands
export async function handleDiscordRequest(request: Request, response: Response): Promise<void> {
  const payload = request.body; // already parsed by middleware
  console.log(`Received payload: ${JSON.stringify(payload)}`);

  if (!payload || Object.keys(payload).length === 0) {
    response.status(400).send("bad request - no payload");
    return;
  }

  response.json(JSON.stringify(acknowledgeCommand));

  await processCommand(payload);
};
import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { Interaction, InteractionType } from 'slash-commands';
import { wrap } from '../util';
import { discordPingHandler, serverStatusHandler, startServerHandler, stopServerHandler } from '../commands';

enum SupportedCommands {
  Status = 'status',
  Start = 'start',
  Stop = 'stop',
};

const badRequestResponse: APIGatewayProxyResult = {
  statusCode: 400,
  body: "bad request"
};

export const handler = wrap(async function (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const payload: Interaction = JSON.parse(event.body);

  if (!payload) {
    return badRequestResponse;
  }

  const type: InteractionType = payload.type;
  if (type === InteractionType.PING) {
    return discordPingHandler(event);
  } else {
    const subcommandName = payload.data && payload.data.options && payload.data.options[0].name;

    switch (subcommandName) {
      case SupportedCommands.Status:
        return serverStatusHandler(event);
      case SupportedCommands.Start:
        return startServerHandler(event);
      case SupportedCommands.Stop:
        return stopServerHandler(event);
      default:
        return badRequestResponse;
    }
  }
});
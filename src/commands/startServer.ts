import { startInstance } from '../util';
import { InstanceStateChange } from 'aws-sdk/clients/ec2';
import { InteractionResponse, InteractionResponseType } from 'slash-commands';
import { Response } from 'express'

export async function startServerHandler(res: Response): Promise<void> {
  const ec2InstanceId = process.env.GAME_SERVER_INSTANCE_ID;

  const serverData: InstanceStateChange = await startInstance(ec2InstanceId);

  res.json(buildResponse(serverData));
}

function buildResponse(serverData: InstanceStateChange) {
  if (!serverData) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "‼️ Error - Server was not started (sowwy uwu)"
      }
    };
  }

  const serverStatusMessage = 'Server is being started. Check back in a bit with `/server status.`';

  const bodyData: InteractionResponse = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: serverStatusMessage
    }
  };

  return bodyData;
}
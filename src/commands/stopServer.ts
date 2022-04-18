import { stopInstance } from '../util';
import { InstanceStateChange } from 'aws-sdk/clients/ec2';
import { InteractionResponse, InteractionResponseType } from 'slash-commands';
import { Response } from 'express';

export async function stopServerHandler(res: Response): Promise<void> {
  const ec2InstanceId = process.env.GAME_SERVER_INSTANCE_ID;

  const serverData: InstanceStateChange = await stopInstance(ec2InstanceId);

  res.json(buildResponse(serverData));
}

function buildResponse(serverData: InstanceStateChange) {
  if (!serverData) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `
          :exclamation: Error - Server was not stopped successfully
          (please let Damon know so he saves 💰)`
      }
    };
  }

  const serverStatusMessage = 'Server is being stopped. Check back in a bit with `/server status.`';

  const data: InteractionResponse = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: serverStatusMessage
    }
  };

  return data;
}
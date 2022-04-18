import { startInstance, getSecretValue } from '../util';
import { InstanceStateChange } from 'aws-sdk/clients/ec2';
import { InteractionResponse, InteractionResponseType } from 'slash-commands';
import { Response } from 'express'

export async function startServerHandler(res: Response): Promise<void> {
  const secrets = await getSecretValue('/discord/prod');

  const ec2InstanceId = secrets.gameServerId;

  if (!ec2InstanceId) {
    res.status(500).send('failed to get server instance id');
    return;
  }

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
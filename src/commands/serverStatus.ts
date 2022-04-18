import { describeInstance, getSecretValue } from '../util';
import { Instance } from 'aws-sdk/clients/ec2';
import { InteractionResponse, InteractionResponseType } from 'slash-commands';
import { Response } from 'express';

export async function serverStatusHandler(res: Response): Promise<void> {
  const secrets = await getSecretValue('/discord/prod');

  const ec2InstanceId = secrets.gameServerId;

  if (!ec2InstanceId) {
    res.status(500).send('failed to get server instance id');
    return;
  }

  const serverData: Instance = await describeInstance(ec2InstanceId);

  res.json(responseFromServerData(serverData));
}

function responseFromServerData(serverData: Instance) {
  if (!serverData) {
    return {
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: "‼️ Error - Server could not be found"
      }
    };
  }

  const serverStatusMessage = `\n
**Server Status:**
  IP Address: ${serverData.PublicIpAddress}
  Status: ${serverData.State.Name}
  Reason: ${serverData.StateReason && serverData.StateReason.Message}
  Started At: ${serverData.LaunchTime}
  `;

  const bodyData: InteractionResponse = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: serverStatusMessage
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(bodyData)
  };
}
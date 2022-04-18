import { describeInstance } from '../util';
import { Instance } from 'aws-sdk/clients/ec2';
import { InteractionResponse, InteractionResponseType } from 'slash-commands';
import { Response } from 'express';

export async function serverStatusHandler(res: Response): Promise<void> {
  const serverData: Instance = await describeInstance(process.env.GAME_INSTANCE_SERVER_ID);

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
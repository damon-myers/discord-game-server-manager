import { describeInstance } from '../util';
import { Instance } from 'aws-sdk/clients/ec2';
import { Interaction } from 'slash-commands';

export async function serverStatusHandler(_: Interaction): Promise<string> {
  const serverData: Instance = await describeInstance(process.env.GAME_INSTANCE_SERVER_ID);

  return responseFromServerData(serverData);
}

function getStatusEmoji(stateName: string): string {
  switch (stateName) {
    case 'running':
      return ':green_circle:';
    case 'stopping':
    case 'initializing':
      return ':yellow_circle:'
    case 'stopped':
      return ':black_circle:'
    default:
      return ':question:'
  }
}

function responseFromServerData(serverData: Instance): string {
  if (!serverData) {
    return "‼️ Error - Server could not be found"
  }

  const serverStatusMessage = `\n
**Server Status:**
  IP Address: ${serverData.PublicIpAddress}
  Status: ${getStatusEmoji(serverData.State.Name)} ${serverData.State.Name}
  Reason: ${serverData.StateReason && serverData.StateReason.Message}
  Started At: ${serverData.LaunchTime}
  `;

  return serverStatusMessage;
}
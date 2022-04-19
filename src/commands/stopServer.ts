import { stopInstance } from '../util';
import { InstanceStateChange } from 'aws-sdk/clients/ec2';
import { Interaction } from 'slash-commands';

export async function stopServerHandler(_: Interaction): Promise<string> {
  const ec2InstanceId = process.env.GAME_SERVER_INSTANCE_ID;

  const serverData: InstanceStateChange = await stopInstance(ec2InstanceId);

  return buildResponse(serverData);
}

function buildResponse(serverData: InstanceStateChange): string {
  if (!serverData) {
    return ':exclamation: Error - Server was not stopped successfully (please let Damon know so he saves 💰)'
  }

  return 'Server is being stopped. Check back in a bit with `/server status.`';
}
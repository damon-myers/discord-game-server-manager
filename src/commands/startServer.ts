import { startInstance } from '../util';
import { InstanceStateChange } from 'aws-sdk/clients/ec2';
import { Interaction } from 'slash-commands';

export async function startServerHandler(_: Interaction): Promise<string> {
  const ec2InstanceId = process.env.GAME_SERVER_INSTANCE_ID;

  const serverData: InstanceStateChange = await startInstance(ec2InstanceId);

  return buildResponse(serverData);
}

function buildResponse(serverData: InstanceStateChange): string {
  if (!serverData) {
    return "‼️ Error - Server was not started (sowwy uwu)"
  }

  return 'Server is being started. Check back in a bit with `/server status.`';
}
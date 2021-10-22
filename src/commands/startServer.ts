import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { startInstance, getSecretValue } from '../util';
import { InstanceStateChange } from 'aws-sdk/clients/ec2';
import { InteractionResponse, InteractionResponseType } from 'slash-commands';

/**
 * Discord will occasionally ping the API with a request and some signature headers
 * This Lambda responds to those requests appropriately, by verifying the request signature
 */
export async function startServerHandler(_: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const secrets = await getSecretValue('/discord/prod');

  const ec2InstanceId = secrets.gameServerId;

  if (!ec2InstanceId) {
    return {
      statusCode: 500,
      body: 'failed to get server instance id'
    };
  }

  const serverData: InstanceStateChange = await startInstance(ec2InstanceId);

  return buildResponse(serverData);
}

function buildResponse(serverData: InstanceStateChange): APIGatewayProxyResult {
  if (!serverData) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "‼️ Error - Server was not started (sowwy uwu)"
        }
      })
    };
  }

  const serverStatusMessage = 'Server is being started. Check back in a bit with `/server status.`';

  const bodyData: InteractionResponse = {
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: serverStatusMessage
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(bodyData)
  }
}
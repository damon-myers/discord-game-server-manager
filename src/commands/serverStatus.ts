import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { describeInstance, getSecretValue } from '../util';
import { Instance } from 'aws-sdk/clients/ec2';
import { InteractionResponse, InteractionResponseType } from 'slash-commands';

/**
 * Discord will occasionally ping the API with a request and some signature headers
 * This Lambda responds to those requests appropriately, by verifying the request signature
 */
export async function serverStatusHandler(_: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
  const secrets = await getSecretValue('/discord/prod');

  const ec2InstanceId = secrets.gameServerId;

  if (!ec2InstanceId) {
    return {
      statusCode: 500,
      body: 'failed to get server instance id'
    };
  }

  const serverData: Instance = await describeInstance(ec2InstanceId);

  return responseFromServerData(serverData);
}

function responseFromServerData(serverData: Instance): APIGatewayProxyResult {
  if (!serverData) {
    return {
      statusCode: 200,
      body: JSON.stringify({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          content: "‼️ Error - Server could not be found"
        }
      })
    };
  }

  const serverStatusMessage = `

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
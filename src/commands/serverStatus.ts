
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { describeInstance, getSecretValue, wrap } from '../util';
import { Instance } from 'aws-sdk/clients/ec2';
import { InteractionResponse } from 'slash-commands';

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
      body: "Server was not found"
    };
  }

  const serverStatusMessage = `

**Server Status:**
  IP Address: ${serverData.PublicIpAddress}
  Status: ${serverData.State.Name}
  Reason: ${serverData.StateReason}
  Started At: ${serverData.LaunchTime}
  `;

  const bodyData: InteractionResponse = {
    type: 3,
    data: {
      content: serverStatusMessage
    }
  };

  return {
    statusCode: 200,
    body: JSON.stringify(bodyData)
  };
}
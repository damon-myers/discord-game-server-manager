import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { getSecretValue } from "./aws";
import { isValidRequestSignature } from "./discord";

type LambdaImplementation = (event: APIGatewayProxyEvent) => Promise<APIGatewayProxyResult>;

export function wrap(impl: LambdaImplementation): LambdaImplementation {
  return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const secrets = await getSecretValue('/discord/prod');

    if (!isValidRequestSignature(event, secrets.applicationPublicKey)) {
      return {
        statusCode: 401,
        body: 'invalid request signature'
      };
    }

    return impl(event);
  }
}
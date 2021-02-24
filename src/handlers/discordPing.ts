import 'source-map-support/register';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { wrap } from '../util';

/**
 * Discord will occasionally ping the API with a request and some signature headers
 * This Lambda responds to those requests appropriately, by verifying the request signature
 */
export const handler = wrap(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const payload = JSON.parse(event.body);
    if (payload.type == 1) {
      return {
        statusCode: 200,
        body: JSON.stringify({ type: 1 })
      };
    }

    return {
      statusCode: 400,
      body: "bad request"
    };
  }
);
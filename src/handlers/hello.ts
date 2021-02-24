import { APIGatewayProxyResult } from 'aws-lambda';

export const handler = async (): Promise<APIGatewayProxyResult> => {
  console.log(`time to say 'hello'`);
  return { body: JSON.stringify({ message: 'hello' }), statusCode: 200 };
};

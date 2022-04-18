import { Request, Response, NextFunction } from 'express';

export async function validateSignature(req: Request, res: Response, next: NextFunction) {
  // TODO: Rewrite the below algorithm once secrets are not fetched during request handling
  // return async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  //   const secrets = await getSecretValue('/discord/prod');
  //   console.log(`Headers: ${JSON.stringify(event.headers)}`);
  //   if (!isValidRequestSignature(event, secrets.applicationPublicKey)) {
  //     return {
  //statusCode: 401,
  //       body: 'invalid request signature'
  //     };
  //   }
  //   return impl(event);
  // }
}
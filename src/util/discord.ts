import { APIGatewayProxyEvent } from "aws-lambda";
import * as nacl from 'tweetnacl';

export function isValidRequestSignature(request: APIGatewayProxyEvent, appPublicKey: string): boolean {
  const signature = request.headers['X-Signature-Ed25519'];
  const timestamp = request.headers['X-Signature-Timestamp'];
  const body = request.body;

  console.log(`Got:\nsignature:${signature},\ntimestamp: ${timestamp},\nbody: ${body}`)

  return signature && timestamp && nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(appPublicKey, 'hex')
  );
}
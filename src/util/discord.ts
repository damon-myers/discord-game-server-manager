import { APIGatewayProxyEvent } from "aws-lambda";
import * as nacl from 'tweetnacl';
import { getSecretValue } from "./aws";

export interface DiscordSecret {
  applicationPublicKey: string;
  botToken: string;
  gameServerId: string;
}

export async function getDiscordSecret(env: string): Promise<DiscordSecret> {
  if (env === 'dev') {
    return {
      applicationPublicKey: 'MOCK',
      botToken: 'MOCK',
      gameServerId: 'MOCK'
    };
  }

  return getSecretValue(`/discord/${env}`);
}

export function isValidRequestSignature(request: APIGatewayProxyEvent, appPublicKey: string): boolean {
  const signature = request.headers['x-signature-ed25519'];
  const timestamp = request.headers['x-signature-timestamp'];
  const body = request.body;

  console.log(`Got:\nsignature:${signature},\ntimestamp: ${timestamp},\nbody: ${body}`)

  if (!signature || !timestamp) {
    return false;
  }

  let isValid = false;
  try {
    isValid = nacl.sign.detached.verify(
      Buffer.from(timestamp + body),
      Buffer.from(signature, 'hex'),
      Buffer.from(appPublicKey, 'hex')
    );
  } catch (_) {
    return false;
  }

  return isValid;
}
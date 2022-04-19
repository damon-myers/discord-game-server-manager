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
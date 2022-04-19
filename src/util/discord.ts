import axios from "axios";
import { getSecretValue } from "./aws";

export const DISCORD_BASE_URL = "https://discord.com/api/v9"

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

export async function editInteractionResponse(payload: any, newMessage: string): Promise<void> {
  const endpoint = `${DISCORD_BASE_URL}/webhooks/${payload.application_id}/${payload.token}/messages/@original`;

  try {
    const response = await axios.patch(
      endpoint,
      {
        content: newMessage
      }
    );

    console.log(`Updated initial response. Response from Discord: ${JSON.stringify(response.data)}`);
  } catch (err) {
    console.error('[ERROR] Failed to update initial response', {
      endpoint,
      content: newMessage,
    });
    console.error(err);
  }
}
import * as express from 'express';
import { verifyKeyMiddleware } from 'discord-interactions';
import { handleDiscordRequest } from './routes/discordServerCommands'
import { getDiscordSecret } from './util';

// Fetches secrets from SecretsManager and then exposes them as env vars
async function storeSecretsInEnv() {
  const secretEnv = process.env.NODE_ENV == 'production' ? 'prod' : 'dev';

  try {
    const secrets = await getDiscordSecret(secretEnv);

    process.env.DISCORD_APP_PUBLIC_KEY = secrets.applicationPublicKey;
    process.env.DISCORD_BOT_TOKEN = secrets.botToken;
    process.env.GAME_SERVER_INSTANCE_ID = secrets.gameServerId;
  } catch (err) {
    console.error('Failed to retrieve secrets from AWS. Exiting.');
    console.error(err);
    process.exit(1)
  }
}

async function initExpress() {
  const app = express();
  const port = parseInt(process.env.SERVER_PORT);

  app.use(
    verifyKeyMiddleware(process.env.DISCORD_APP_PUBLIC_KEY),
  );

  app.post('/', handleDiscordRequest);

  app.listen(port, () => {
    console.log(`API available on port ${port}`);
  });
}

storeSecretsInEnv()
  .then(initExpress)
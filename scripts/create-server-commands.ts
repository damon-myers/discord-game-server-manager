import { DiscordInteractions, PartialApplicationCommand } from 'slash-commands';

const interaction = new DiscordInteractions({
  applicationId: process.env.DISCORD_APP_ID,
  authToken: process.env.DISCORD_AUTH_TOKEN,
  publicKey: process.env.DISCORD_APP_PUBLIC_KEY,
});

console.log(process.env);

const commandDefinition: PartialApplicationCommand = {
  "name": "server",
  "description": "Start, stop, or check on the server",
  "options": [
    {
      "name": "status",
      "description": "Get information about the server, including its current IP address",
      "default": true,
      "type": 1
    }
  ]
};

interaction
  .createApplicationCommand(commandDefinition)
  .then(console.log)
  .catch(console.error);
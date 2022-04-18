import * as express from 'express';
import { handleDiscordRequest } from './routes/discordServerCommands'
import { validateSignature } from './middleware/';

const app = express()
const port = parseInt(process.env.SERVER_PORT)

app.use(express.json())

// Discord sometimes will hit the API with invalid signatures,
// to confirm we're verifying them correctly
app.use(validateSignature)

app.post('/', handleDiscordRequest);

app.listen(port, () => {
  console.log(`API available on port ${port}`);
});
const dotenv = require('dotenv').config();
import { Intents } from 'discord.js';
import { clientEvents } from './src/events/client';
import { MusicBot } from './src/types/MusicBot';

if (!process.env.DISCORD_TOKEN) throw new Error('Not provided .env variable DISCORD_TOKEN')
if (!process.env.GOOGLE_API_KEY) throw new Error('Not provided .env variable GOOGLE_API_KEY')

const intents = new Intents();
intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_VOICE_STATES
);

export const rootDir = __dirname;
export const client = new MusicBot({intents});
clientEvents(client);

client.login();

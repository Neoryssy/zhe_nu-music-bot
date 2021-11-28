"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.rootDir = void 0;
const dotenv = require('dotenv').config();
const discord_js_1 = require("discord.js");
const client_1 = require("./src/events/client");
const MusicBot_1 = require("./src/types/MusicBot");
if (!process.env.DISCORD_TOKEN)
    throw new Error('Not provided .env variable DISCORD_TOKEN');
if (!process.env.GOOGLE_API_KEY)
    throw new Error('Not provided .env variable GOOGLE_API_KEY');
const intents = new discord_js_1.Intents();
intents.add(discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES, discord_js_1.Intents.FLAGS.GUILD_INVITES, discord_js_1.Intents.FLAGS.GUILD_VOICE_STATES);
exports.rootDir = __dirname;
exports.client = new MusicBot_1.MusicBot({ intents });
(0, client_1.clientEvents)(exports.client);
exports.client.login();

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { prefix } = require('./config.json');
const { Client, Intents } = require('discord.js');
const { events } = require('./events');

const intents = new Intents();
intents.add(Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES);

const client = new Client();
client.commands = new Map();
events(client);

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(colors.cyan.underline('\n\nBot has been successfully started'));
    console.log(colors.cyan.underline(`Invite link: ${await client.generateInvite({ permissions: 8 })}`));
  }
});

client.on('message', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);

  const commandName = args.shift().toLowerCase();

  if (!client.commands.has(commandName)) return;

  const command = client.commands.get(commandName);

  if (command.args && !args.length)
    return message.reply(`${command.argsNotProvidedMsg || 'Не указаны аргументы'}`);

  try {
    command.execute(client, message, args);
  } catch (e) {
    console.log(e);
    message.reply('Something went wrong');
  }
});

client.on('error', (e) => {
  console.log(`Error: ${e}`);
});

client.login();

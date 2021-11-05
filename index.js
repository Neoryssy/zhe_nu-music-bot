const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv').config();
const colors = require('colors');
const { prefix } = require('./config.json');
const { Client, Intents } = require('discord.js');
const { initQueueManager } = require('./modules/queue');
// const { events } = require('./events');

const intents = new Intents();
intents.add(
  Intents.FLAGS.GUILDS,
  Intents.FLAGS.GUILD_MESSAGES,
  Intents.FLAGS.GUILD_INVITES,
  Intents.FLAGS.GUILD_VOICE_STATES
);

const client = new Client({ intents });
client.commands = new Map();
client.queues = initQueueManager();

const commandFiles = fs.readdirSync('./commands').filter((file) => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', async () => {
  if (process.env.NODE_ENV === 'development') {
    console.log(colors.cyan.underline('\n\nBot has been successfully started'));
    console.log(
      colors.cyan.underline(
        `Invite link: ${await client.generateInvite({
          permissions: 'ADMINISTRATOR',
          scopes: ['applications.commands'],
        })}`
      )
    );
  }
});

client.on('messageCreate', async (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();
  const command = client.commands.get(commandName);

  if (!client.commands.has(commandName)) return;

  if (command.args && !args.length)
    return message.reply(`${command.argsNotProvidedMsg || 'Не указаны аргументы'}`);

  const ctx = { args, message };

  try {
    command.execute(ctx);
  } catch (e) {
    console.log(e);
    message.reply('Something went wrong');
  }
});

client.on('error', (e) => {
  console.log(`Error: ${e}`);
});

client.login();

module.exports = { client };

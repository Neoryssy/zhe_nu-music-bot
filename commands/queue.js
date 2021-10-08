const Discord = require('discord.js');
const musicSubscription = require('./modules/subscription');

module.exports = {
  args: false,
  name: 'queue',
  description: 'guild queue',
  execute(client, message, args) {
    const songQueue = musicSubscription.getSongsQueue(message.guild.id);
    const embed = new Discord.MessageEmbed().setColor('BLUE').addFields([{}]);

    message.reply(songQueue.join(' '));
  },
};

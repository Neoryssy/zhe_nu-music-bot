const Discord = require('discord.js');
const musicSubscription = require('./modules/subscription');

module.exports = {
  args: true,
  argsNotProvidedMsg: 'Не указано название трека',
  name: 'play',
  description: 'play music',
  async execute(client, message, args) {
    try {
      const song = await musicSubscription.addSong(message.guild.id, args.join());
      const embed = new Discord.MessageEmbed()
        .setColor('BLUE')
        .setDescription(`Трек добавлен в очередь [${song.title}](${song.url})`);

      await message.channel.send({ embed });

      await musicSubscription.connectToChannel(message.member.voice.channel);
      await musicSubscription.play(message.guild.id);
    } catch (error) {
      const embed = new Discord.MessageEmbed()
        .setColor('RED')
        .setDescription(`Ошибка при воспроизведения`);

      await message.channel.send({ embed });

      console.log(error)
    }
  },
};

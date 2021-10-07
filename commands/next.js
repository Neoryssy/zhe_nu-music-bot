const Discord = require('discord.js')
const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'next',
  description: 'next music',
  execute(client, message, args) {
    musicSubscription.next(message.guild.id, async (song) => {
      embed.setDescription(`Сейчас играет [${song.title}](${song.url})`)
      await message.channel.send({ embed })
    })
  },
}

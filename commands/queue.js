const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'queue',
  description: 'guild queue',
  execute(client, message, args) {
    const songQueue = musicSubscription.getSongsQueue(message.guild.id)

    message.reply(songQueue.join(' '))
  },
}

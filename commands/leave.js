const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'leave',
  description: 'leave voice channel',
  execute(client, message, args) {
    musicSubscription.leave(message.guild.id)
  },
}

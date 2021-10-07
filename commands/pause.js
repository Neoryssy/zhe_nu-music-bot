const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'pause',
  description: 'pause music',
  execute(client, message, args) {
    musicSubscription.pause(message.guild.id)
  },
}

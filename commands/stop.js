const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'stop',
  description: 'stop music',
  execute(client, message, args) {
    musicSubscription.stop(message.guild.id)
  },
}

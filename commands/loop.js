const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'loop',
  description: 'loop queue or track',
  execute(client, message, args) {
    musicSubscription.loop(message.guild.id, args[0])
  },
}

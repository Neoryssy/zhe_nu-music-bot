const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'resume',
  description: 'resume music',
  execute(client, message, args) {
    musicSubscription.resume(message.guild.id)
  },
}

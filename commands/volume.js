const musicSubscription = require('./modules/subscription')

module.exports = {
  args: false,
  name: 'volume',
  description: 'volume',
  execute(client, message, args) {
    musicSubscription.setVoume(message.guild.id, args)
  },
}

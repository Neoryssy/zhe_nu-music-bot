const musicSubscription = require('./commands/modules/subscription');
const { AudioPlayerStatus } = require('@discordjs/voice');

module.exports.clientEvents = (client) => {
  client.on('voiceStateUpdate', (oldState, newState) => {});
};

module.exports.playerEvents = (player) => {
  player.on(AudioPlayerStatus.Idle, () => {});
  player.on('error', (error) => {});
};

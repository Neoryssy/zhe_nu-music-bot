import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  subscription!.player.unpause()
};

module.exports = new GuildCommand({
  aliases: ['unpause'],
  createSubscription: true,
  description: 'Возобновить воспроизведение',
  e,
  name: 'resume',
});


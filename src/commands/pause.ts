import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  subscription!.player.pause();
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Приостановить воспроизведение',
  e,
  name: 'pause',
});

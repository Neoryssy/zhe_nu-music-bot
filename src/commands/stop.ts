import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ subscription }: ExecuteOptions) => {
  subscription!.player.stop();
  subscription!.queue.clear();
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Остановить воспроизведение и очистить очередь',
  e,
  name: 'stop',
});

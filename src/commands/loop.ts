import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ args, subscription }: ExecuteOptions) => {
    subscription!.queue.loop();
};

module.exports = new GuildCommand({
  aliases: [],
  createSubscription: true,
  description: 'Включить повтор композиции',
  e,
  name: 'loop',
});

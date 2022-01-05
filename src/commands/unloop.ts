import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ args, subscription }: ExecuteOptions) => {
  subscription!.queue.unloop()
};

module.exports = new GuildCommand({
  aliases: [],
  createSubscription: true,
  description: 'Выключить повтор композиции',
  e,
  name: 'unloop',
});

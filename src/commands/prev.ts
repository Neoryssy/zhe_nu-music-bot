import { ExecuteOptions, GuildCommand } from '../types/Command/Command';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  subscription!.playPrevious();
};

module.exports = new GuildCommand({
  aliases: ['prev'],
  createSubscription: true,
  description: 'Начать проигрывать предыдущую композицию',
  e,
  name: 'previous',
});

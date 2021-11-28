import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ subscription }: ExecuteOptions) => {
  if (!subscription!.connection) return;
  subscription!.connection.disconnect();
};

module.exports = new GuildCommand({
  aliases: ['exit'],
  createSubscription: true,
  description: 'Покинуть голосовой канал',
  e,
  name: 'leave',
});

import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  subscription!.queue.remove(+args![0]);
};

module.exports = new GuildCommand({
  argsRequired: 'required',
  args: ['Номер'],
  createSubscription: true,
  description: 'Удалить композицию с указанным `номером` из очереди',
  e,
  name: 'remove',
});

import { ExecuteOptions, GuildCommand } from '../types/Command/Command';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  subscription!.playNext(+args![0]);
};

module.exports = new GuildCommand({
  aliases: ['skip'],
  argsRequired: 'optional',
  args: ['?Номер'],
  createSubscription: true,
  description:
    'Начать проигрывать следующую в очереди композицию, если указан `номер` пропустить все композиции до указанного номера',
  e,
  name: 'next',
});

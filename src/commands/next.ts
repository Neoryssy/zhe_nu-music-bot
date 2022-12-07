import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  //subscription!.playNext(+args![0]);

  message.reply('Команда временно отключена из-за неправильной работы');
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

import { ExecuteOptions, GuildCommand } from '../types/Command';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  //subscription!.playPrevious();

  message.reply('Команда временно отключена из-за неправильной работы');
};

module.exports = new GuildCommand({
  aliases: ['prev'],
  createSubscription: true,
  description: 'Начать проигрывать предыдущую композицию',
  e,
  name: 'previous',
});

import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { MessageSender } from '../types/MessageSender/MessageSender';

const e = async ({ subscription }: ExecuteOptions) => {
  subscription?.stop();

  const embed = new MessageEmbed()
    .setColor('BLUE')
    .setDescription('Воспроизведение остановлено, очередь и история очищена');
  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Остановить воспроизведение и очистить очередь',
  e,
  name: 'stop',
});

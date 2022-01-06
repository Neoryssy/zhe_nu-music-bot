import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command';
import { MessageSender } from '../utils/MessageSender';

const e = async ({ subscription }: ExecuteOptions) => {
  subscription!.player.stop();
  subscription!.queue.clear();

  const embed = new MessageEmbed().setColor('BLUE').setDescription('Воспроизведение остановлено, очередь очищена');
  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Остановить воспроизведение и очистить очередь',
  e,
  name: 'stop',
});

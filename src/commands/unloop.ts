import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command';
import { MessageSender } from '../utils/MessageSender';

const e = async ({ args, subscription }: ExecuteOptions) => {
  subscription!.queue.unloop();

  const embed = new MessageEmbed().setColor('BLUE').setDescription('Повтор трека выключен');
  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  aliases: [],
  createSubscription: true,
  description: 'Выключить повтор композиции',
  e,
  name: 'unloop',
});

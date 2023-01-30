import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { MessageSender } from '../types/MessageSender/MessageSender';

const e = async ({ subscription }: ExecuteOptions) => {
  subscription?.shuffle();

  const embed = new MessageEmbed()
    .setColor('BLUE')
    .setDescription('Треки в очереди перемешаны');
  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Перемешать треки в очереди',
  e,
  name: 'shuffle',
});

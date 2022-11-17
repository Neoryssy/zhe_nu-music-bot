import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command';
import { MessageSender } from '../utils/MessageSender';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  const current = subscription!.queue.current!;
  const embed = new MessageEmbed().setColor('BLUE');

  if (!current) embed.setDescription('Нет активного трека');
  else {
    subscription!.player.unpause();
    embed
      .addField('Воспроизведение продолжено', `[${current!.title}](${current!.link})`)
      .setThumbnail(current.thumbnail.url);
  }

  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  aliases: ['unpause'],
  createSubscription: true,
  description: 'Возобновить воспроизведение',
  e,
  name: 'resume',
});

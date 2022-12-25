import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { MessageSender } from '../types/MessageSender/MessageSender';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  const current = subscription!.queue.current!;
  const embed = new MessageEmbed().setColor('BLUE');

  if (!current) embed.setDescription('Нет активного трека');
  else {
    subscription!.player.pause();
    embed
      .addField('Трек поставлен на паузу', `[${current!.title}](${current!.link})`)
      .setThumbnail(current.thumbnail.url);
  }

  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Приостановить воспроизведение',
  e,
  name: 'pause',
});

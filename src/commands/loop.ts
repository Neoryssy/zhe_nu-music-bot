import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { MessageSender } from '../types/MessageSender/MessageSender';

const e = async ({ args, subscription }: ExecuteOptions) => {
  const embed = new MessageEmbed().setColor('BLUE');
  const current = subscription!.queue.current;

  if (!current) embed.setDescription('Нет активного трека');
  else {
    subscription!.queue.loop();
    embed
      .addField('Повтор трека включен', `[${current!.title}](${current!.link})`)
      .setThumbnail(current.thumbnail.url);
  }

  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  aliases: [],
  createSubscription: true,
  description: 'Включить повтор композиции',
  e,
  name: 'loop',
});

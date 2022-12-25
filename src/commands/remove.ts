import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { MessageSender } from '../types/MessageSender/MessageSender';

const e = async ({ args, subscription, message }: ExecuteOptions) => {
  const start = Number(args![0]);
  const count = Number(args![1]);
  const embed = new MessageEmbed().setColor('BLUE');
  const descriptionElements: string[] = [];

  if (isNaN(start)) embed.setDescription('Позиция для удаления указана неверно');
  else {
    const tracks = subscription!.queue.remove(+args![0], Number.isNaN(count) ? 1 : count);

    if (tracks.length === 0) embed.setDescription('Нет треков для удаления');
    else {
      embed.setTitle(`Треков удалено (${tracks.length})`);
      tracks.forEach((t, i) => {
        if (i >= 10) return;

        descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link})`);
      });
      embed.setDescription(descriptionElements.join('\n'));
    }
  }

  new MessageSender({ channel: subscription!.channel, message: { embeds: [embed] } }).send();
};

module.exports = new GuildCommand({
  argsRequired: 'required',
  args: ['Номер'],
  createSubscription: true,
  description: 'Удалить композицию с указанным `номером` из очереди',
  e,
  name: 'remove',
});

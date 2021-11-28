import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command';
import { prefix } from '../../config.json';

const e = async ({ subscription, message }: ExecuteOptions) => {
  const queue = [...subscription!.queue.queue];
  const embed = new MessageEmbed().setColor('BLUE');
  const descriptionElements: string[] = [];

  embed.setTitle(`Треков в очереди (${queue.length})`);
  if (subscription!.queue.current) {
    let format: string;

    if (subscription!.queue.current.lengthSeconds === 0) format = 'Live';
    else if (subscription!.queue.current.lengthSeconds >= 3600)
      format = new Date(subscription!.queue.current.lengthSeconds * 1000).toISOString().substr(11, 8);
    else format = new Date(subscription!.queue.current.lengthSeconds * 1000).toISOString().substr(14, 5);

    descriptionElements.push('**Сейчас играет**');
    descriptionElements.push(
      `[${subscription!.queue.current.title}](${subscription!.queue.current.link})  \`${format}\``
    );
  }

  if (queue.length === 0) {
    descriptionElements.push('`Нет треков в очереди`');
    descriptionElements.push('');
    descriptionElements.push(
      `Чтобы добавить треки в очередь, воспользуйтесь командой \`${prefix}play<композиция>\``
    );
  } else {
    descriptionElements.push('');
    descriptionElements.push('**Треки в очереди**');

    queue.forEach((t, i) => {
      if (i >= 10) return;

      let format: string;

      if (t.lengthSeconds === 0) format = 'Live';
      else if (t.lengthSeconds >= 3600) format = new Date(t.lengthSeconds * 1000).toISOString().substr(11, 8);
      else format = new Date(t.lengthSeconds * 1000).toISOString().substr(14, 5);

      descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link}) \`${format}\``);
    });
  }

  embed.setDescription(descriptionElements.join('\n'));
  message.channel.send({ embeds: [embed] });
};

module.exports = new GuildCommand({
  aliases: ['q'],
  createSubscription: true,
  description: 'Показать очередь композиций',
  e,
  name: 'queue',
});

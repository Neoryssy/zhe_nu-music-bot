import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { prefix } from '../../config.json';
import moment from 'moment';

const e = async ({ subscription, message }: ExecuteOptions) => {
  const queue = [...subscription!.queue.queue];
  const embed = new MessageEmbed().setColor('BLUE');
  const descriptionElements: string[] = [];

  embed.setTitle(`Треков в очереди (${queue.length})`);
  if (subscription!.queue.current) {
    const lengthSeconds = subscription!.queue.current.lengthSeconds;
    const duration = lengthSeconds === 0 ? 'Live' : moment.unix(lengthSeconds).utc().format('HH:mm:ss');

    descriptionElements.push('**Сейчас играет**');
    descriptionElements.push(
      `[${subscription!.queue.current.title}](${subscription!.queue.current.link})  \`${duration}\``
    );
  }

  if (queue.length === 0) {
    descriptionElements.push('');
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

      const lengthSeconds = t.lengthSeconds;
      const duration = lengthSeconds === 0 ? 'Live' : moment.unix(lengthSeconds).utc().format('HH:mm:ss');

      descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link}) \`${duration}\``);
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

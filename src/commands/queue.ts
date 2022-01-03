import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command';
import { prefix } from '../../config.json';

const msToISO = (t: number) => {
  let iso: string;
  const hour = 3600_000;

  if (t < 0) iso = '0:00';
  else if (t < hour) iso = new Date(t).toISOString().substr(14, 5);
  else if (t >= hour) iso = new Date(t).toISOString().substr(11, 8);

  return iso!;
};

const e = async ({ subscription, message }: ExecuteOptions) => {
  const queue = [...subscription!.queue.queue];
  const embed = new MessageEmbed().setColor('BLUE');
  const descriptionElements: string[] = [];

  embed.setTitle(`Треков в очереди (${queue.length})`);
  if (subscription!.queue.current) {
    let leftDuration: string;

    if (subscription!.queue.current.lengthSeconds === 0) leftDuration = 'Live';
    else
      leftDuration = msToISO(
        subscription!.queue.current.lengthSeconds * 1000 - subscription!.resource.playbackDuration
      );

    descriptionElements.push('**Сейчас играет**');
    descriptionElements.push(
      `[${subscription!.queue.current.title}](${subscription!.queue.current.link})  \`${leftDuration}\``
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

      let leftDuration: string;

      if (t.lengthSeconds === 0) leftDuration = 'Live';
      else leftDuration = msToISO(t.lengthSeconds * 1000);

      descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link}) \`${leftDuration}\``);
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

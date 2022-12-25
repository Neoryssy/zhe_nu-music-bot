import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';

const e = async ({ subscription, message }: ExecuteOptions) => {
  const history = [...subscription!.queue.history];
  const embed = new MessageEmbed().setColor('BLUE');
  const descriptionElements: string[] = [];

  if (history.length === 0) embed.setTitle(`История пуста`);
  else embed.setTitle(`История`);

  history.forEach((t, i) => {
    if (i >= 10) return;
    descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link})`);
  });

  embed.setDescription(descriptionElements.join('\n'));
  message.channel.send({ embeds: [embed] });
};

module.exports = new GuildCommand({
  createSubscription: true,
  description: 'Показать историю прослушивания',
  e,
  name: 'history',
});

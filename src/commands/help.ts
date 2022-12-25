import { MessageEmbed } from 'discord.js';
import { client } from '../../index';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { prefix } from '../../config.json';

const e = ({ message }: ExecuteOptions) => {
  const embed = new MessageEmbed().setTitle('Доступные команды').setColor('BLUE');

  for (let [key, value] of client.commands) {
    embed.addField(
      `\`${prefix}${value.name} <${value.args.length ? value.args.join(' ') : ''}>\``,
      value.description,
      false
    );
  }

  message.channel.send({ embeds: [embed] });
};

module.exports = new GuildCommand({
  description: 'Помощь по доступным командам',
  e,
  name: 'help',
});

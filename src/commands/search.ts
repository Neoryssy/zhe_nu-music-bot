import { MessageActionRow, MessageSelectMenu } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command';
import { MessageSender } from '../utils/MessageSender';
import { Search } from '../utils/Search';
import { Track } from '../types/TrackQueue';

const e = async ({ args, message }: ExecuteOptions) => {
  const searchResult = await Search.search(args!.join(' '));
  const row = new MessageActionRow();
  const selectMenu = new MessageSelectMenu()
    .setCustomId('search-select')
    .setPlaceholder('Выберите композицию')
    .setMaxValues(1)
    .addOptions([
      ...searchResult.map((e) => {
        return {
          description: e instanceof Track ? 'Видео' : 'Плейлист',
          label: e.title,
          value: e.link,
        };
      }),
    ]);

  row.addComponents(selectMenu);

  await new MessageSender({
    channel: message.channel,
    deletable: true,
    message: { content: 'Выбор композиции', components: [row] },
  }).send();
};

module.exports = new GuildCommand({
  argsRequired: 'required',
  args: ['Название'],
  createSubscription: true,
  description: 'Поиск композиции по `названию`',
  e,
  name: 'search',
});

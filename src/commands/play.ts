import { MessageEmbed } from 'discord.js';
import { ExecuteOptions, GuildCommand } from '../types/Command/Command';
import { Search } from '../utils/Search';
import { Playlist, Track } from '../types/TrackQueue/TrackQueue';
import { MessageSender } from '../types/MessageSender/MessageSender';

const e = async ({ args, subscription, message, member }: ExecuteOptions) => {
  try {
    const channelId = member?.voice.channelId || message.member?.voice.channelId;
    const embed = new MessageEmbed().setColor('BLUE');
    const searchResult = await Search.search(args!.join(' '));
    const item = searchResult[0];

    if (!channelId) {
      console.log('Voice channel id not provided');
      return;
    }

    subscription!.joinChannel(channelId);

    if (item instanceof Track) {
      await subscription!.addAndPlayTrack(item);
      embed.addField('Трек добавлен в очередь', `[${item!.title}](${item!.link})`);
    }
    if (item instanceof Playlist) {
      await subscription!.addAndPlayTrack(item.items);
      embed.addField('Плейлист добавлен в очередь', `[${item!.title}](${item!.link})`);
    }

    embed.setThumbnail(item.thumbnail.url);

    new MessageSender({
      channel: subscription!.channel,
      deletable: true,
      message: { embeds: [embed] },
    }).send();
  } catch (e) {
    console.log(e);
  }
};

module.exports = new GuildCommand({
  argsRequired: 'required',
  args: ['Название'],
  createSubscription: true,
  description: 'Добавляет в очередь новую композицию',
  e,
  memberRequired: true,
  name: 'play',
});

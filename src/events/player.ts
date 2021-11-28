import { AudioPlayerStatus } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import { MessageSender } from '../utils/MessageSender';
import { Subscription } from '../types/Subscription';
import { messageDeleteTimeout } from '../../config.json';

export const subscriptionPlayerListener = (s: Subscription) => {
  let timeout: NodeJS.Timeout;

  s.player.on('stateChange', async (oldState, newState) => {
    if (oldState.status === AudioPlayerStatus.Idle && newState.status === AudioPlayerStatus.Buffering) {
      if (timeout) clearTimeout(timeout);
    }
    if (oldState.status === AudioPlayerStatus.AutoPaused && newState.status === AudioPlayerStatus.Playing) {
      if (timeout) clearTimeout(timeout);
    }

    if (oldState.status === AudioPlayerStatus.Buffering && newState.status === AudioPlayerStatus.Playing) {
      if (!s.queue.current) return;

      const embed = new MessageEmbed()
        .setColor('BLUE')
        .setThumbnail(s.queue.current!.thumbnail.url)
        .addField('Сейчас играет', `[${s.queue.current!.title}](${s.queue.current!.link})`);

      await new MessageSender({ channel: s.channel, deletable: true, message: { embeds: [embed] } }).send();
    }

    if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
      s.playNext();
      if (!s.queue.current) {
        timeout = setTimeout(() => {
          s.destroy();
        }, messageDeleteTimeout);
      }
    }
    if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.AutoPaused) {
      if (!s.queue.current) {
        timeout = setTimeout(() => {
          s.destroy();
        }, messageDeleteTimeout);
      }
    }
  });
};

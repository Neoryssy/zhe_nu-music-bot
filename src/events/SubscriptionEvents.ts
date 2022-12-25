import { AudioPlayerStatus } from '@discordjs/voice';
import { MessageEmbed } from 'discord.js';
import { MessageSender } from '../types/MessageSender/MessageSender';
import { Subscription } from '../types/Subscription/Subscription';
import { channelLeaveTimeout } from '../../config.json';

export const subscriptionEvents = (sub: Subscription) => {
  let timeout: NodeJS.Timeout;

  sub.player.on(AudioPlayerStatus.AutoPaused, (oldState, newState) => {
    console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);

    timeout = setTimeout(() => {
      sub.destroy();
    }, channelLeaveTimeout);
  });

  sub.player.on(AudioPlayerStatus.Buffering, (oldState, newState) => {
    console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
  });

  sub.player.on(AudioPlayerStatus.Idle, (oldState, newState) => {
    console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
    sub.playNext();

    timeout = setTimeout(() => {
      sub.destroy();
    }, channelLeaveTimeout);
  });

  sub.player.on(AudioPlayerStatus.Paused, (oldState, newState) => {
    console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
  });

  sub.player.on(AudioPlayerStatus.Playing, (oldState, newState) => {
    console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);

    clearTimeout(timeout);
    if (oldState.status === AudioPlayerStatus.Buffering) {
      // TODO:
      const embed = new MessageEmbed()
        .setColor('BLUE')
        .setThumbnail(sub.queue.current!.thumbnail.url)
        .addField('Сейчас играет', `[${sub.queue.current!.title}](${sub.queue.current!.link})`);
      new MessageSender({ channel: sub.channel, deletable: true, message: { embeds: [embed] } }).send();
    }
  });
};

import {
  AudioPlayer,
  AudioPlayerStatus,
  AudioResource,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Guild, MessageEmbed, Snowflake, TextBasedChannels } from 'discord.js';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream';
import ytdl from 'ytdl-core';
import { client } from '../../index';
import { MessageSender } from '../utils/MessageSender';
import { Track, TrackQueue } from './TrackQueue';

interface SubscriptionListeners {
  connectionListener?: Function | null;
  playerListener?: Function | null;
}

interface SubscriptionOptions {
  guild: Guild;
  playerOptions?: {};
  listeners?: SubscriptionListeners;
  textChannel: TextBasedChannels;
}

export class Subscription {
  private _channel: TextBasedChannels;
  private _connection: VoiceConnection | undefined;
  private _guild: Guild;
  private _listeners: SubscriptionListeners;
  private _player: AudioPlayer;
  private _queue: TrackQueue;

  constructor(options: SubscriptionOptions) {
    this._channel = options.textChannel;
    this._guild = options.guild;
    this._listeners = options.listeners || { connectionListener: null, playerListener: null };

    this._player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Pause } });
    this._player.on(AudioPlayerStatus.Idle, () => {
      this.playNext();
    });
    this._player.on(AudioPlayerStatus.Playing, (oldState) => {
      if (oldState.status === AudioPlayerStatus.Buffering) {
        const embed = new MessageEmbed()
          .setColor('BLUE')
          .setThumbnail(this._queue.current!.thumbnail.url)
          .addField('Сейчас играет', `[${this._queue.current!.title}](${this._queue.current!.link})`);

        new MessageSender({ channel: this._channel, deletable: true, message: { embeds: [embed] } }).send();
      }
    });

    this._queue = new TrackQueue();
  }

  get channel() {
    return this._channel;
  }
  set channel(c: TextBasedChannels) {
    this._channel = c;
  }
  get connection() {
    return this._connection;
  }
  get listeners() {
    return this._listeners;
  }
  get player() {
    return this._player;
  }
  get queue() {
    return this._queue;
  }

  addTrack(t: Track | Track[]) {
    this._queue.add(t);
  }

  async addAndPlayTrack(track: Track | Track[]) {
    try {
      this.addTrack(track);

      if (this._player.state.status === AudioPlayerStatus.Idle) this.playNext();
    } catch (e) {
      console.log(e);
    }
  }

  destroy() {
    this._player.stop();

    if (this._connection) this._connection.destroy();

    client.subscriptions.delete(this._guild.id);
  }

  async joinChannel(channelId: Snowflake) {
    try {
      if (this._connection && this._connection.state.status !== VoiceConnectionStatus.Destroyed) {
        if (
          this._connection.state.status === VoiceConnectionStatus.Ready &&
          this._connection?.joinConfig?.channelId === channelId
        )
          return;

        if (this._connection.state.status === VoiceConnectionStatus.Disconnected) {
          this._connection.rejoin({ channelId, selfDeaf: true, selfMute: false });
          this._connection.subscribe(this._player);
          return;
        }
      }

      this._connection = joinVoiceChannel({
        //@ts-ignore
        adapterCreator: this._guild.voiceAdapterCreator,
        channelId,
        guildId: this._guild.id,
      });
      this._connection.subscribe(this._player);

      await entersState(this._connection, VoiceConnectionStatus.Ready, 5_000);
    } catch (e) {
      console.log(e);
    }
  }

  private async play(track: Track) {
    try {
      const info = await ytdl.getInfo(track.link);
      const format = ytdl.chooseFormat(info.formats, {
        quality: [91, 92, 93, 140],
        filter: (f) => f.container === 'mp4' || f.container === 'ts',
      });
      const stream = ytdl(track.link, { format });
      const writeStream = createWriteStream('audio.mp4');

      writeStream.on('ready', () => {
        console.log('ready');
        const resource = createAudioResource('audio.mp4');
        this._player.play(resource);
      });

      stream.pipe(writeStream);
    } catch (e) {
      console.log(e);
    }
  }

  async playNext(position?: number) {
    try {
      let track: Track | null;

      if (position) track = this._queue.jump(position);
      else track = this._queue.next();

      if (!track) {
        this._player.stop();
        return;
      }

      this.play(track);
    } catch (e) {
      console.log(e);
    }
  }

  async playPrevious() {
    try {
      const track = this._queue.previous();

      if (!track) return;

      this.play(track);
    } catch (e) {
      console.log(e);
    }
  }
}

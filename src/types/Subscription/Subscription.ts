import {
  AudioPlayer,
  AudioPlayerStatus,
  createAudioPlayer,
  createAudioResource,
  entersState,
  joinVoiceChannel,
  NoSubscriberBehavior,
  StreamType,
  VoiceConnection,
  VoiceConnectionStatus,
} from '@discordjs/voice';
import { Guild, Snowflake, TextBasedChannels } from 'discord.js';
import { client } from '../../../index';
import { Log } from '../../utils/Log';
import { AudioTransformer } from '../AudioTransformer/AudioTransformer';
import { Track, TrackQueue } from '../TrackQueue/TrackQueue';

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
      const stream = new AudioTransformer().getOpusStream(track.link);
      const resource = createAudioResource(stream, { inputType: StreamType.OggOpus });

      Log.write(`Playing ${track.link}`);

      this._player.play(resource);
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

  shuffle() {
    this._queue.shuffle()
  }

  stop() {
    try {
      this._player.stop();
      this._queue.clear();
    } catch (e) {
      console.log(`Stop error: ${e}`);
    }
  }
}

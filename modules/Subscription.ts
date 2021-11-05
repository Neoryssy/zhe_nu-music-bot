import { AudioPlayer, AudioResource, VoiceConnection } from '@discordjs/voice';
import { Queue } from './Queue';

/**
 * The options that can be given for create subscription.
 */
interface SubscriptionOptions {
  /**
   * The ID of the Discord voice channel to join
   */
  connection: VoiceConnection;
  /**
   * The ID of the guild that the voice channel belongs to
   */
  player: AudioPlayer;
  /**
   * Whether to join the channel deafened (defaults to true)
   */
  resource?: AudioResource;
  /**
   * Whether to join the channel muted (defaults to true)
   */
  queue?: Queue;
}

export class Subscription {
  private _connection: VoiceConnection;
  private _player: AudioPlayer;
  private _resource: AudioResource;
  private _queue: Queue;

  constructor(options?: SubscriptionOptions) {
    this._connection = options?.connection || null;
    this._player = options?.player || null;
    this._resource = options?.resource || null;
    this._queue = options?.queue || null;
  }

  get connection() {
    return this._connection;
  }

  set connection(c: VoiceConnection) {
    this._connection = c;
  }

  get player() {
    return this._player;
  }

  public set player(p : AudioPlayer) {
    this._player = p;
  }

  get resource() {
    return this._resource;
  }

  public set resource(r : AudioResource) {
    this._resource = r;
  }

  get queue() {
    return this._queue;
  }

  public set queue(q : Queue) {
    this._queue = q;
  }
}

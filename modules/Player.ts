import { createAudioPlayer, createAudioResource, joinVoiceChannel, NoSubscriberBehavior } from '@discordjs/voice';
import ytdl from 'ytdl-core';

class Player {
  constructor() {}

  private _connection;
  private _player = createAudioPlayer();
  private _stream = null;
  private _resource = null;

  pause = () => {
    this._player.pause();
  };

  play = (resource) => {
    this._stream = ytdl(resource.URL, { filter: 'audioonly' });
    this._resource = createAudioResource(this._stream);
    this._player.play(this._resource);
    this._connection.subscribe(this._player);
  };

  stop = () => {
    this._player.stop();
  };

  unpause = () => {
    this._player.unpause();
  };
}

import {
  joinVoiceChannel,
  VoiceConnection,
  JoinVoiceChannelOptions,
  CreateVoiceConnectionOptions,
} from '@discordjs/voice';

class Connection {
  private _connection: VoiceConnection;

  constructor({ channelId, guildId, adapterCreator }) {
    this._connection = joinVoiceChannel({
      channelId,
      guildId,
      adapterCreator,
    });
  }

  destroy = () => {
    this._connection.destroy();
  };
  disconnect = () => {
    return this._connection.disconnect();
  };
  subscribe = (player) => {
    this._connection.subscribe(player);
  };
}

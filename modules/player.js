const {
  joinVoiceChannel,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  entersState,
  StreamType,
} = require('@discordjs/voice');
const ytdl = require('ytdl-core');

module.exports.initConnection = (opt) => {
  const _connection = joinVoiceChannel({
    channelId: opt.voice.channelId,
    guildId: opt.guild.id,
    adapterCreator: opt.guild.voiceAdapterCreator,
  });

  const destroy = () => {
    _connection.destroy();
  };
  const disconnect = () => {
    return _connection.disconnect();
  };
  const subscribe = (player) => {
    _connection.subscribe(player);
  };

  return { _state: { _connection }, destroy, disconnect, subscribe };
};

module.exports.initPlayer = (opt) => {
  const _connection = joinVoiceChannel({
    channelId: opt.voice.channelId,
    guildId: opt.guild.id,
    adapterCreator: opt.guild.voiceAdapterCreator,
  });
  const _player = createAudioPlayer({ behaviors: NoSubscriberBehavior.Pause });
  let _stream = null;
  let _resource = null;

  const pause = () => {
    _player.pause();
  };

  const play = (resource) => {
    _stream = ytdl(resource.URL, { filter: 'audioonly' });
    _resource = createAudioResource(_stream);
    _player.play(_resource);
    _connection.subscribe(_player);
  };

  const stop = () => {
    _player.stop();
  };

  const unpause = () => {
    _player.unpause();
  };

  return { _state: { _player }, pause, play, stop, unpause };
};

module.exports.initResource = (opt) => {
  if (!opt?.resourceURL) throw new Error('Resource link not specified');

  const _stream = ytdl(opt.resourceURL, { filter: 'audioonly' });
  const _resource = createAudioResource(_stream);

  const getResource = () => {
    return _resource;
  };

  return { _state: { _stream, _resource }, getResource };
};

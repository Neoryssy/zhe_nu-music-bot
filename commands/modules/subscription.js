const ytdl = require('ytdl-core');
const {
  createAudioPlayer,
  createAudioResource,
  entersState,
  VoiceConnectionStatus,
  joinVoiceChannel,
  AudioPlayerStatus,
} = require('@discordjs/voice');
const createDiscordJSAdapter = require('./adapter');
const googleAPI = require('../../modules/googleAPI.module');

class MusicSubscription {
  constructor() {
    this.queue = new Map();
  }

  async addSong(guildId, songQuery) {
    try {
      this.createServerQueue(guildId);

      const serverQueue = this.queue.get(guildId);
      const songData = await googleAPI.yotubeDataAPI({
        query: songQuery,
        youtubeAPIKey: 'AIzaSyD6pSgAqJIxDZAAVoAPcMLv3O9sUqA9Kj4', // TODO:
      });

      const songInfo = await ytdl.getInfo(songData.items[0].id.videoId);

      const song = {
        title: songInfo.videoDetails.title,
        url: songInfo.videoDetails.video_url,
      };

      serverQueue.songs.push(song);

      return song;
    } catch (error) {
      throw new Error(error);
    }
  }

  async connectToChannel(channel) {
    return this.createConnection(channel);
  }

  createConnection(channel) {
    const serverQueue = this.queue.get(channel.guild.id);
    let connection = serverQueue?.connection;

    if (!serverQueue) return;
    if (connection && connection?.state?.status !== VoiceConnectionStatus.Destroyed) {
      return;
    }

    connection = joinVoiceChannel({
      channelId: channel.id,
      guildId: channel.guild.id,
      selfDeaf: true,
      selfMute: false,
      adapterCreator: createDiscordJSAdapter(channel),
    });

    serverQueue.connection = connection;

    return connection;
  }

  createPlayer(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (!serverQueue) return;
    if (serverQueue?.player) return;

    const player = createAudioPlayer();
    player.onStateChange = player.on('stateChange', (oldState, newState) => {
      if (newState.status === AudioPlayerStatus.Idle && oldState.status !== AudioPlayerStatus.Idle) {
        this.play(guildId);
      }
    });

    serverQueue.player = player;
    serverQueue.volume = 1;
  }

  createServerQueue(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (serverQueue) return;

    const queueContract = {
      songs: [],
      volume: 5,
    };

    this.queue.set(guildId, queueContract);
  }

  getSongsQueue(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (!serverQueue) return;

    return serverQueue.songs;
  }

  leave(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (!serverQueue?.connection) return;

    this.stop(guildId);

    serverQueue.connection.destroy();
  }

  loop(guildId, type) {
    const serverQueue = this.queue.get(guildId);

    if (type[0] === 'q') {
      serverQueue.loopQueue = serverQueue.songs;
    } else if (type[0] === 't') {
    }
  }

  next(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (!serverQueue) return;
    if (!serverQueue?.player) return;
    if (!serverQueue.songs.length) this.stop();

    serverQueue.player.stop();
    this.play(guildId);
  }

  pause(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (!serverQueue) return;
    if (!serverQueue?.player) return;

    serverQueue.player.pause();
  }

  async play(guildId) {
    const serverQueue = this.queue.get(guildId);
    let song;

    if (serverQueue?.player?.state.status === AudioPlayerStatus.Playing) return;
    if (serverQueue?.player?.state.status === AudioPlayerStatus.Paused) return this.resume(guildId);

    if (serverQueue?.loopQueue?.length) {
      song = serverQueue.loopQueue.shift();
      serverQueue.loopQueue.push(song);
    } else {
      song = serverQueue.songs.shift();
    }

    if (!song) return;

    const stream = ytdl(song.url, { filter: 'audioonly' });

    const resource = createAudioResource(stream, { inlineVolume: true });
    resource.volume.setVolume(serverQueue.volume);

    serverQueue.resource = resource;

    this.createPlayer(guildId);

    serverQueue.connection.subscribe(serverQueue.player);

    serverQueue.player.play(serverQueue.resource);
  }

  resume(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (!serverQueue) return;
    if (!serverQueue?.player) return;

    serverQueue.player.unpause();
  }

  setVoume(guildId, volume) {
    const serverQueue = this.queue.get(guildId);

    serverQueue.volume = volume;
    serverQueue.resource.volume.setVolume(volume);
  }

  stop(guildId) {
    const serverQueue = this.queue.get(guildId);

    if (!serverQueue) return;
    if (!serverQueue?.player) return;

    serverQueue.songs = [];
    serverQueue.player.stop();
  }
}

module.exports = new MusicSubscription();

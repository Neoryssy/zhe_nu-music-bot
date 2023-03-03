"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Subscription = void 0;
const voice_1 = require("@discordjs/voice");
const index_1 = require("../../../index");
const Log_1 = require("../../utils/Log");
const AudioTransformer_1 = require("../AudioTransformer/AudioTransformer");
const TrackQueue_1 = require("../TrackQueue/TrackQueue");
class Subscription {
    constructor(options) {
        this._channel = options.textChannel;
        this._guild = options.guild;
        this._listeners = options.listeners || { connectionListener: null, playerListener: null };
        this._player = (0, voice_1.createAudioPlayer)({ behaviors: { noSubscriber: voice_1.NoSubscriberBehavior.Pause } });
        this._queue = new TrackQueue_1.TrackQueue();
    }
    get channel() {
        return this._channel;
    }
    set channel(c) {
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
    addTrack(t) {
        this._queue.add(t);
    }
    async addAndPlayTrack(track) {
        try {
            this.addTrack(track);
            if (this._player.state.status === voice_1.AudioPlayerStatus.Idle)
                this.playNext();
        }
        catch (e) {
            console.log(e);
        }
    }
    destroy() {
        this._player.stop();
        if (this._connection)
            this._connection.destroy();
        index_1.client.subscriptions.delete(this._guild.id);
    }
    async joinChannel(channelId) {
        try {
            if (this._connection && this._connection.state.status !== voice_1.VoiceConnectionStatus.Destroyed) {
                if (this._connection.state.status === voice_1.VoiceConnectionStatus.Ready &&
                    this._connection?.joinConfig?.channelId === channelId)
                    return;
                if (this._connection.state.status === voice_1.VoiceConnectionStatus.Disconnected) {
                    this._connection.rejoin({ channelId, selfDeaf: true, selfMute: false });
                    this._connection.subscribe(this._player);
                    return;
                }
            }
            this._connection = (0, voice_1.joinVoiceChannel)({
                adapterCreator: this._guild.voiceAdapterCreator,
                channelId,
                guildId: this._guild.id,
            });
            this._connection.subscribe(this._player);
            this._connection.on('stateChange', (oldState, newState) => {
                const oldNetworking = Reflect.get(oldState, 'networking');
                const newNetworking = Reflect.get(newState, 'networking');
                const networkStateChangeHandler = (oldNetworkState, newNetworkState) => {
                    const newUdp = Reflect.get(newNetworkState, 'udp');
                    clearInterval(newUdp?.keepAliveInterval);
                };
                oldNetworking?.off('stateChange', networkStateChangeHandler);
                newNetworking?.on('stateChange', networkStateChangeHandler);
            });
            await (0, voice_1.entersState)(this._connection, voice_1.VoiceConnectionStatus.Ready, 5000);
        }
        catch (e) {
            console.log(e);
        }
    }
    async play(track) {
        try {
            const stream = new AudioTransformer_1.AudioTransformer().getOpusStream(track.link);
            const resource = (0, voice_1.createAudioResource)(stream, { inputType: voice_1.StreamType.OggOpus });
            Log_1.Log.write(`Playing ${track.link}`);
            this._player.play(resource);
        }
        catch (e) {
            console.log(e);
        }
    }
    async playNext(position) {
        try {
            let track;
            if (position)
                track = this._queue.jump(position);
            else
                track = this._queue.next();
            if (!track) {
                this._player.stop();
                return;
            }
            this.play(track);
        }
        catch (e) {
            console.log(e);
        }
    }
    async playPrevious() {
        try {
            const track = this._queue.previous();
            if (!track)
                return;
            this.play(track);
        }
        catch (e) {
            console.log(e);
        }
    }
    shuffle() {
        this._queue.shuffle();
    }
    stop() {
        try {
            this._player.stop();
            this._queue.clear();
        }
        catch (e) {
            console.log(`Stop error: ${e}`);
        }
    }
}
exports.Subscription = Subscription;

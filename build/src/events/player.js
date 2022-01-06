"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionPlayerListener = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const MessageSender_1 = require("../utils/MessageSender");
const config_json_1 = require("../../config.json");
const subscriptionPlayerListener = (s) => {
    let timeout;
    s.player.on('stateChange', async (oldState, newState) => {
        if (oldState.status === voice_1.AudioPlayerStatus.Idle && newState.status === voice_1.AudioPlayerStatus.Buffering) {
            if (timeout)
                clearTimeout(timeout);
        }
        if (oldState.status === voice_1.AudioPlayerStatus.AutoPaused && newState.status === voice_1.AudioPlayerStatus.Playing) {
            if (timeout)
                clearTimeout(timeout);
        }
        if (oldState.status === voice_1.AudioPlayerStatus.Buffering && newState.status === voice_1.AudioPlayerStatus.Playing) {
            if (!s.queue.current)
                return;
            const embed = new discord_js_1.MessageEmbed()
                .setColor('BLUE')
                .setThumbnail(s.queue.current.thumbnail.url)
                .addField('Сейчас играет', `[${s.queue.current.title}](${s.queue.current.link})`);
            await new MessageSender_1.MessageSender({ channel: s.channel, deletable: true, message: { embeds: [embed] } }).send();
        }
        if (oldState.status === voice_1.AudioPlayerStatus.Playing && newState.status === voice_1.AudioPlayerStatus.Idle) {
            s.playNext();
            if (!s.queue.current) {
                timeout = setTimeout(() => {
                    s.destroy();
                }, config_json_1.messageDeleteTimeout);
            }
        }
        if (oldState.status === voice_1.AudioPlayerStatus.Playing && newState.status === voice_1.AudioPlayerStatus.AutoPaused) {
            if (!s.queue.current) {
                timeout = setTimeout(() => {
                    s.destroy();
                }, config_json_1.messageDeleteTimeout);
            }
        }
    });
};
exports.subscriptionPlayerListener = subscriptionPlayerListener;

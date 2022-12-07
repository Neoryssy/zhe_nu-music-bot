"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionEvents = void 0;
const voice_1 = require("@discordjs/voice");
const discord_js_1 = require("discord.js");
const MessageSender_1 = require("../utils/MessageSender");
const config_json_1 = require("../../config.json");
const subscriptionEvents = (sub) => {
    let timeout;
    sub.player.on(voice_1.AudioPlayerStatus.AutoPaused, (oldState, newState) => {
        console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
        timeout = setTimeout(() => {
            sub.destroy();
        }, config_json_1.channelLeaveTimeout);
    });
    sub.player.on(voice_1.AudioPlayerStatus.Buffering, (oldState, newState) => {
        console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
    });
    sub.player.on(voice_1.AudioPlayerStatus.Idle, (oldState, newState) => {
        console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
        sub.playNext();
        timeout = setTimeout(() => {
            sub.destroy();
        }, config_json_1.channelLeaveTimeout);
    });
    sub.player.on(voice_1.AudioPlayerStatus.Paused, (oldState, newState) => {
        console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
    });
    sub.player.on(voice_1.AudioPlayerStatus.Playing, (oldState, newState) => {
        console.log(`OldState: ${oldState.status}, NewState ${newState.status}\n`);
        clearTimeout(timeout);
        if (oldState.status === voice_1.AudioPlayerStatus.Buffering) {
            const embed = new discord_js_1.MessageEmbed()
                .setColor('BLUE')
                .setThumbnail(sub.queue.current.thumbnail.url)
                .addField('Сейчас играет', `[${sub.queue.current.title}](${sub.queue.current.link})`);
            new MessageSender_1.MessageSender({ channel: sub.channel, deletable: true, message: { embeds: [embed] } }).send();
        }
    });
};
exports.subscriptionEvents = subscriptionEvents;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command/Command");
const e = async ({ subscription, message }) => {
    subscription.joinChannel(message.member.voice.channelId);
};
module.exports = new Command_1.GuildCommand({
    createSubscription: true,
    description: 'Присоединиться к текущему голосовому каналу',
    e,
    name: 'join',
});

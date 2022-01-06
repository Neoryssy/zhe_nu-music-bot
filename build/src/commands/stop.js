"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command");
const MessageSender_1 = require("../utils/MessageSender");
const e = async ({ subscription }) => {
    subscription.player.stop();
    subscription.queue.clear();
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE').setDescription('Воспроизведение остановлено, очередь очищена');
    new MessageSender_1.MessageSender({ channel: subscription.channel, message: { embeds: [embed] } }).send();
};
module.exports = new Command_1.GuildCommand({
    createSubscription: true,
    description: 'Остановить воспроизведение и очистить очередь',
    e,
    name: 'stop',
});

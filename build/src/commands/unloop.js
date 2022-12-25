"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command/Command");
const MessageSender_1 = require("../types/MessageSender/MessageSender");
const e = async ({ args, subscription }) => {
    subscription.queue.unloop();
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE').setDescription('Повтор трека выключен');
    new MessageSender_1.MessageSender({ channel: subscription.channel, message: { embeds: [embed] } }).send();
};
module.exports = new Command_1.GuildCommand({
    aliases: [],
    createSubscription: true,
    description: 'Выключить повтор композиции',
    e,
    name: 'unloop',
});

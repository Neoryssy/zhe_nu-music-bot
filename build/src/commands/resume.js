"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command");
const MessageSender_1 = require("../utils/MessageSender");
const e = async ({ args, subscription, message }) => {
    const current = subscription.queue.current;
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE');
    if (!current)
        embed.setDescription('Нет активного трека');
    else {
        subscription.player.unpause();
        embed
            .addField('Воспроизведение продолжено', `[${current.title}](${current.link})`)
            .setThumbnail(current.thumbnail.url);
    }
    new MessageSender_1.MessageSender({ channel: subscription.channel, message: { embeds: [embed] } }).send();
};
module.exports = new Command_1.GuildCommand({
    aliases: ['unpause'],
    createSubscription: true,
    description: 'Возобновить воспроизведение',
    e,
    name: 'resume',
});

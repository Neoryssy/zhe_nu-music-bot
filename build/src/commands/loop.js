"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command/Command");
const MessageSender_1 = require("../types/MessageSender/MessageSender");
const e = async ({ args, subscription }) => {
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE');
    const current = subscription.queue.current;
    if (!current)
        embed.setDescription('Нет активного трека');
    else {
        subscription.queue.loop();
        embed
            .addField('Повтор трека включен', `[${current.title}](${current.link})`)
            .setThumbnail(current.thumbnail.url);
    }
    new MessageSender_1.MessageSender({ channel: subscription.channel, message: { embeds: [embed] } }).send();
};
module.exports = new Command_1.GuildCommand({
    aliases: [],
    createSubscription: true,
    description: 'Включить повтор композиции',
    e,
    name: 'loop',
});

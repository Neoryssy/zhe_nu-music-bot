"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command/Command");
const MessageSender_1 = require("../types/MessageSender/MessageSender");
const e = async ({ args, subscription, message }) => {
    const start = Number(args[0]);
    const count = Number(args[1]);
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE');
    const descriptionElements = [];
    if (isNaN(start))
        embed.setDescription('Неверный формат номера');
    else {
        const tracks = subscription.queue.remove(+args[0], Number.isNaN(count) ? 1 : count);
        if (tracks === undefined)
            embed.setDescription('Нет треков с таким номером в очереди');
        else if (tracks.length === 0)
            embed.setDescription('Нет трека для удаления');
        else {
            embed.setTitle(`Треков удалено (${tracks.length})`);
            tracks.forEach((t, i) => {
                if (i >= 10)
                    return;
                descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link})`);
            });
            embed.setDescription(descriptionElements.join('\n'));
        }
    }
    new MessageSender_1.MessageSender({ channel: subscription.channel, message: { embeds: [embed] } }).send();
};
module.exports = new Command_1.GuildCommand({
    argsRequired: 'required',
    args: ['Номер'],
    createSubscription: true,
    description: 'Удалить композицию с указанным `номером` из очереди',
    e,
    name: 'remove',
});

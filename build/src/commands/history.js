"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command");
const e = async ({ subscription, message }) => {
    const history = [...subscription.queue.history];
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE');
    const descriptionElements = [];
    if (history.length === 0)
        embed.setTitle(`История пуста`);
    else
        embed.setTitle(`История`);
    history.forEach((t, i) => {
        if (i >= 10)
            return;
        descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link})`);
    });
    embed.setDescription(descriptionElements.join('\n'));
    message.channel.send({ embeds: [embed] });
};
module.exports = new Command_1.GuildCommand({
    createSubscription: true,
    description: 'Показать историю прослушивания',
    e,
    name: 'history',
});

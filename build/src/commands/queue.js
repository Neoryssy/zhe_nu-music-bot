"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command");
const config_json_1 = require("../../config.json");
const msToISO = (t) => {
    let iso;
    const hour = 3600000;
    if (t < 0)
        iso = '0:00';
    else if (t < hour)
        iso = new Date(t).toISOString().substr(14, 5);
    else if (t >= hour)
        iso = new Date(t).toISOString().substr(11, 8);
    return iso;
};
const e = async ({ subscription, message }) => {
    const queue = [...subscription.queue.queue];
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE');
    const descriptionElements = [];
    embed.setTitle(`Треков в очереди (${queue.length})`);
    if (subscription.queue.current) {
        let leftDuration;
        if (subscription.queue.current.lengthSeconds === 0)
            leftDuration = 'Live';
        else
            leftDuration = msToISO(subscription.queue.current.lengthSeconds * 1000 - subscription.resource.playbackDuration);
        descriptionElements.push('**Сейчас играет**');
        descriptionElements.push(`[${subscription.queue.current.title}](${subscription.queue.current.link})  \`${leftDuration}\``);
    }
    if (queue.length === 0) {
        descriptionElements.push('`Нет треков в очереди`');
        descriptionElements.push('');
        descriptionElements.push(`Чтобы добавить треки в очередь, воспользуйтесь командой \`${config_json_1.prefix}play<композиция>\``);
    }
    else {
        descriptionElements.push('');
        descriptionElements.push('**Треки в очереди**');
        queue.forEach((t, i) => {
            if (i >= 10)
                return;
            let leftDuration;
            if (t.lengthSeconds === 0)
                leftDuration = 'Live';
            else
                leftDuration = msToISO(t.lengthSeconds * 1000);
            descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link}) \`${leftDuration}\``);
        });
    }
    embed.setDescription(descriptionElements.join('\n'));
    message.channel.send({ embeds: [embed] });
};
module.exports = new Command_1.GuildCommand({
    aliases: ['q'],
    createSubscription: true,
    description: 'Показать очередь композиций',
    e,
    name: 'queue',
});

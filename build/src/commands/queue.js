"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command/Command");
const config_json_1 = require("../../config.json");
const moment_1 = __importDefault(require("moment"));
const e = async ({ subscription, message }) => {
    const queue = [...subscription.queue.queue];
    const embed = new discord_js_1.MessageEmbed().setColor('BLUE');
    const descriptionElements = [];
    embed.setTitle(`Треков в очереди (${queue.length})`);
    if (subscription.queue.current) {
        const lengthSeconds = subscription.queue.current.lengthSeconds;
        const duration = lengthSeconds === 0 ? 'Live' : moment_1.default.unix(lengthSeconds).utc().format('HH:mm:ss');
        descriptionElements.push('**Сейчас играет**');
        descriptionElements.push(`[${subscription.queue.current.title}](${subscription.queue.current.link})  \`${duration}\``);
    }
    if (queue.length === 0) {
        descriptionElements.push('');
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
            const lengthSeconds = t.lengthSeconds;
            const duration = lengthSeconds === 0 ? 'Live' : moment_1.default.unix(lengthSeconds).utc().format('HH:mm:ss');
            descriptionElements.push(`\`${i + 1}\` [${t.title}](${t.link}) \`${duration}\``);
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

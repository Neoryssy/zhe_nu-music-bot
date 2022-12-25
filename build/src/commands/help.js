"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
const Command_1 = require("../types/Command/Command");
const config_json_1 = require("../../config.json");
const e = ({ message }) => {
    const embed = new discord_js_1.MessageEmbed().setTitle('Доступные команды').setColor('BLUE');
    for (let [key, value] of index_1.client.commands) {
        embed.addField(`\`${config_json_1.prefix}${value.name} <${value.args.length ? value.args.join(' ') : ''}>\``, value.description, false);
    }
    message.channel.send({ embeds: [embed] });
};
module.exports = new Command_1.GuildCommand({
    description: 'Помощь по доступным командам',
    e,
    name: 'help',
});

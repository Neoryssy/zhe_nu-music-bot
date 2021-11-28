"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command");
const e = async ({ args, subscription, message }) => {
    subscription.player.unpause();
};
module.exports = new Command_1.GuildCommand({
    aliases: ['unpause'],
    createSubscription: true,
    description: 'Возобновить воспроизведение',
    e,
    name: 'resume',
});

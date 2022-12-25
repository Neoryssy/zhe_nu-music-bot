"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command/Command");
const e = async ({ args, subscription, message }) => {
    subscription.playPrevious();
};
module.exports = new Command_1.GuildCommand({
    aliases: ['prev'],
    createSubscription: true,
    description: 'Начать проигрывать предыдущую композицию',
    e,
    name: 'previous',
});

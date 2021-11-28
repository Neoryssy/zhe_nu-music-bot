"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command");
const e = async ({ args, subscription, message }) => {
    subscription.player.pause();
};
module.exports = new Command_1.GuildCommand({
    createSubscription: true,
    description: 'Приостановить воспроизведение',
    e,
    name: 'pause',
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command");
const e = async ({ args, subscription }) => {
    subscription.queue.unloop();
};
module.exports = new Command_1.GuildCommand({
    aliases: [],
    createSubscription: true,
    description: 'Выключить повтор композиции',
    e,
    name: 'unloop',
});

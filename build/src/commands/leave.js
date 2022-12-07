"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command");
const e = async ({ subscription }) => {
    if (!subscription.connection)
        return;
    subscription.connection.disconnect();
};
module.exports = new Command_1.GuildCommand({
    aliases: ['exit'],
    createSubscription: true,
    description: 'Покинуть голосовой канал',
    e,
    name: 'leave',
});

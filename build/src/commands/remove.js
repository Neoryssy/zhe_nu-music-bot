"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command");
const e = async ({ args, subscription, message }) => {
    subscription.queue.remove(+args[0]);
};
module.exports = new Command_1.GuildCommand({
    argsRequired: 'required',
    args: ['Номер'],
    createSubscription: true,
    description: 'Удалить композицию с указанным `номером` из очереди',
    e,
    name: 'remove',
});

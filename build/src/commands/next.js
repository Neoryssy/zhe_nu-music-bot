"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command");
const e = async ({ args, subscription, message }) => {
    message.reply('Команда временно отключена из-за неправильной работы');
};
module.exports = new Command_1.GuildCommand({
    aliases: ['skip'],
    argsRequired: 'optional',
    args: ['?Номер'],
    createSubscription: true,
    description: 'Начать проигрывать следующую в очереди композицию, если указан `номер` пропустить все композиции до указанного номера',
    e,
    name: 'next',
});

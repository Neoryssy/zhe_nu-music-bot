"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Command_1 = require("../types/Command");
const e = async ({ subscription }) => {
    subscription.player.stop();
    subscription.queue.clear();
};
module.exports = new Command_1.GuildCommand({
    createSubscription: true,
    description: 'Остановить воспроизведение и очистить очередь',
    e,
    name: 'stop',
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command");
const MessageSender_1 = require("../utils/MessageSender");
const Search_1 = require("../utils/Search");
const TrackQueue_1 = require("../types/TrackQueue");
const e = async ({ args, message }) => {
    const searchResult = await Search_1.Search.search(args.join(' '));
    const row = new discord_js_1.MessageActionRow();
    const selectMenu = new discord_js_1.MessageSelectMenu()
        .setCustomId('search-select')
        .setPlaceholder('Выберите композицию')
        .setMaxValues(1)
        .addOptions([
        ...searchResult.map((e) => {
            return {
                description: e instanceof TrackQueue_1.Track ? 'Видео' : 'Плейлист',
                label: e.title,
                value: e.link,
            };
        }),
    ]);
    row.addComponents(selectMenu);
    await new MessageSender_1.MessageSender({
        channel: message.channel,
        deletable: true,
        message: { content: 'Выбор композиции', components: [row] },
    }).send();
};
module.exports = new Command_1.GuildCommand({
    argsRequired: 'required',
    args: ['Название'],
    createSubscription: true,
    description: 'Поиск композиции по `названию`',
    e,
    name: 'search',
});

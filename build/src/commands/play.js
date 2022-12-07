"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const Command_1 = require("../types/Command");
const Search_1 = require("../utils/Search");
const TrackQueue_1 = require("../types/TrackQueue");
const MessageSender_1 = require("../utils/MessageSender");
const e = async ({ args, subscription, message, member }) => {
    try {
        const channelId = member?.voice.channelId || message.member?.voice.channelId;
        const embed = new discord_js_1.MessageEmbed().setColor('BLUE');
        const searchResult = await Search_1.Search.search(args.join(' '));
        const item = searchResult[0];
        if (!channelId) {
            console.log('Voice channel id not provided');
            return;
        }
        subscription.joinChannel(channelId);
        if (item instanceof TrackQueue_1.Track) {
            await subscription.addAndPlayTrack(item);
            embed.addField('Трек добавлен в очередь', `[${item.title}](${item.link})`);
        }
        if (item instanceof TrackQueue_1.Playlist) {
            await subscription.addAndPlayTrack(item.items);
            embed.addField('Плейлист добавлен в очередь', `[${item.title}](${item.link})`);
        }
        embed.setThumbnail(item.thumbnail.url);
        new MessageSender_1.MessageSender({
            channel: subscription.channel,
            deletable: true,
            message: { embeds: [embed] },
        }).send();
    }
    catch (e) {
        console.log(e);
    }
};
module.exports = new Command_1.GuildCommand({
    argsRequired: 'required',
    args: ['Название'],
    createSubscription: true,
    description: 'Добавляет в очередь новую композицию',
    e,
    memberRequired: true,
    name: 'play',
});

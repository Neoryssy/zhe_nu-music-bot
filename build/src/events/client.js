"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientEvents = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = require("../../config.json");
const clientEvents = (client) => {
    client.on('interactionCreate', (i) => {
        if (!i.isSelectMenu())
            return;
        if (i.customId === 'search-select') {
            let row;
            if (i.component instanceof discord_js_1.MessageSelectMenu) {
                i.component.disabled = true;
                row = new discord_js_1.MessageActionRow().addComponents(i.component);
            }
            i.update({ content: 'Композиция выбрана', components: row ? [row] : [] });
            const args = i.values;
            const command = client.commands.get('play');
            const options = { args, message: i.message, member: i.member };
            command.execute(options);
        }
    });
    client.on('error', (e) => {
        console.log(e);
    });
    client.on('messageCreate', async (message) => {
        if (!message.content.startsWith(config_json_1.prefix) || message.author.bot)
            return;
        const args = message.content.slice(config_json_1.prefix.length).trim().split(/ +/);
        const commandName = args.shift()?.toLowerCase();
        const options = { args, message, member: message.member };
        let command = undefined;
        for (let [k, v] of client.commands) {
            if (v.aliases.includes(commandName)) {
                command = v;
                break;
            }
        }
        if (!command)
            return;
        try {
            command.execute(options);
        }
        catch (e) {
            console.log(e);
            message.channel.send('Ошибка при выполнении команды');
        }
    });
    client.once('ready', async () => {
        console.log('\n\nBot has been successfully started');
        console.log(`Invite link: ${await client.generateInvite({
            permissions: 'ADMINISTRATOR',
            scopes: ['bot'],
        })}`);
    });
};
exports.clientEvents = clientEvents;

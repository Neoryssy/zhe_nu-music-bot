import { MessageSelectMenu, MessageActionRow, Message } from 'discord.js';
import { ExecuteOptions } from '../types/Command';
import { MusicBot } from '../types/MusicBot';
import { prefix } from '../../config.json';

export const clientEvents = (client: MusicBot) => {
  client.on('interactionCreate', (i) => {
    if (!i.isSelectMenu()) return;

    if (i.customId === 'search-select') {
      let row;
      if (i.component instanceof MessageSelectMenu) {
        i.component.disabled = true;
        row = new MessageActionRow().addComponents(i.component!);
      }

      i.update({ content: 'Композиция выбрана', components: row ? [row] : [] });
      const args: string[] = i.values;
      const command = client.commands.get('play')!;
      const options = { args, message: i.message, member: i.member! };

      //@ts-ignore
      command.execute(options);
    }
  });

  client.on('error', (e) => {
    console.log(e);
  });

  client.on('messageCreate', async (message: Message) => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;
    const args: string[] = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift()?.toLowerCase()!;
    const options: ExecuteOptions = { args, message, member: message.member! };
    let command = undefined;

    for (let [k, v] of client.commands) {
      if (v.aliases.includes(commandName)) {
        command = v;
        break;
      }
    }

    if (!command) return;

    try {
      command.execute(options);
    } catch (e) {
      console.log(e);
      message.channel.send('Ошибка при выполнении команды');
    }
  });

  client.once('ready', async () => {
    console.log('\n\nBot has been successfully started');
    console.log(
      `Invite link: ${await client.generateInvite({
        permissions: 'ADMINISTRATOR',
        scopes: ['bot'],
      })}`
    );
  });
};

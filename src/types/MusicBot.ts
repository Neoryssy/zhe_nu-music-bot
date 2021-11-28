import fs from 'fs';
import { Client, ClientOptions, Message, Snowflake } from 'discord.js';
import { Subscription } from './Subscription';
import { rootDir } from '../../index';
import path from 'path';
import { GuildCommand } from './Command';

export class MusicBot extends Client {
  private _commands = new Map<Snowflake, GuildCommand>();
  private _subscriptions = new Map<Snowflake, Subscription>();

  constructor(options: ClientOptions) {
    super(options);

    const ext = process.env.NODE_ENV === 'development' ? '.ts' : '.js';
    const commandFiles = fs
      .readdirSync(path.join(rootDir, 'src/commands/'))
      .filter((file) => file.endsWith(ext));

    for (const file of commandFiles) {
      const command: GuildCommand = require(`../commands/${file}`);
      this._commands.set(command.name, command);
    }
  }

  get commands() {
    return this._commands;
  }

  get subscriptions() {
    return this._subscriptions;
  }
}

import { MessageOptions, TextBasedChannels } from 'discord.js';
import { deleteEmbedMessage, messageDeleteTimeout } from '../../../config.json';

interface MessageSenderOptions {
  message: MessageOptions;
  channel: TextBasedChannels;
  deletable?: boolean;
}

export class MessageSender {
  private _channel: TextBasedChannels;
  private _deletable: boolean;
  private _message: MessageOptions;
  private _timeoutMS: number;

  constructor(options: MessageSenderOptions) {
    this._channel = options.channel;
    this._deletable = options.deletable === undefined ? deleteEmbedMessage : options.deletable;
    this._message = options.message;
    this._timeoutMS = messageDeleteTimeout;
  }

  get channel() {
    return this._channel;
  }

  get timeoutMS() {
    return this._timeoutMS;
  }

  async send() {
    try {
      const m = await this.channel.send(this._message);

      if (this._deletable) {
        setTimeout(async () => {
          await m.delete();
        }, this._timeoutMS);
      }
    } catch (e) {
      console.log(e);
    }
  }
}

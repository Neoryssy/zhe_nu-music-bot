"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageSender = void 0;
const config_json_1 = require("../../../config.json");
class MessageSender {
    constructor(options) {
        this._channel = options.channel;
        this._deletable = options.deletable === undefined ? config_json_1.deleteEmbedMessage : options.deletable;
        this._message = options.message;
        this._timeoutMS = config_json_1.messageDeleteTimeout;
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
        }
        catch (e) {
            console.log(e);
        }
    }
}
exports.MessageSender = MessageSender;

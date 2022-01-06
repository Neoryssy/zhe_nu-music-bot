"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MusicBot = void 0;
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const index_1 = require("../../index");
const path_1 = __importDefault(require("path"));
class MusicBot extends discord_js_1.Client {
    constructor(options) {
        super(options);
        this._commands = new Map();
        this._subscriptions = new Map();
        const ext = process.env.NODE_ENV === 'development' ? '.ts' : '.js';
        const commandFiles = fs_1.default
            .readdirSync(path_1.default.join(index_1.rootDir, 'src/commands/'))
            .filter((file) => file.endsWith(ext));
        for (const file of commandFiles) {
            const command = require(`../commands/${file}`);
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
exports.MusicBot = MusicBot;

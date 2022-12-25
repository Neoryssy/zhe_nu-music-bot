"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GuildCommand = exports.Command = void 0;
const index_1 = require("../../../index");
const SubscriptionEvents_1 = require("../../events/SubscriptionEvents");
const Subscription_1 = require("../Subscription/Subscription");
class Command {
    constructor(options) {
        this._aliases = [options.name];
        if (options.aliases)
            this._aliases.push(...options.aliases);
        this._argsRequired = options.argsRequired || 'none';
        if (this._argsRequired === 'required' && !options.args)
            throw new Error('Args required, but args template not provided');
        this._args = options.args || [];
        this._description = options.description;
        this._e = options.e;
        this._noArgsMessage = options.noArgsMessage || 'Не указаны аргументы';
        this._name = options.name;
    }
    get aliases() {
        return this._aliases;
    }
    get args() {
        return this._args;
    }
    get description() {
        return this._description;
    }
    get name() {
        return this._name;
    }
}
exports.Command = Command;
class GuildCommand extends Command {
    constructor(options) {
        super(options);
        this._onlyGuild = true;
        this._memberRequired = !!options.memberRequired;
        this._createSubscription = !!options.createSubscription;
    }
    async execute(options) {
        if (this._argsRequired === 'required' && !options.args)
            options.message.channel.send(this._noArgsMessage);
        if (this._onlyGuild && !options.message.guild)
            throw new Error('Not provided guild');
        if (this._memberRequired && !options.member)
            throw new Error('Not provided member');
        if (this._createSubscription && !options.subscription) {
            const message = options.message;
            const guild = message.guild;
            let subscription = index_1.client.subscriptions.get(guild.id);
            if (!subscription) {
                index_1.client.subscriptions.set(guild.id, new Subscription_1.Subscription({ guild: guild, textChannel: message.channel }));
                subscription = index_1.client.subscriptions.get(message.guildId);
                (0, SubscriptionEvents_1.subscriptionEvents)(subscription);
            }
            options.subscription = subscription;
        }
        await this._e(options);
    }
}
exports.GuildCommand = GuildCommand;

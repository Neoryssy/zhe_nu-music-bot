import { Subscription } from "./Subscription";


class QueueManager {
  constructor() {}

  private _subscriptions = new Map<any, Subscription>() ;

  addSubscription = (guildId, subscription: Subscription) => {
    try {
      if (this._subscriptions.has(guildId)) return;

      this._subscriptions.set(guildId, subscription);

      return this._subscriptions;
    } catch (e) {
      throw new Error(e);
    }
  };

  getSubscriptions = (guildId) => {
    try {
      if (!this._subscriptions.has(guildId)) return null;

      return this._subscriptions.get(guildId);
    } catch (e) {
      throw new Error(e);
    }
  };

  deleteSubscription = (guildId) => {
    try {
      if (!this._subscriptions.has(guildId)) throw new Error('Guild queue does not exist');

      this._subscriptions.delete(guildId);

      return true;
    } catch (e) {
      throw new Error(e);
    }
  };
}

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackQueue = exports.Track = exports.Playlist = void 0;
class Playlist {
    constructor(options) {
        this._items = options.items;
        this._link = options.link;
        this._title = options.title;
        this._thumbnail = options.thumbnail;
    }
    get items() {
        return this._items;
    }
    get link() {
        return this._link;
    }
    get title() {
        return this._title;
    }
    get thumbnail() {
        return this._thumbnail;
    }
}
exports.Playlist = Playlist;
class Track {
    constructor(options) {
        this._lengthSeconds = options.lengthSeconds;
        this._link = options.link;
        this._title = options.title;
        this._thumbnail = options.thumbnail;
    }
    get lengthSeconds() {
        return this._lengthSeconds;
    }
    get link() {
        return this._link;
    }
    get thumbnail() {
        return this._thumbnail;
    }
    get title() {
        return this._title;
    }
}
exports.Track = Track;
class TrackQueue {
    constructor() {
        this._list = [];
        this._position = -1;
    }
    get current() {
        if (this._position === -1 || this._position >= this._list.length)
            return null;
        return this._list[this._position];
    }
    get queue() {
        return this._list.slice(this._position + 1);
    }
    get history() {
        return this._list.slice(0, this._position);
    }
    add(t) {
        if (this._position === this._list.length)
            this._position--;
        if (t instanceof Track)
            this._list.push(t);
        if (t instanceof Array)
            this._list.push(...t);
        return this.queue;
    }
    clear() {
        this.clearQueue();
        this.clearHistory();
        this._position = -1;
    }
    clearHistory() {
        this._list.splice(0, this._position);
    }
    clearQueue() {
        this._list.splice(this._position);
    }
    jump(position) {
        if (position < 1)
            return null;
        this._position += position;
        if (this._position > this._list.length)
            this._position = this._list.length;
        return this.current;
    }
    next() {
        if (this._position === -1 && this._list.length === 0)
            return null;
        if (this._position === this._list.length)
            return null;
        this._position++;
        return this.current;
    }
    previous() {
        if (this._position - 1 < 0)
            return null;
        this._position--;
        return this._list[this._position];
    }
    remove(position) {
        if (position < 0 || position > this._list.length - 1)
            return;
        this._list.splice(position, 1);
    }
}
exports.TrackQueue = TrackQueue;

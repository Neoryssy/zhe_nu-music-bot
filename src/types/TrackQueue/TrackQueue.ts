import { Random } from '../../utils/Random';

export type Thumbnail = { height?: number | undefined; url: string; width?: number | undefined };

export interface PlaylistOptions {
  items: Track[];
  link: string;
  title: string;
  thumbnail: Thumbnail;
}

export interface TrackOptions {
  lengthSeconds: number;
  link: string;
  title: string;
  thumbnail: Thumbnail;
}

export class Playlist {
  private _items: Track[];
  private readonly _link: string;
  private readonly _title: string;
  private readonly _thumbnail: Thumbnail;

  constructor(options: PlaylistOptions) {
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

export class Track {
  private readonly _lengthSeconds: number;
  private readonly _link: string;
  private readonly _title: string;
  private readonly _thumbnail: Thumbnail;

  constructor(options: TrackOptions) {
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

export class TrackQueue {
  private _list: Track[] = [];
  private _looped: boolean = false;
  private _position: number = -1;

  get current() {
    if (this._position === -1 || this._position >= this._list.length) return null;
    return this._list[this._position];
  }
  get queue() {
    return this._list.slice(this._position + 1);
  }

  get history() {
    return this._list.slice(0, this._position);
  }

  add(t: Track | Track[]) {
    if (this._position === this._list.length) this._position--;
    if (t instanceof Track) this._list.push(t);
    if (t instanceof Array) this._list.push(...t);

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

  jump(position: number): Track | null {
    if (position < 1) return null;

    this._position += position;

    if (this._position > this._list.length) this._position = this._list.length;

    return this.current;
  }

  loop() {
    this._looped = true;
  }

  next(): Track | null {
    if (this._position === -1 && this._list.length === 0) return null;
    if (this._position === this._list.length) return null;

    if (this._looped) return this.current;
    else this._position++;

    return this.current;
  }

  previous(): Track | null {
    if (this._position - 1 < 0) return null;

    if (this._looped) return this.current;
    else this._position--;

    return this._list[this._position];
  }

  remove(position: number, deleteCount?: number) {
    if (position < 0 || position > this._list.length - 1) return;

    return this._list.splice(this._position + position, deleteCount || 1);
  }

  shuffle() {
    if (this._list.length === 0) return;

    const list = this._list.splice(this._position + 1);

    while (list.length > 0) {
      const pos = Random.getRandomInt(0, list.length - 1);
      const track = list.splice(pos, 1)[0];

      this._list.push(track);
    }
  }

  unloop() {
    this._looped = false;
  }
}

export class Queue {
  private _current = null;
  private _history = [];
  private _prevCount = 0;
  private _queue = [];

  constructor() {
  }

  addTracks = (tracks = []) => {
    try {
      if (!tracks.length) throw new Error('Tracks not specified');

      this._queue.push(...tracks);

      if (!this._current) this._current = this._queue.shift();

      return this._queue;
    } catch (e) {
      throw new Error(e);
    }
  };

  clearQueue = () => {
    this._queue = [];
  };

  getCurrent = () => {
    return this._current;
  };

  getQueue = () => {
    return this._queue;
  };

  nextTrack = () => {
    if (this._queue.length === 0) throw new Error('Queue is empty');

    this._prevCount = 0;
    this._current = this._queue.shift();

    this._history.push(this._current);

    return this._current;
  };

  prevTrack = () => {
    this._current = this._history[this._prevCount];
    this._prevCount++;

    return this._current;
  };

  removeTrack = (index) => {
    try {
      if (index > this._queue.length || index < 1) throw new Error('Track number is not valid');

      this._queue.splice(index - 1, 1);

      return this._queue;
    } catch (e) {
      throw new Error(e);
    }
  };
}
